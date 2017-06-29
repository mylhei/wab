/**
 * Created by leiyao on 16/3/31.
 */
'use strict';
var pool = require('../utils/MysqlUtils');
var util = require('util');
var Q = require('q');
var BaseModel = require('./BasicModel');
var async = require('async');
var LeVideo = require('./LeVideo.js');

var PushState = require('./PushState');
var TABLE_NAME = "orders";
var pushState = new PushState(TABLE_NAME);

var LOOP_SQL = ["SELECT  * ,'up' as pushstate ",
    "    FROM  orders  ",
    "    WHERE  flag = 1 and state = 1 and deliverType='auto'",
    "	and startTime >= ? ",
    "	and startTime < DATE_ADD(?,INTERVAL 1 minute)",
    "union ALL",
    "SELECT  * ,'down' as pushstate ",
    "    FROM  orders  ",
    "    WHERE  flag = 1 and state = 2 ",
    "	and endTime <= DATE_ADD(?,INTERVAL 30 second)"].join(' ');

var INSERT_SQL = "insert into orders(`name`,ad_id,description,platform,deliverType,startTime,duration,endTime,creator,updatetime,offset,targetType,groupId,isCopy,copyFrom,editAfterCopy,orderType,coordinate,member,areas) values(?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?,?,?,?,?,?,?,?,?)";
var INSERT_TRAGETING_SQL = "insert into order_targeting(order_id,target_catelog,target_type,target_value,operator,parent_id) values (?,?,?,?,?,?)";
var DELETE_TRAGETING_SQL = "delete from order_targeting where order_id=?";
var UPDATE_ORDER = "UPDATE orders set `name`=? , ad_id=?,description=?,platform=?,deliverType=?,targetType=?,startTime=?,offset=?,duration=?,endTime=?,updater=? , updatetime=? ,state=1,coordinate=?,member=?,areas=? where id = ?";
var UPDATE_ORDER_STATE = "UPDATE orders set state=?,updatetime=now() where id=?";
//var UPDATE_ORDER_STATE_WITH_TIME = "UPDATE orders set state=?,startTime=?,endTime=? where id=?";
//如果是手动下线,则需要将自动投放模式改为手动模式
var UPDATE_ORDER_ONLINE_DELIVERTYPE = "UPDATE orders set state=?,deliverType=?,startTime=?,endTime=?,updatetime=now() where id=?";
var UPDATE_ORDER_OFFLINE_DELIVERTYPE = "UPDATE orders set state=?,deliverType=?,updatetime=now(),offlineReason=? where id=?";
var DELETE_ORDER = "UPDATE orders set flag = ? , state = 0,updatetime=now() where id = ?";
var FIND_EXSIT_STREAM_TIME = ["SELECT o.id,o.startTime,ot.target_type,ot.target_value,o.endTime FROM orders o ",
    "LEFT join order_targeting ot",
    "on o.id = ot.order_id ",
    "WHERE o.id !=? and o.state=2 and (startTime BETWEEN ? and ?",
    "or ? between startTime and endTime)",
    "and platform = ?",
    "and ot.target_value in (?)"].join(' ');
var FIND_EXSIT_VIDEO_ALBUM_TIME = ["SELECT o.id,o.startTime,ot.target_type,ot.target_value,o.endTime,o.offset,o.duration FROM orders o ",
    "LEFT join order_targeting ot",
    "on o.id = ot.order_id ",
    "WHERE o.id !=? and o.state=2 ",
    "and ot.target_type in ('album','video')",
    "and platform = ?",
    "and ot.target_value in (?)"].join(' ');

var FIND_EXSIT_VIDEO_ALBUM_TIME_BY_PARENT_ID = `SELECT o.id,o.startTime,ot.target_type,ot.target_value,o.endTime,o.offset,o.duration FROM orders o
LEFT join order_targeting ot
on o.id = ot.order_id
WHERE o.id !=? and o.state=2
and ot.target_type in ('album','video')
and platform = ?
and ot.parent_id in (?)
`;

var _FIND_EXSIT_VIDEO_ALBUM_TIME = `(SELECT o.id,o.startTime,ot.target_type,ot.target_value,o.endTime,o.offset,o.duration FROM orders o
LEFT join order_targeting ot
on o.id = ot.order_id
WHERE o.id !=? and o.state=2
and ot.target_type  in ('album','video')
and platform = ?
and ot.target_value in (?))
UNION
(SELECT o.id,o.startTime,ot.target_type,ot.target_value,o.endTime,o.offset,o.duration FROM orders o
LEFT join order_targeting ot
on o.id = ot.order_id
WHERE o.id !=? and o.state=2
and ot.target_type in ('album','video')
and platform = ?
and ot.parent_id in (?))
`;


var SELECT_BY_USER = ['SELECT o.*, p. NAME AS platformName',
    'FROM orders o',
    'INNER JOIN platforms p ON o.platform = p.id',
    'WHERE o.flag = 1 and o.creator=? ',
    'order by o.updatetime desc,o.id desc'].join(' ');

