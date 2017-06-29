"use strict"
/**
 * Created by leiyao on 16/3/31.
 */
var pool = require('../utils/MysqlUtils');
var util = require('util');
var Q = require('q');
var BaseModel = require('./BasicModel');
var async = require('async');

var Order = require('./Order');
var Monitor = require('./Monitor');
var PushState = require('./PushState');
var TABLE_NAME = "ad";

var pushState = new PushState(TABLE_NAME);

var SELECT_BY_PLATFORM = "SELECT a.*,p.`name` as platformName ,c.id as cid,c.name as creativeName " +
    "FROM ad a " +
    "inner join platforms p " +
    "on a.platform = p.id " +
    "left join creatives c " +
    "on a.creative_id = c.id " +
    "WHERE state>0 and p.id = ? " +
    "ORDER BY a.updatetime desc,a.id desc;";
var SELECT_BY_PLATFORM_GID = "SELECT a.*,p.`name` as platformName ,c.id as cid,c.name as creativeName " +
    "FROM ad a " +
    "inner join platforms p " +
    "on a.platform = p.id " +
    "left join creatives c " +
    "on a.creative_id = c.id " +
    "WHERE a.groupId=? and state>0 and p.id = ? " +
    "ORDER BY a.updatetime desc ,a.id desc;";

var SELECT_ALL = "SELECT a.*,p.`name` as platformName ,c.id as cid,c.name as creativeName " +
    "FROM ad a " +
    "inner join platforms p " +
    "on a.platform = p.id " +
    "left join creatives c " +
    "on a.creative_id = c.id " +
    "WHERE state>0 " +
    "ORDER BY a.updatetime desc,a.id desc";

var SELECT_ALL_GID = "SELECT a.*,p.`name` as platformName,c.id as cid,c.name as creativeName " +
    "FROM ad a " +
    "inner join platforms p " +
    "on a.platform = p.id " +
    "left join creatives c " +
    "on a.creative_id = c.id " +
    "WHERE a.groupId=? and state>0 " +
    "ORDER BY a.updatetime desc,a.id desc";

var SELECT_AD_LIST_BY_IDS = "SELECT * FROM ad WHERE id in ?";

var SELECT_ONE = "SELECT a.*,p.`name` as platformName " +
    "FROM ad a " +
    "inner join platforms p " +
    "on a.platform = p.id " +
    "WHERE a.id=? " +
    "ORDER BY  a.updatetime desc,a.id desc";

var INSERT_SQL = "insert into `ad` ( `name`,`creative_id`,`platform`,`description`, `form`, `creator`, `groupId`,`updatetime`,`source`,`sourceId`) values ( ? , ? , ? , ? , ? , ? , ? ,CURRENT_TIMESTAMP,?,?);";

var UPDATE_SQL = "UPDATE `ad` SET `name`=?,`creative_id`=?,platform=?,description=?,form=?,updater=?,updatetime=?,source=?,sourceId=?,editAfterCopy=1 where id = ?;";

var UPDATE_STATE_SQL = "UPDATE `ad` SET `state`=?,updatetime=now(),updater=?,offlineReason=? where id=?";

var COPY_AD_BY_ID = "INSERT INTO ad( `name`, creative_id, platform, description, form, creator, updater, state, pushState, groupId ,isCopy,copyFrom,updatetime)SELECT concat(`name`,'-copy'), creative_id, platform, description, form, ?, ?, 1, 1, groupId,1,?,CURRENT_TIMESTAMP FROM ad WHERE id = ?"

var SELECT_AD_BY_SOURCE_GOODSID = "SELECT * FROM ad WHERE source = ? and sourceId = ? and state > 0";

function AD() {
    this.Members = {
        'id': {},
        'name': {},
        'creative_id': {},
        'form': {},
        'platform': {},
        'platformName': {},
        'description': {},
        'createtime': {},
        'updatetime': {},
        'creator': {},
        'updater': {},
        'groupId': {},
        'state': {},
        'isCopy': {},
        'offlineReason': {},
        'source': {
            'default': 1
        },
        'sourceId': {}
    };
    this.init.apply(this, arguments);
}

AD.prototype = {
    insert: function () {
        if (this.id > 0) {
            return this.update(this);
        } else {
            return AD.insert(this);
        }
    },
    update: function () {
        return AD.update(this);
    },
    copy: function (userId) {
        return AD.copy(this, userId);
    },
    changeState: function (newState, creator) {
        return AD.changeState(this, newState, creator);
    },
    pushState: function (newState, reason) {
        return AD.pushState(this, newState, reason);
    }
};

AD.status = ['删除', '上线', '暂停'];
AD.status_code = {
    DELETED: 0,
    ONLINE: 1,
    PAUSE: 2
};
AD.OFFLINE_REASON = {
    "MANUAL": "手动暂停投放",
    "ALI_GOODS_SoldOut": "阿里商品被售空",
    "ALI_GOODS_Delete": "阿里商品被删除",
    "ALI_GOODS_DownShelf": "阿里商品下架"
};

