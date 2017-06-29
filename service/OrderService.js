/**
 * Created by coolcao on 16/8/2.
 */

'use strict';

const areaService = require('./AreaService');
const Order = require('../model/Order.js');
const moment = require('moment');

/**
 *
 * @param order
 * @returns {Promise}
 */
var check_conflict = function (order) {

	/**
	 * 检测时间段是否冲突,如果冲突,返回true,并返回冲突的order,否则返回false
	 * @param order
	 * @param orders
	 * @returns {Promise}
	 */
	const check_time_conflict = function (order, orders) {
		let start = order.startTime;
		let end = order.endTime;
		let offset = order.offset;
		let duration = order.duration;
		let conflicts = [];
		let only_time_conflicts = [];
		let only_offset_conflicts = [];
		//将偏移量和持续量包装成一个对象{offset,duration}，然后进行比较
		let offsetConflict = function (a, b) {
			//将偏移量和持续时间转换成number
			a.offset = Number(a.offset);
			a.duration = Number(a.duration);
			b.offset = Number(b.offset);
			b.duration = Number(b.duration);
			let sa = [a, b].sort(function (x, y) {
				return x.offset - y.offset;
			});
			console.log(sa);
			a = sa[0];
			b = sa[1];
			if (a.offset + a.duration <= b.offset) {
				return false;
			} else {
				return true;
			}
		}
		//将开始时间和结束时间包装成一个对象{start,end}，进行比较
		let timeConflict = function (a, b) {
			a.start = moment(a.start);
			a.end = moment(a.end);
			b.start = moment(b.start);
			b.end = moment(b.end);
			let sa = [a, b].sort(function (x, y) {
				return x.start - y.start;
			});
			a = sa[0];
			b = sa[1];
			if (a.end > b.start) {
				return true;
			} else {
				return false;
			}
		}
		return new Promise(function (resolve, reject) {
			if (Array.isArray(orders)) {
				for (let o of orders) {
					let _start = o.startTime;
					let _end = o.endTime;
					let time_conflict = timeConflict({start: start, end: end}, {start: _start, end: _end});
					let offset_conflict = offsetConflict({offset: offset, duration: duration}, {
						offset: o.offset,
						duration: o.duration
					});
					console.log('-----------------------------------------');
					console.log(`time_conflict:${time_conflict}`);
					console.log(`offset_conflict:${offset_conflict}`);
					if (time_conflict && offset_conflict) {
						conflicts.push(o);
					} else if (time_conflict) {
						only_time_conflicts.push(o);
					} else if (offset_conflict) {
						only_offset_conflicts.push(o);
					}
				}
				if (conflicts.length > 0) {
					resolve({conflict: true, conflicts: conflicts});
				} else {
					//没有冲突，检测同一排期内个数是否超限
					if (only_time_conflicts.length >= conf.ORDER.CONFLICTS) {
						console.log('定向条件已超过' + conf.ORDER.CONFLICTS + '个订单');
						return reject({
							code: conf.ERRORS.ORDER_OUT_OF_LIMIT,
							name: '订单超限',
							message: '定向条件已超过' + conf.ORDER.CONFLICTS + '个订单',
							data: only_time_conflicts
						});
					}
					resolve({conflict: false, orders: orders});
				}
			} else {
				reject({
					message: 'check_time_conflict出错,参数orders列表应为数组',
					code: conf.ERRORS.ARGUMENTS_ERROR,
					name: '参数错误'
				});
			}
		});
	}

	//检测定向条件冲突
	const check_origin_conflict = function (order, orders) {
	}

	if (!order) {
		return Promise.reject({message: '检查订单冲突时,order不能为空', code: conf.ERRORS.ARGUMENTS_ERROR, name: '参数错误'});
	}
	return Order.findExsitSameStreamAndTime(order).then((result)=> {
		return check_time_conflict(order, result);
	}).then(function (result) {
		let conflict = result.conflict;
		if (conflict) {
			//排期冲突，继续检测定向
			let member_conflict = false;
			let area_conflict = false;
			let orders = result.conflicts;
			if (orders.length > 0) {
				let oids = orders.map(function (item) {
					return item.id;
				});
				return Order.getTargeting(oids).then(ts => {
					let memter_conflict_ids = [];
					let area_conflict_ids = [];
					ts = ts.filter(item => {
						return item.target_catelog == 'member' || item.target_catelog == 'area';
					});

					let mts = ts.filter(item => {
						return item.target_catelog == 'member';
					});
					let ats = ts.filter(item => {
						return item.target_catelog == 'area';
					});

					//console.log(order.member);
					for (let mt of mts) {
						//console.log(mt);
						if (order.member == '0' || mt.target_value == '0') {
							member_conflict = true;
							if (memter_conflict_ids.indexOf(mt.order_id) === -1)
								memter_conflict_ids.push(mt.order_id);
						} else if (mt.target_value == order.member) {
							member_conflict = true;
							if (memter_conflict_ids.indexOf(mt.order_id) === -1)
								memter_conflict_ids.push(mt.order_id);
						}
					}

					//如果地域条件不为空，进行地域冲突检测 否则不判断地域级别冲突
					if (JSON.parse(order.areas).length > 0 && ats.length > 0) {
						//地域定向
						//根据已有的定向条件查询
						// 从其他冲突上过滤过来的订单列表
						let opt = {
							zid: [],
							zpid: [],
							fid: [],
							fpid: []
						};

						// 刚刚保存的订单
						let oopt = {
							zid: [],
							zpid: [],
							fid: [],
							fpid: []
						};

						ts.forEach(item => {
							if (item.target_catelog == 'area') {
								if (item.operator == '=') {
									//正定向
									opt.zid.push(item.target_value >>> 0);
									opt.zpid.push(item.parent_id >>> 0);
								} else if (item.operator == '!') {
									//反定向，id不在该列表，parent在该父节点
									opt.fid.push(item.target_value >>> 0);
									opt.fpid.push(item.parent_id >>> 0);
								}
								//if(area_conflict_ids.indexOf(item.order_id) === -1)
								//    area_conflict_ids.push(item.order_id);
							}
						});
						console.log('order.targets:' + JSON.stringify(order.targets));
						order.targets.forEach(item => {
							if (item.target_catelog == 'area') {
								if (item.operator == '=') {
									//正定向
									oopt.zid.push(item.target_value >>> 0);
									oopt.zpid.push(item.parent_id >>> 0);
								} else if (item.operator == '!') {
									//反定向，id不在该列表，parent在该父节点
									oopt.fid.push(item.target_value >>> 0);
									oopt.fpid.push(item.parent_id >>> 0);
								}
							}
						});


						return Promise.all([areaService.queryIn(oopt), areaService.queryIn(opt)]).then(function (result) {
							let order_areas = result[0];
							let areas = result[1];

							for (let area of areas) {
								for (let a of order_areas) {
									if (a.id == area.id) {
										area_conflict_ids = area_conflict_ids.concat(areaService.findOrderByConflictArea(a.id, ats));
										// return Promise.resolve({conflict:true,conflicts:'地域定向冲突,'+ts.order_id});
										area_conflict = true;
									}
								}
							}
							//if(area_conflict_ids.indexOf(item.order_id) === -1)
							//    area_conflict_ids.push(item.order_id);

							let conflict_msg = '您的订单与下列订单冲突:<br/>';
							let conflict_ids = [];
							memter_conflict_ids.forEach(function(i){
								area_conflict_ids.forEach(function(ii){
									if (ii == i && !conflict_ids.includes(ii)){
										conflict_ids.push(ii);
										conflict_msg += `<li><a href="#/app/order/detail?id=${i}">${i}</a></li>`;
									}
								});
							});
							//if (area_conflict_ids.length > 0) {
								//conflict_msg += '地域冲突:[' + area_conflict_ids.toString() + '];'
							//}
							//if (memter_conflict_ids.length > 0) {
								//conflict_msg += '会员冲突:[' + memter_conflict_ids.toString() + '];'
							//}
							// TODO://前端处理异常消息
							return Promise.resolve({
								conflict: member_conflict && area_conflict && conflict_ids.length > 0,
								conflicts: conflict_msg
							});

						});
					} else {
						let conflict_msg = '您的订单与下列订单冲突:<br/>';
						memter_conflict_ids.forEach(function(i){
							conflict_msg += `<li><a href="#/app/order/detail?id=${i}">${i}</a></li>`;
						});
						// 没有地域定向,则直接寻找会员定向
						return Promise.resolve({
							conflict: member_conflict,
							conflicts: conflict_msg
						});
					}


				}).catch(err => {
					console.log(err);
					return Promise.reject({code: conf.ERRORS.SERVER_ERROR, name: '系统错误', message: err.message});
				});
			} else {
				return Promise.resolve({conflict: false});
			}
		} else {
			//不冲突
			return Promise.resolve(result);
		}

	}).catch((err)=> {
		if (err.code) {
			return Promise.reject({code: err.code, name: '订单超限', message: err.message, data: err.data});
		} else {
			return Promise.reject({code: conf.ERRORS.SERVER_ERROR, name: '系统错误', message: err.message});
		}
	});

}

module.exports = {
	check_conflict
}