var SELECT_BY_ADID = ['select o.*',
    'from orders o',
    'where o.ad_id = ? and o.state > 0'].join(' ');

var SELECT_BY_ADID_STATE = ['select o.*',
    'from orders o',
    'where o.ad_id = ? and o.state = ?'].join(' ');

var SELECT_ALL = ['SELECT o.*, p. NAME AS platformName,a.name as adName',
    'FROM orders o',
    'INNER JOIN platforms p ON o.platform = p.id',
    'LEFT JOIN ad a on o.ad_id = a.id',
    'WHERE o.flag = 1',
    'order by o.updatetime desc ,o.id desc'].join(' ');

var SELECT_ALL_GID = ['SELECT o.*, p. NAME AS platformName,a.name as adName',
    'FROM orders o',
    'INNER JOIN platforms p ON o.platform = p.id',
    'LEFT JOIN ad a on o.ad_id = a.id',
    'WHERE o.flag = 1 and o.groupId=?',
    'order by o.updatetime desc ,o.id desc'].join(' ');

var SELECT_BY_PLATFORM = ['SELECT o.*, p. NAME AS platformName',
    'FROM orders o',
    'INNER JOIN platforms p ON o.platform = p.id',
    'WHERE o.flag = 1 AND platform=?',
    'order by o.startTime desc'].join(' ');

var SELECT_BY_ID = [
    'SELECT',
    '	o.*, p. NAME AS platformName,',
    '	ot.target_type,',
    '   ot.target_catelog,',
    '	ot.target_value,',
    '	ot.operator,',
    '	ot.parent_id',
    'FROM orders o',
    'INNER JOIN platforms p ON o.platform = p.id',
    'LEFT JOIN order_targeting ot ON ot.order_id = o.id',
    'WHERE o.id = ?',
    'ORDER BY o.startTime DESC'].join(' ');
var SELECT_BY_TARGETING = [
    'SELECT',
    '	o.*, p. NAME AS platformName,',
    '	ot.target_type,',
    '	ot.target_value,',
    '	ot.operator',
    'FROM orders o',
    'INNER JOIN platforms p ON o.platform = p.id',
    'LEFT JOIN order_targeting ot ON ot.order_id = o.id',
    'WHERE ot.target_type=? and ot.target_value=? and state!=0 and o.flag!=0',
    'ORDER BY o.startTime DESC'
].join(' ');

var SELECT_BY_TARGETING_GROUP = [
    'SELECT',
    '	o.*, p. NAME AS platformName,',
    '	ot.target_type,',
    '	ot.target_value,',
    '	ot.operator',
    'FROM orders o',
    'INNER JOIN platforms p ON o.platform = p.id',
    'LEFT JOIN order_targeting ot ON ot.order_id = o.id',
    'WHERE o.groupId=? and ot.target_type=? and ot.target_value=? and state!=0',
    'ORDER BY o.startTime DESC'
].join(' ');

var GET_ORDER_TARGETING = "SELECT * FROM order_targeting WHERE order_id = ?;";

let QUERY_ORDER_TARGETING = "select * from order_targeting where order_id in (?)";


function Order() {
    this.Members = {
        'id': {},
        'name': {},
        'ad_id': {},
        'description': {},
        'platform': {},
        'platformName': {},
        'adName': {},
        'deliverType': {
            'default': 'auto'
        },
        'startTime': {},
        'duration': {},
        'endTime': {},
        'state': {},
        'creator': {},
        'createtime': {},
        'streams': {},
        'albums': {},
        'videos': {},
        'targetType': {},
        'target_type':{},
        'target_catelog':{},
        'updater': {},
        'updatetime': {},
        'pushstate': {},
        'offset': {},
        'groupId': {},
        'isCopy':{},
        'copyFrom':{},
        'editAfterCopy':{},
        'orderType':0,   //是否是打点订单,0表示普通订单，1表示可视化打点订单,2表示智能打点
        'coordinate':{}, //可视化打点的坐标，x距视频左端的百分比，y是距视频顶端的百分比,这里是序列化后的json字符串
        'member':0,  //会员定向，0全部，1非会员，2会员,
        'areas':{
            'default':''
        },
        'targets':{
            'default':[]
        }

    };
    this.init.apply(this, arguments);

    if(Array.isArray(this.areas)){
        this.areas.forEach(item => {
            this.targets.push(new Order_Targeting({order_id:this.id,target_catelog:'area',target_type:'area',target_value:item.id,operator:(item.orient_type >>> 0) == 0 ?'!':'=',parent_id:item.parent_id}));
        });
        this.areas = JSON.stringify(this.areas);
    }
    if(this.targetType == 'live'){
        if(Array.isArray(this.streams)){
            this.streams.forEach(item => {
                this.targets.push(new Order_Targeting({order_id:this.id,target_catelog:'live',target_type:this.target_type,target_value:item,operator:'=',parent_id:null}));
            });
        }else if(typeof this.streams == 'string'){
            this.targets.push(new Order_Targeting({order_id:this.id,target_catelog:'live',target_type:this.target_type,target_value:this.streams,operator:'=',parent_id:null}));
        }
    }else if(this.targetType == 'vod'){
        if(this.albums.length > 0){
            this.albums.forEach(item => {
                this.targets.push(new Order_Targeting({order_id:this.id,target_catelog:'vod',target_type:'album',target_value:item.id,operator:'=',parent_id:item.parent_id}));
            });
        }
        if(this.videos.length > 0){
            this.videos.forEach(item => {
                this.targets.push(new Order_Targeting({order_id:this.id,target_catelog:'vod',target_type:'video',target_value:item.id,operator:'=',parent_id:item.parent_id}));
            })
        }
        
    }

    this.targets.push(new Order_Targeting({order_id:this.id,target_catelog:'member',target_type:'member',target_value:this.member,operator:'=',parent_id:null}));

}

