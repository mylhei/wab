'use strict';

const pool = require('../utils/MysqlUtils');
var areas = require('../areas');
/**
 *
 * @param opt
 * @returns {Promise}
 *
 */
const query = function (opt) {
	let sql = 'select * from afp.basic_area where 1 = 1 ';
	let values = [];

	if (opt) {
		console.log(opt);
		let keys = Object.keys(opt);
		for (let key of keys) {
			let item = opt[key];
			if (item.operator == '=') {
				sql = sql + ' and ' + key + ' = ? ';
			} else if (item.operator == '!') {
				sql = sql + ' and ' + key + ' != ? '
			}

			values.push(opt[key].value);
		}
	}

	console.log(sql);
	console.log(values);
	return new Promise((resolve, reject) => {
		pool.queryAfp(sql, values, function (err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
}
/**
 * {
 *     in:[],
 *     not_in:[],
 *     parent_id:[]
 * }
 * @remark
 * 匹配的订单列表
 * 正-正 并集
 * 正-反 交集
 * 反-反 交集
 */
const queryIn = function (opt) {
	let _areas = areas;
	let z_areas = [];
	if (opt && ( opt.zid.length > 0 || opt.fid.length > 0 )) {
		if (opt.zid.length > 0) {
			for (let i = 0; i < opt.zid.length; ++i) {
				let filter_areas = [];
				let start = getAvailableArea(opt.zid[i]);
				filter_areas = _areas.filter(function (item) {
					return String(item.id).startsWith(start);
				});
				z_areas = z_areas.concat(filter_areas);
			}
		}

		if (opt.fid.length > 0) {
			/*let hasZ = true;
			if (z_areas.length <= 0) {
				z_areas = _areas;
				hasZ = false;
			}*/
			let f_filter=_areas //所有反定向漏下的数据
				;
			for (let i = 0; i < opt.fid.length; ++i) {
				// country
				let start4 = getAreaCountry(opt.fid[i]);
				// avaliable
				let start = getAvailableArea(opt.fid[i]);

				// 国家级
				if (getAvailableArea(opt.fid[i])== getAreaCountry(opt.fid[i])) {
					//在所有数据中找反
					f_filter = f_filter.filter(function (item) {
						return !String(item.id).startsWith(start4);
					});
				} else {
					// 城市级
					f_filter = f_filter.filter(function (item) {
						return String(item.id).startsWith(start4) && !String(item.id).startsWith(start);
					});
				}
			}
			console.log('+++++++++++++');
			console.log(z_areas);
			//console.log(f_filter);
			if (z_areas.length > 0){
				// 有正定向,则
				z_areas = f_filter.filter(item => {
					for(let i = 0 ; i < z_areas.length;++i){
						if (item.id == z_areas[i].id) {
							return true;
						}
					}
					return false;
				});
				console.log(z_areas);

			}else {
				// 只有反定向
				z_areas = f_filter;
			}
		}
console.log('#####+++++++++++++');

		return z_areas;
	} else {
		return [];
	}
}

const queryIn_de = function (opt) {
	let sql = 'select * from afp.basic_area a where 1 = 1 ';
	let values = [];
	if (opt) {
		if (opt.zid.length > 0 && opt.zpid.length > 0) {
			sql = sql + ' and ( id in (?) or parent_id in (?) ) '
			values.push(opt.zid);
			values.push(opt.zpid);
			//sql = sql + ' and ( id in (?) or parent_id in (?) or country_id in (?) ) '
			//values.push(opt.zpid);
		}
		if (opt.fid.length > 0 && opt.fpid.length > 0) {
			let countrys = [], citys = [], pCitys = [];
			for (let i = 0; i < opt.fid.length; ++i) {
				// 国家级
				if (opt.fid[i] == opt.fpid[i] && String(opt.fid[i]).endsWith('000000')) {
					countrys.push(opt.fid[i]);
				} else {
					// 城市级
					citys.push(opt.fid[i]);
					pCitys.push(opt.fpid[i]);
				}
			}
			if (countrys.length > 0) {
				sql = sql + ' and  ( id not in (?) and type=0 ) '
				values.push(countrys);
			}
			if (citys.length > 0) {
				sql = sql + ' and  ( id not in (?) and parent_id in (?) ) '
				values.push(citys);
				values.push(pCitys);
			}

		}

	}
	//console.log(sql);
	//console.log(values);
	return new Promise((resolve, reject) => {
		pool.queryAfp(sql, values, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
}

/**
 * 根据冲突定向,寻找冲突订单
 * @param areaId
 * @param orders
 */
const findOrderByConflictArea = function (areaId, orders) {
	if (Array.isArray(orders)) {
		return orders.filter(item => {
			return isAreasConflicted(areaId, item.target_value, item.operator);
		}).map(item => {
			return item.order_id;
		});
	}
	return [];
};

const isAreasConflicted = function (code, target, operator) {
	code = String(code);
	if (operator == '=') {
		return String(code).startsWith(getAvailableArea(target));
	} else if (operator == '!') {
		let country = getAreaCountry(target),
			availableArea = getAvailableArea(target);
		if (availableArea == country) { // 国家级
			return !code.startsWith(country);
		} else {
			return code.startsWith(country) && !code.startsWith(availableArea);
		}
	}
};

/**
 * 获取地区码的国家码 例如1156522300 => 例如1156
 * @param code
 * @returns {string}
 */
const getAreaCountry = function (code) {
	return String(code).substring(0, 4);
};

/**
 * 获取有效区域,即去掉结尾的0 ,例如1156522300 => 11565223
 * @param code
 * @returns {string}
 */
const getAvailableArea = function (code) {
	return String(code).replace(/0+?$/, '')
};

const convertCode2Name = function(code){
	let _areas = areas;
	return _areas.filter(item => {
		return item.id == code;
	})[0];
};

const convertCode2NameBatch = function(codes){
	let result = [];
	let codeArr = [];
	if(typeof codes == 'string'){
		codeArr = codes.split(',');
	}else if (Array.isArray(codes)){
		codeArr = codes;
	}

	return codeArr.map(item =>{
		return convertCode2Name(item) || {
				id:item,
				name:'未知'
			};
	}) ;

};

module.exports = {
	query,
	queryIn,
	findOrderByConflictArea,
	convertCode2NameBatch
};