AD.SOURCE = {
    "LEMALL": 1,
    "BAICHUAN": 2,
    "VOTE":3
};

AD.insert = function (obj) {
    var deferred = Q.defer();
    if (obj && typeof obj == 'object') {
        if (obj.constructor.name != 'BaseModel') {
            obj = new AD(obj);
        }
        pool.insert(INSERT_SQL, [obj.name, obj.creative_id, obj.platform, obj.description, obj.form, obj.creator, obj.groupId || 0, obj.source, obj.sourceId], function (err, reply) {
            if (err) {
                deferred.reject(err);
            } else {
                obj.id = reply.insertId;
                if (obj.id) {
                    var pushResult = obj.pushState('insert');
                    console.log('pushResult:' + pushResult);
                }
                deferred.resolve(reply);
            }
        });
    }
    return deferred.promise;
};

AD.update = function (obj) {
    var deferred = Q.defer();
    if (obj && typeof obj == 'object') {
        if (obj.constructor.name != 'BaseModel') {
            obj = new AD(obj);
        }
        pool.insert(UPDATE_SQL, [obj.name, obj.creative_id, obj.platform, obj.description, obj.form, obj.updater, obj.updatetime, obj.source, obj.sourceId, obj.id], function (err, reply) {
            if (err) {
                deferred.reject(err);
            } else {
                var pushResult = obj.pushState('update');
                console.log('pushResult:' + pushResult);
                deferred.resolve(reply);
            }
        });
    }
    return deferred.promise;
};

/**
 * 根据商品获取商品信息
 * @param source
 * @param goodsId
 * @param callback
 */
AD.getAdByGoodsId = function (source, goodsId, callback) {
    pool.query(SELECT_AD_BY_SOURCE_GOODSID, [source, goodsId], callback);
};

/**
 * 通过商品ID暂停广告
 * @param source 来源 AD.SOURCE.BAICHUAN
 * @param goodsId 商品ID
 * @param userId 操作员 默认conf.SOLDIER.messagerId
 * @param reason AD.OFFLINE_REASON.ALI_GOODS_Delete ,AD.OFFLINE_REASON.ALI_GOODS_DownShelf,ALI_GOODS_SoldOut
 * @returns {*} promise
 */
AD.pauseByGoodsId = function (source, goodsId, userId, reason) {
    var deferred = Q.defer();
    AD.getAdByGoodsId(source, goodsId, function (err, reply) {
        if (reply && reply.length > 0) {
            var funcArr = [];
            reply.forEach(function (n) {
                funcArr.push(function (callback) {
                    AD.pauseOrderByAdId(n.id, AD.status_code.PAUSE, userId, reason).then(function (reply) {
                        callback(null, reply);
                    }, function (err) {
                        callback(err, null);
                    });
                });
            });
            async.parallel(funcArr, function (err, results) {
                if (err)
                    deferred.reject(err);
                else
                    deferred.resolve(results);
            });
        } else {
            deferred.resolve();
        }
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 阿里商品更改价格
 * @param source 来源 AD.SOURCE.BAICHUAN
 * @param goodsId 商品ID
 * @param userId 操作员 默认conf.SOLDIER.internalId
 * @param goods 变化后的商品原型 goods.prom_price 价格格式:719.00
 */
AD.changeGoodsProperty = function (source, goodsId, userId, goods) {
    //TODO:现在是改变了商品价格,其他元素还没修改
    var price = goods.prom_price;
    var deferred = Q.defer();
    userId = conf.SOLDIER.internalId;
    AD.getAdByGoodsId(source, goodsId, function (err, reply) {
        if (reply && reply.length > 0) {
            var funcArr = [];
            reply.forEach(function (n) {
                funcArr.push(function (callback) {
                        //只处理阿里商品
                        if (n.source == AD.SOURCE.BAICHUAN) {
                            var ad = new AD(n);
                            var json = JSON.parse(ad.form);
                            json.ali_item_prom_price = String(price);
                            ad.form = JSON.stringify(json);
                            ad.update().then(function (data) {
                                callback(null, data);
                            }, function (err) {
                                callback(err, null);
                            });
                        } else {
                            callback(null, null);
                        }
                    }
                );
            });

            async.parallel(funcArr, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(data);
                }
            });

        } else {
            deferred.resolve([]);
        }
    });
    return deferred.promise;
};

/**
 * 广告暂停
 * @param adid
 * @param status
 * @param userId
 * @param reason
 * @returns {*}
 */
AD.pauseOrderByAdId = function (adid, status, userId, reason) {
    var defererd = Q.defer();
    Order.findByAdIdAState(adid, Order.status_code.ONLINE).then(function (reply) {
        var ad = {id: adid};
        //有关联订单
        if (reply && reply.length > 0) {
            Order.offlineOrderBatch(reply, Order.status_code.OFFLINE, userId, reason)
                .then(function () {
                    AD.changeState(ad, AD.status_code.PAUSE, userId, reason).then(function (data) {
                        defererd.resolve(reply);
                    }, function (err) {
                        defererd.reject(err);
                    });
                }).catch(function (err) {
                defererd.reject(err);
            })
        } else {
            AD.changeState(ad, AD.status_code.PAUSE, userId, reason).then(function (data) {
                defererd.resolve(data);
            }, function (err) {
                defererd.reject(err);
            }).catch(function (err) {
                defererd.reject(err);
            });
        }
    }, function (err) {
        defererd.reject(err);
    });
    return defererd.promise;
};

AD.changeState = function (obj, newState, creator, reason) {
    var deferred = Q.defer();
    if (obj && typeof obj == 'object') {
        if (obj.constructor.name != 'BaseModel') {
            obj = new AD(obj);
        }
        newState = parseInt(newState) || 0;
        AD.getAdById(obj.id).then(function (result) {
            let ad = new AD(result[0]);
            // newState == 0 删除 1正常 2暂停
            pool.update(UPDATE_STATE_SQL, [newState, creator, reason, ad.id], function (err, reply) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (newState == AD.status_code.ONLINE) {
                        let pushResult = ad.pushState('update', reason);
                        console.log('pushResult:' + pushResult);
                        deferred.resolve(reply);
                        //上线
                    } else if (newState == AD.status_code.PAUSE) {
                        let pushResult = ad.pushState('pause', reason);
                        console.log('PAUSE pushState:' + pushResult);
                        deferred.resolve(reply);
                    } else {
                        // 推送
                        let pushResult = ad.pushState('delete', reason);
                        console.log('DELETE pushState:' + pushResult);
                        deferred.resolve(reply);
                    }
                }
            });
            pushState.init(obj.id, AD.status[newState], "", creator).update();
        }, function (err) {
            deferred.reject(err);
        }).catch(function (err) {
            deferred.reject(err);
        });

    }
    return deferred.promise;
};