function Order_Targeting() {
    this.Members = {
        'id': {},
        'order_id': {},
        'target_catelog':{},    //订单定向目录，有live（直播）和vod（点播）两个值
        'target_type': {},      //订单定向类型，直播有live,live_id,id2name,点播有album,video
        'target_value': {},
        'createtime': {},
        'operator': {},
        'parent_id': {}
    };
    this.init.apply(this, arguments);
}

Order.prototype = {
    insert: function () {
        return Order.insert(this);
    },
    update: function () {
        return Order.update(this);
    },
    pushState: function () {
        return Order.push2Redis(this);
    }
};

Order.insert = function (obj) {
    var defered = Q.defer();
    let insert_targeting_sql = INSERT_TRAGETING_SQL;
    let insert_sql = INSERT_SQL;

    //获取连接
    pool.getConnection((err,conn) => {
        if(err){
            defered.reject(err);
        }else{
            console.log(insert_sql);
            console.log([obj.name, obj.ad_id, obj.description, obj.platform, obj.deliverType, obj.startTime || undefined, obj.duration, obj.endTime || undefined, obj.creator, obj.offset, obj.targetType, obj.groupId || 0,obj.isCopy >>> 0 ,obj.copyFrom || undefined,obj.editAfterCopy >>> 0,obj.orderType >>> 0,obj.coordinate || null,obj.member,obj.areas]);
            conn.query(insert_sql,[obj.name, obj.ad_id, obj.description, obj.platform, obj.deliverType, obj.startTime || undefined, obj.duration, obj.endTime || undefined, obj.creator, obj.offset, obj.targetType, obj.groupId || 0,obj.isCopy >>> 0 ,obj.copyFrom || undefined,obj.editAfterCopy >>> 0,obj.orderType >>> 0,obj.coordinate || null,obj.member,obj.areas],(err,reply) => {
                if(err){
                    defered.reject(err);
                }else if(reply){
                    let newId = reply.insertId;
                    obj.id = newId;
                    pushState.init(newId, '新建订单', JSON.stringify(obj.ado()), obj.creator).update();
                    obj.targets.forEach(ot => {
                        ot.order_id = newId;
                    });
                    console.log(obj);
                    //拼装insert target的sql
                    
                    if(obj.targets.length > 1){
                        for(let i=1;i<obj.targets.length;i++){
                            insert_targeting_sql +=  ',(?,?,?,?,?,?)'
                        }
                    }
                    let insert_targets_parameter = [];
                    //order_id,target_catelog,target_type,target_value,operator,parent_id
                    obj.targets.forEach(item => {
                        insert_targets_parameter.push(item.order_id,item.target_catelog,item.target_type,item.target_value,item.operator,item.parent_id >>> 0);
                    });
                    console.log(insert_targeting_sql);
                    console.log(insert_targets_parameter);
                    conn.query(insert_targeting_sql,insert_targets_parameter,(err,result) => {
                        if(err){
                            defered.reject(err);
                        }else{
                            conn.release();
                            if (obj.deliverType == 'manual') {
                                // 手动上线,不需要推送上线
                                defered.resolve(reply);
                            } else {
                                obj.pushstate = "up";
                                Order.push2Redis(obj).then(function (data) {
                                    defered.resolve(reply);
                                }, function (err) {
                                    defered.reject(err);
                                });
                            }
                        }
                    });

                }
            });
        }
    });

    return defered.promise;

};

Order.update = function (obj) {
    var defered = Q.defer();

    let insert_targeting_sql = INSERT_TRAGETING_SQL;

    pool.getConnection((err,conn) => {
        if(err){
            conn.release();
            defered.reject(err);
        }else{
            conn.beginTransaction(err => {
                if(err){
                    conn.release();
                    defered.reject(err);
                }
                //先更新order
                conn.query(UPDATE_ORDER,[obj.name, obj.ad_id, obj.description, obj.platform, obj.deliverType, obj.targetType, obj.startTime || undefined, obj.offset, obj.duration, obj.endTime || undefined, obj.updater, obj.updatetime,obj.coordinate,obj.member,obj.areas, obj.id],(err,reply) => {
                    if(err){
                        return conn.rollback(function() {
                            defered.reject(err);
                        });
                    }else{
                        //更新order完成
                        console.log('更新order完成');
                        //删除定向条件
                        conn.query(DELETE_TRAGETING_SQL,[obj.id],(err,result) => {
                            if(err){
                                return conn.rollback(() => {
                                    defered.reject(err);
                                });
                            }else{
                                console.log('删除订单'+obj.id+'定向条件成功');
                                console.log('插入订单定向条件');
                                //拼装insert target的sql
                                if(obj.targets.length > 1){
                                    for(let i=1;i<obj.targets.length;i++){
                                        insert_targeting_sql +=  ',(?,?,?,?,?,?)'
                                    }
                                }
                                let insert_targets_parameter = [];
                                //order_id,target_catelog,target_type,target_value,operator,parent_id
                                obj.targets.forEach(item => {
                                    insert_targets_parameter.push(item.order_id,item.target_catelog,item.target_type,item.target_value,item.operator,item.parent_id >>> 0);
                                });
                                // console.log(INSERT_TRAGETING_SQL);
                                // console.log(insert_targets_parameter);
                                conn.query(insert_targeting_sql,insert_targets_parameter,(err,result) => {
                                    if(err){
                                        console.log('插入定向条件失败，进行回滚');
                                        return conn.rollback(() => {
                                            defered.reject(err);
                                        });
                                    }else{
                                        console.log('插入定向条件成功');
                                        conn.commit((err) => {
                                            if(err){
                                                console.log('事务提交失败，进行回滚');
                                                return conn.rollback(()=>{
                                                    defered.reject(err);
                                                });
                                            }
                                            if (obj.deliverType == 'manual') {
                                                if (obj.state == Order.status_code.ONLINE) {
                                                    obj.pushstate = "down";
                                                    Order.push2Redis(obj).then(function (data) {
                                                        defered.resolve(reply);
                                                    });
                                                } else {
                                                    // 手动上线,不需要推送上线
                                                    defered.resolve(reply);
                                                }
                                            } else {
                                                obj.pushstate = "up";
                                                Order.push2Redis(obj).then(function (data) {
                                                    defered.resolve(reply);
                                                });
                                            }
                                            // defered.resolve('提交成功');
                                            console.log('提交成功');
                                            conn.release();
                                        });
                                    }
                                });

                            }
                        });
                    }

                });
                
            });
        }
    });







    // pool.getConnection(function (err, conn) {
    //     if (err) {
    //         pool.releaseConnection(conn);
    //     } else {
    //         var funcArr = [function (callback) {
    //             //`name`=? , ad_id=?,description=?,deliverType=?,startTime=?,duration=?,endTime=?,updater=? , updatetime=?
    //             conn.query(UPDATE_ORDER, [obj.name, obj.ad_id, obj.description, obj.platform, obj.deliverType, obj.targetType, obj.startTime || undefined, obj.offset, obj.duration, obj.endTime || undefined, obj.updater, obj.updatetime,obj.coordinate, obj.id,obj.member], callback);
    //         }, function (callback) {
    //             conn.query(DELETE_TRAGETING_SQL, [obj.id], callback);
    //         }];
    //         if (obj.targetType == 'live') {
    //             if (Array.isArray(obj.streams)) {
    //                 obj.streams.forEach(function (n) {
    //                     if (n) {
    //                         funcArr.push(function (callback) {
    //                             conn.query(INSERT_TRAGETING_SQL, [obj.id, obj.targetType, obj.targetType, n, '=', null], callback);
    //                         });
    //                     }

    //                 });
    //             } else {
    //                 funcArr.push(function (callback) {
    //                     conn.query(INSERT_TRAGETING_SQL, [obj.id, obj.targetType, obj.target_type, obj.streams, '=', null], callback);
    //                 });
    //             }
    //         } else if (obj.targetType == 'vod') {
    //             if (obj.videos && obj.videos.length > 0) {
    //                 obj.videos.forEach(function (n) {
    //                     if (n) {
    //                         funcArr.push(function (callback) {
    //                             conn.query(INSERT_TRAGETING_SQL, [obj.id, obj.targetType, 'video', n.id, '=', n.parent_id], callback);
    //                         });
    //                     }

    //                 });
    //             }
    //             if (obj.albums && obj.albums.length > 0) {
    //                 obj.albums.forEach(function (n) {
    //                     if (n) {
    //                         funcArr.push(function (callback) {
    //                             conn.query(INSERT_TRAGETING_SQL, [obj.id, obj.targetType, 'album', n.id, '=', null], callback);
    //                         });
    //                     }

    //                 });
    //             }
    //         }

    //         pool.updateBatch(conn, funcArr, function (err, reply) {
    //             if (err) {
    //                 defered.reject(err);
    //             } else {
    //                 if (obj.deliverType == 'manual') {
    //                     if (obj.state == Order.status_code.ONLINE) {
    //                         obj.pushstate = "down";
    //                         Order.push2Redis(obj).then(function (data) {
    //                             defered.resolve(reply);
    //                         });
    //                     } else {
    //                         // 手动上线,不需要推送上线
    //                         defered.resolve(reply);
    //                     }
    //                 } else {
    //                     obj.pushstate = "up";
    //                     Order.push2Redis(obj).then(function (data) {
    //                         defered.resolve(reply);
    //                     });
    //                 }
    //             }
    //             pool.releaseConnection(conn);
    //         });
    //     }
    // });
    pushState.init(obj.id, '修改订单', JSON.stringify(obj.ado()), obj.updater).update();

    return defered.promise;
};