AD.getAllByPlatform = function (platform_id, userId, permission, gid) {
    var deferred = Q.defer();
    var sql = SELECT_ALL;
    var values = [];
    if (permission == -1) {
        if (platform_id) {
            sql = SELECT_BY_PLATFORM;
            values = [platform_id];
        }
    } else {
        if (platform_id) {
            sql = SELECT_BY_PLATFORM_GID;
            values = [gid, platform_id];
        } else {
            sql = SELECT_ALL_GID;
            values = [gid];
        }
    }
    pool.query(sql, values, function (err, reply) {
        if (!err) {
            deferred.resolve(reply);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};

AD.getAdById = function (id) {
    var deferred = Q.defer();
    pool.query(SELECT_ONE, [id], function (err, reply) {
        if (!err) {
            deferred.resolve(reply);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};

AD.getAdListByIds = function (ids) {
    if (ids instanceof ids && ids.length > 0) {
        return new Promise(resolve, reject)
        {
            pool.query(SELECT_AD_LIST_BY_IDS, ids, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.map(function (item) {
                        return new AD(item);
                    }));
                }
            });
        }
    } else {
        return Promise.reject('ids 参数必须是 素组')
    }
};

AD.copy = function (ad, userId) {
    var deferred = Q.defer();
    pool.query(COPY_AD_BY_ID, [userId, userId, ad.id, ad.id], function (err, reply) {
        if (!err) {
            var insertId = reply.insertId;
            if (insertId) {
                ad.id = insertId;
                var pushResult = AD.pushState(ad, 'copy');
                console.log('pushResult:' + pushResult);
                deferred.resolve(reply);
            } else {
                deferred.reject();
            }
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};

AD.pushState = function (ad, state, reason) {
    reason = reason || '';
    var json = {
        "table_name": "ad",
        "status": "STATUS",
        "content": {
            "ad_id": String(ad.id),
            "creative_id": String(ad.creative_id) || '0',
            "content": ad.form || ''
        }
    };
    switch (state) {
        case 'delete':
            json.status = 'delete';
            pushState.init(ad.id, '删除/暂停广告', '推送下线' + reason, ad.updater, 'offline');
            //TODO: 第一期删除广告,不通知引擎
            Monitor.pushState(ad.id, null, 'delete');
            break;
        case 'pause':
            json.status = 'delete';
            pushState.init(ad.id, '删除/暂停广告', '推送下线' + reason, ad.updater, 'offline');
            break;
        case 'insert':
            pushState.init(ad.id, '创建广告', '推送上线' + reason, ad.creator, 'online');
            json.status = 'update';
            break;
        case 'copy':
            pushState.init(ad.id, '复制广告', '推送上线' + reason, ad.creator, 'online');
            json.status = 'update';
        case 'update':
            pushState.init(ad.id, '更新广告', '推送修改' + reason, ad.updater, 'online');
            json.status = 'update';
            break;
    }
    pushState.log();
    return pushState.push2Redis(json);
};


util.inherits(AD, BaseModel);

module.exports = AD;