Order.findByUserId = function (userId) {
    var deferred = Q.defer();
    pool.query(SELECT_BY_USER, [userId], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply) {
                reply.forEach(function (n) {
                    arr.push(new Order(n).ado());
                })
            }
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};

Order.findAll = function (gid) {
    var deferred = Q.defer();
    var sql = SELECT_ALL, values = [];
    if (gid) {
        sql = SELECT_ALL_GID;
        values = [gid];
    }
    pool.query(sql, values, function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply) {
                reply.forEach(function (n) {
                    arr.push(new Order(n).ado());
                })
            }
            console.log('============');
            console.log(arr);
            deferred.resolve(arr);
            ;
        }
    });
    return deferred.promise;
};
Order.findByPlatform = function (pid) {
    var deferred = Q.defer();
    pool.query(SELECT_BY_PLATFORM, [pid], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply) {
                reply.forEach(function (n) {
                    arr.push(new Order(n).ado());
                })
            }
            deferred.resolve(arr);
            ;
        }
    });
    return deferred.promise;
};

Order.status = ['已删除', '待上线', '已上线', '已下线'];
Order.status_code = {
    "DELETE": 0,
    "PREPARE": 1,
    "ONLINE": 2,
    "OFFLINE": 3
};
Order.OFFLINE_REASON = {
    "TIMEOUT": "排期到期下线",
    "MANUAL": "手动下线",
    "ALI_GOODS_SoldOut": "阿里商品被售空",
    "ALI_GOODS_Delete": "阿里商品被删除",
    "ALI_GOODS_DownShelf": "阿里商品下架"
};
/**
 * 真正使用的是这个,进行下线操作
 * @param order
 * @param status
 * @param userId
 * @returns {*|promise}
 */
Order.updateOnlineState = function (order, status, userId, reason) {
    //status, oid, userId, startTime, endTime
    var deferred = Q.defer();
    var sql = UPDATE_ORDER_OFFLINE_DELIVERTYPE;
    // 默认改为手动投放
    var values = [status || 0, 'manual'];
    var state = 'down';
    if (status == Order.status_code.ONLINE) {
        sql = UPDATE_ORDER_ONLINE_DELIVERTYPE;
        values.push(order.startTime, order.endTime);
        state = 'up';
    } else if (status == Order.status_code.OFFLINE) {
        values.push(reason);
    }
    //如果是点播定向,则不需要更改delivertype,强制写成auto
    if (order.targetType == 'vod') {
        values[1] = 'auto';
    }
    values.push(order.id);
    order.pushstate = state;
    order.updater = userId;
    order.updateTime = new Date();
    Order.push2Redis(order, true).then(function (result) {
        pushState.init(order.id, '修改订单上线状态' + reason, Order.status[status], userId).update();
        if (result) {
            pool.query(sql, values, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(data);
                }
            });
        } else {
            deferred.reject(new Error('推送失败'));
        }
    });
    return deferred.promise;
};

Order.offlineOrderBatch = function (orders, status, userId, reason) {
    var deferred = Q.defer();

    if (orders instanceof Array) {
        var funcArr = [];
        orders.forEach(function (item) {
            if (item.state == Order.status_code.ONLINE) {
                funcArr.push(function (callback) {
                    Order.updateOnlineState(item, status, userId, reason).then(function (result) {
                        callback(null, result);
                    }, function (err) {
                        callback(err, null);
                    }).catch(function (err) {
                        callback(err, null);
                    });
                });
            }
        });
        async.parallel(funcArr, function (err, results) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(results);
            }
        });
    } else {
        deferred.reject(null);
    }

    return deferred.promise;
};

Order.changeOnlineState = function (status, oid, userId, startTime, endTime, reason) {
    var deferred = Q.defer();
    if (userId == conf.SOLDIER.internalId) {
        //自动上线
        pool.query(UPDATE_ORDER_STATE, [status || 0, oid], function (err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });
        pushState.init(oid, '修改订单状态', Order.status[status], userId).update();
    } else {
        //一旦进入这,就说明是手动的操作,
        var sql = UPDATE_ORDER_OFFLINE_DELIVERTYPE;
        var values = [status || 0, 'manual'];
        if (status == Order.status_code.ONLINE) {
            sql = UPDATE_ORDER_ONLINE_DELIVERTYPE;
            values.push(startTime, endTime);
        } else {
            values.push(reason);
        }
        values.push(oid);

        pool.query(sql, values, function (err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
            /* obj.pushstate = "up";
             Order.push2Redis(obj).then(function (data) {
             defered.resolve(reply);
             }, function (err) {
             defered.reject(err);
             });*/
        });
        pushState.init(oid, '修改订单状态' + reason, Order.status[status], userId).update();
    }
    return deferred.promise;
};

Order.delete = function (order, userId) {
    var deferred = Q.defer();
    order.pushstate = 'down';
    pool.query(DELETE_ORDER, [0, order.id], function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            Order.push2Redis(order).then(function () {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
        }
    });
    pushState.init(order.id, '删除订单', '删除订单', userId).delete();

    return deferred.promise;
};

Order.findById = function (oid) {
    var deferred = Q.defer();
    pool.query(SELECT_BY_ID, [oid], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            if (reply && reply.length > 0) {
                var order = new Order(reply[0]).ado();
                order.targets = [];
                order.streams = [];
                order.albums = [];
                order.videos = [];

                reply.forEach(function (n) {
                    if (n.target_type == 'live' && n.operator == '=') {
                        let target = new Order_Targeting(n).ado();
                        order.target_catelog = 'live';
                        order.target_type = 'live';
                        delete target.id;
                        delete target.createtime;
                        target.order_id = order.id;
                        order.targets.push(target);
                        order.streams.push(target.target_value);
                    } else if(n.target_type == 'live_id' && n.operator == '='){
                        var target = new Order_Targeting(n).ado();
                        order.target_catelog = 'live';
                        order.target_type = 'live_id';
                        delete target.id;
                        delete target.createtime;
                        target.order_id = order.id;
                        order.targets.push(target);
                        order.streams.push(target.target_value);
                    } else if (n.target_type == 'album' && n.operator == '=') {
                        let target = new Order_Targeting(n).ado();
                        order.target_catelog = 'vod';
                        order.target_type = 'album';
                        delete target.id;
                        delete target.createtime;
                        target.order_id = order.id;
                        target.parent_id = n.parent_id;
                        order.targets.push(target);
                        order.albums.push(target.target_value);
                    } else if (n.target_type == 'video' && n.operator == '=') {
                        let target = new Order_Targeting(n).ado();
                        order.target_catelog = 'vod';
                        order.target_type = 'video';
                        delete target.id;
                        delete target.createtime;
                        target.order_id = order.id;
                        target.parent_id = n.parent_id;
                        order.targets.push(target);
                        // video 结构改为 {id:xxx,parent_id:xxx}
                        order.videos.push({id: target.target_value, parent_id: target.parent_id});
                    }else {
                        let target = new Order_Targeting(n).ado();
                        delete target.id;
                        delete target.createtime;
                        target.order_id = order.id;
                        target.parent_id = n.parent_id;
                        order.targets.push(target);
                    }
                });
                //order.targetType = 'live';

            }
            deferred.resolve(order);
        }
    });
    return deferred.promise;
};

Order.getTargeting = function (oid) {
    var deferred = Q.defer();
    if (!oid) {
        deferred.resolve(null);
        return deferred.promise;
    }

    let sql = GET_ORDER_TARGETING;
    //查询单个
    if(Array.isArray(oid)){
        sql = QUERY_ORDER_TARGETING;
    }



    pool.query(sql, [oid], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply) {
                reply.forEach(function (n) {
                    arr.push(new Order_Targeting(n).ado());
                })
            }
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};

Order.loop = function (callback) {
    var deferred = Q.defer();

    var now = new Date();
    pool.query(LOOP_SQL, [now, now, now], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply && reply.length) {
                reply.forEach(function (n) {
                    var ado = new Order(n).ado();
                    if (ado.startTime && typeof ado.startTime == 'string')
                        ado.startTime = new Date(ado.startTime);
                    if (ado.endTime && typeof ado.endTime == 'string')
                        ado.endTime = new Date(ado.endTime);
                    arr.push(ado);
                });
            }
            deferred.resolve(arr);
        }
    });

    return deferred.promise;
};

function formatDate(date) {
    return String(Math.floor(date.getTime() / 1000));
}

Order.push2Redis = function (n, onlyPush) {
    var deferred = Q.defer();
    var json = {
        "table_name": "orderitem",
        "status": "STATUS",
        "content": {
            "id": String(n.id),
            "duration": String(n.duration),
            "type": "0",
            "adid": String(n.ad_id),
            "member":n.member,
            "positive": {
                "platform_ids": [String(n.platform)],
                "live_ids": [],
                "album_ids": [],
                "video_ids": [],
                "area_ids":[]
            },
            "negative": {
                "platform_ids": [],
                "live_ids": [],
                "album_ids": [],
                "video_ids": [],
                "area_ids":[]
            }
        }
    };

    //如果订单类型为可视化打点订单
    if(n.orderType == 1 || n.orderType == 2){
        if(typeof n.coordinate == 'string'){
            json.content.coordinate = JSON.parse(n.coordinate);
        }else{
            json.content.coordinate = n.coordinate;
        }
    }
    if(json.content.coordinate == ''){
        json.content.coordinate = {x:'',y:''}
    }

    if (n.targetType == 'vod') {
        delete json.content.positive.live_ids;
        delete json.content.negative.live_ids;
        if (n.offset != undefined) {
            json.content.offset = String(n.offset);
        } else {
            json.content.offset = "0";
        }
    } else if (n.targetType == 'live') {
        delete json.content.positive.album_ids;
        delete json.content.positive.video_ids;
        delete json.content.negative.album_ids;
        delete json.content.negative.video_ids;
        json.content.offset = "";
    } else {
        json.content.offset = "";
    }

    if (n.startTime) {
        if (n.startTime instanceof Date) {
            json.content.start_time = formatDate(n.startTime);
        } else {
            json.content.start_time = formatDate(new Date(n.startTime));
        }
    } else {
        json.content.start_time = '';
    }

    if (n.endTime) {
        if (n.endTime instanceof Date) {
            json.content.end_time = formatDate(n.endTime);
        } else {
            json.content.end_time = formatDate(new Date(n.endTime));
        }
    } else {
        json.content.end_time = '';
    }

    var pushRedis = function (n, json) {
        if(n.coordinate && Object.prototype.toString.call(n.coordinate) === '[object String]'){
            n.coordinate = JSON.parse(n.coordinate);
        }
        if(n.coordinate == ''){
            n.coordinate = {x:'',y:''}
        }

        if (n.pushstate == 'up') {
            pushState.init(n.id, '正在推送-上线', '上线', conf.SOLDIER.internalId, 'online');
            json.status = 'update';
        } else if (n.pushstate == 'down') {
            json.status = 'delete';
            pushState.init(n.id, '正在推送-下线', '下线', conf.SOLDIER.internalId, 'offline');
        }
        pushState.log();
        var result = pushState.push2Redis(json);
        return result;
    };

    if (n.targets && n.targets.length > 0) {
        n.targets.forEach(function (d) {
            switch (d.target_type) {
                case 'live':
                    if (d.operator == '=' && json.content.positive.live_ids)
                        json.content.positive.live_ids.push(String(d.target_value));
                    break;
                case 'album':
                    if (d.operator == '=' && json.content.positive.album_ids)
                        json.content.positive.album_ids.push(String(d.target_value));
                    break;
                case 'video':
                    if (d.operator == '=' && json.content.positive.video_ids)
                        json.content.positive.video_ids.push(String(d.target_value));
                    break;
                case 'area':
                    if (d.operator == '=' && json.content.positive.area_ids)
                        json.content.positive.area_ids.push(String(d.target_value));
                    else if(d.operator == '!' && json.content.negative.area_ids)
                        json.content.negative.area_ids.push(String(d.target_value));
                    break;

            }
        });
        var result = pushRedis(n, json);
        if (result && !onlyPush) {
            Order.changeOnlineState(n.pushstate == 'up' ? 2 : 3, n.id, conf.SOLDIER.internalId);
        }
        deferred.resolve(result);
    } else {
        Order.getTargeting(n.id).then(function (data) {
            data.forEach(function (d) {
                switch (d.target_type) {
                    case 'live':
                        if (d.operator == '=' && json.content.positive.live_ids)
                            json.content.positive.live_ids.push(d.target_value);
                        break;
                    case 'album':
                        if (d.operator == '=' && json.content.positive.album_ids)
                            json.content.positive.album_ids.push(d.target_value);
                        break;
                    case 'video':
                        if (d.operator == '=' && json.content.positive.video_ids)
                            json.content.positive.video_ids.push(d.target_value);
                        break;
                    case 'area':
                        if (d.operator == '=' && json.content.positive.area_ids)
                            json.content.positive.area_ids.push(d.target_value);
                        else if(d.operator == '!' && json.content.negative.area_ids)
                            json.content.negative.area_ids.push(d.target_value);
                        break;
                }
            });

            var result = pushRedis(n, json);
            if (result && !onlyPush) {
                Order.changeOnlineState(n.pushstate == 'up' ? 2 : 3, n.id, conf.SOLDIER.internalId);
            }
            deferred.resolve(result);
        }, function (err) {
            deferred.reject(err);
        });
    }
    return deferred.promise;

};
/**
 检查定向条件冲突
 @params order:订单对象
 @return data:是否冲突的订单信息
 **/
Order.findExsitSameStreamAndTime = function (order) {

    return new Promise(function (resolve, reject) {
        if (order.targetType == 'live' && (!order.streams || order.streams.length == 0)) {
            return reject({message:'参数错误，直播流不能为空'});
        } else if (order.targetType == 'vod' && (!order.albums || order.albums.length == 0) && (!order.videos || order.videos.length == 0)) {
            return reject({message:'参数错误，点播视频单集或专辑不能为空'});
        }
        if (order && order.targetType === 'vod') {
            //order.videos的格式是 {id:'aaa',parent_id:'123'}的格式

            let ttype = '';
            if(order.videos.length > 0){
                ttype = 'video';
            }else if(order.albums.length > 0){
                ttype = 'album';
            }else if(order.videos.length > 0 && order.albums.length > 0){
                return reject(new Error('定向条件暂只支持单集或专辑，不同时支持专辑和单集'));
            }

            let _videos = order.videos.map(function (item) {
                if(typeof item == 'string'){
                    return item;
                }else if(typeof item == 'object'){
                    return item.id;
                }
            });
            //这个地方忘了是什么时候添加的,忘记为什么了,如果有错误再放开,好像是mysql查询的时候报错
            // if(_videos.length == 0){
            //     _videos.push(null);
            // }
            let _albums = order.albums.map(function(a){
                if(typeof a == 'string'){
                    return a;
                }else if(typeof a == 'object'){
                    return a.id;
                }
            }).concat(order.videos.map(function (item) {
                if(typeof item == 'string'){
                    return item;
                }else if(typeof item == 'object'){
                    return item.parent_id;
                }
            }));


            let values = _videos.concat(_albums);
            values = values.filter(function (item) {
                return item != 0;
            });
            let sql = _FIND_EXSIT_VIDEO_ALBUM_TIME;
            //如果是专辑，需要查询target_value是其pid并且parent_id是其pid的
            let value = [order.id || 0, order.platform, values, order.id || 0, order.platform, values];

            //如果是单集，只查询target_value为vid+pid的即可
            if(ttype == 'video'){
                value = [order.id || 0, order.platform, values, order.id || 0, order.platform, null];
            }

            pool.query(sql, value, function (err, data) {
                console.log(sql);
                console.log(value);
                console.log('================order/findExsitSameStreamAndTime/sql=============');
                if (err) {
                    console.log('error:');
                    console.log(err);
                    return reject(err);
                } else {
                    console.log('data:');
                    console.log(JSON.stringify(data));
                    return resolve(data);
                }
            });

            // getAlbumIdsByVideos(order.videos).then(function (albums) {
            //     let _videos = order.videos;
            //     if(_videos.length == 0){
            //         _videos.push(null);
            //     }
            //     let _albums = albums? order.albums.concat(albums) : order.albums;
            //     let values = _videos.concat(_albums);
            //     let sql = _FIND_EXSIT_VIDEO_ALBUM_TIME;
            //     let value = [order.id||0,order.platform, values,order.id||0,order.platform,values];
            //     console.log(JSON.stringify(value));
            //
            //     pool.query(sql, value, function (err, data) {
            //         console.log(sql);
            //         console.log(value);
            //         console.log('================order/findExsitSameStreamAndTime/sql=============');
            //         if (err) {
            //             console.log('error:');
            //             console.log(err);
            //             return reject(err);
            //         } else {
            //             console.log('data:');
            //             console.log(JSON.stringify(data));
            //             return resolve(data);
            //         }
            //     });
            //
            // }).catch(function (err) {
            //     return reject(err);
            // });

        } else if (order.targetType === 'live') {
            //直播
            let sql = FIND_EXSIT_STREAM_TIME;
            let value = [order.id || 0, order.startTime, order.endTime, order.startTime, order.platform, order.streams];
            pool.query(sql, value, function (err, data) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(data);
                }
            });


        }
    });

};

Order.findOrderByTargeting = function (target_value, userId, type, groupId) {
    var deferred = Q.defer();
    var sql = SELECT_BY_TARGETING,
        values = [type, target_value];
    if (groupId) {
        sql = SELECT_BY_TARGETING_GROUP;
        values = [groupId, type, target_value];
    }
    pool.query(sql, values, function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply) {
                reply.forEach(function (n) {
                    arr.push(new Order(n).ado());
                })
            }
            deferred.resolve(arr);
        }
    });

    return deferred.promise;
};

Order.findByAdId = function (adid) {
    var defered = Q.defer();
    pool.query(SELECT_BY_ADID, [adid], function (err, data) {
        if (err) {
            defered.reject(err);
        } else {
            var arr = [];
            if (data && data.length > 0) {
                data.forEach(function (n) {
                    arr.push(new Order(n).ado());
                });
            }
            defered.resolve(arr);
        }
    });
    return defered.promise;
};

/**
 * 获取某些状态的订单,根据广告id
 * @param adid 广告ID
 * @param state 状态 要求使用Order.status_code类型
 * @returns {*}
 */
Order.findByAdIdAState = function (adid, state) {
    var defered = Q.defer();
    pool.query(SELECT_BY_ADID_STATE, [adid, state], function (err, data) {
        if (err) {
            defered.reject(err);
        } else {
            var arr = [];
            if (data && data.length > 0) {
                data.forEach(function (n) {
                    arr.push(new Order(n).ado());
                });
            }
            defered.resolve(arr);
        }
    });
    return defered.promise;
};

util.inherits(Order, BaseModel);
util.inherits(Order_Targeting, BaseModel);

module.exports = Order;
