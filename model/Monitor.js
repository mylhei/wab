/**
 * Created by leiyao on 16/4/5.
 */
'use strict';
var pool = require('../utils/MysqlUtils');
var util = require('util');
var Q = require('q');
var async = require('async');
var BaseModel = require('./BasicModel');

var PushState = require('./PushState');
var TABLE_NAME = "monitor";
var pushState = new PushState(TABLE_NAME);

//call update_monitor('favorite-impr',39,101,NULL,4,'喜欢 曝光喜欢 曝光','',3,1)
var INSERT_SQL = "call update_monitor( ?,?,?,?,?,?,?,?,?)";
var INSERT_MONITOR = "insert into `monitor` (  `component`,`creative_id`, `ad_id`, `oiid`, `type`, `typename`,  `url`, `creator`,`source`) values (?,?,?,?,?,?,?,?,?);";
var UPDATE_MONITOR_STATE_BY_ID = "UPDATE monitor set monitor.state=1,monitor.url=? where monitor.id=?;";
var SELECT_EXSIT_MONITOR = "select id from `monitor` where monitor.`ad_id`=? and monitor.component=? and monitor.type=? and monitor.source=? limit 1;";
var SELECT_BY_ADID_SQL = "select * from `monitor` where ad_id = ? and state=1";
var DELETE_BY_ADID = "delete from monitor where ad_id=? and source!=1;";
var DELETE_SELF_BY_ADID = "update `monitor` set state=0  where ad_id = ? and state!=0;";
var COPY_MONITOR_BY_ADID = "insert into monitor(component,creative_id,ad_id,oiid,type,typename,offset,url,source,creator,state) select component,creative_id,?,oiid,type,typename,offset,url,source,?,state from monitor where ad_id = ? and state =1";

function Monitor() {
    this.Members = {
        'id': {},
        'component': {
            default: ''
        },
        'creative_id': {},
        'ad_id': {},
        'oiid': {
            default: ''
        },
        'type': {},
        'typename': {},
        'offset': {},
        'url': {},
        'creator': {},
        'source': {},
        'createtime': {}
    };
    this.init.apply(this, arguments);
}

Monitor.prototype = {
    initWithData: function (id, component, creative_id, ad_id, oiid, type, typename, url, creator, source, offset) {
        if (id) this.id = id;
        this.component = component == null ? '' : component;
        this.creative_id = creative_id;
        this.ad_id = ad_id;
        if (oiid) this.oiid = oiid;
        this.type = type || 1;
        this.typename = typename || '';
        this.url = url || '';
        this.creator = creator;
        this.source = source;
        this.offset = offset;
    },
    generate: function () {
        return Monitor.create(this);
    }
};

Monitor.create = function (obj) {
    var deferred = Q.defer();

    return deferred.promise();
};
Monitor.generateByAd = function (ad_id, list, callback) {
    var funcArr = [];
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err);
            pool.releaseConnection(conn);
            return;
        }
        list.forEach(function (n) {
            funcArr.push(function (callback) {
                pool.insertWithConn(conn, INSERT_MONITOR, [n.component, n.creative_id, n.ad_id, n.oiid, n.type, n.typename, n.url, n.creator, n.source], function (err, result) {
                    console.log("insert patch \n" + err);
                    console.log(result);
                    callback(err, result);
                });
            })
        });
        async.parallel(funcArr, function (err, results) {
            if (err) {
                callback(err);
            } else {
                Monitor.pushState(ad_id, list);
                callback(null, results);
            }

            pool.releaseConnection(conn);
        });
    });
};

Monitor.updateByAd = function (adid, list) {
    var deferred = Q.defer();
    if (!list || list.length == 0) {
        deferred.resolve(null);
    }
    pool.getConnection(function (err, conn) {
        var funcArr = [
            function (callback) {
                pool.query(DELETE_BY_ADID, [adid], function (err, data) {
                    callback(err, data);
                });
            },
            function (callback) {
                pool.query(DELETE_SELF_BY_ADID, [adid], function (err, data) {
                    callback(err, data);
                });
            }
        ];
        list.forEach(function (n) {
            funcArr.push(function (callback) {
                if (n.source == conf.TRACKING_SOURCE.OTHER) {
                    pool.insertWithConn(conn, INSERT_MONITOR, [n.component, n.creative_id, n.ad_id, n.oiid, n.type, n.typename, n.url, n.creator, n.source], function (err, result) {
                        console.log("update-insert patch \n" + err);
                        console.log(result);
                        callback(err, result);
                    });
                } else {
                    //var SELECT_EXSIT_MONITOR = "select id from `monitor` where monitor.`ad_id`=? and monitor.component=? and monitor.type=? and monitor.source=? limit 1;";
                    pool.query(SELECT_EXSIT_MONITOR, [adid, n.component, n.type, conf.TRACKING_SOURCE.WAB], function (err, result) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (result && result.length > 0) {
                                var mid = result[0].id;
                                //更新url 和 状态
                                pool.insertWithConn(conn, UPDATE_MONITOR_STATE_BY_ID, [n.url, mid], function (err, result) {
                                    console.log("update-udpate patch \n" + err);
                                    console.log(result);
                                    callback(err, result);
                                });
                            } else {
                                pool.insertWithConn(conn, INSERT_MONITOR, [n.component, n.creative_id, n.ad_id, n.oiid, n.type, n.typename, n.url, n.creator, n.source], function (err, result) {
                                    console.log("update-insert patch \n" + err);
                                    console.log(result);
                                    callback(err, result);
                                });
                            }
                        }
                    });
                }
            });
        });
        async.series(funcArr, function (err, reply) {
            if (err) {
                deferred.reject(err);
            } else {
                Monitor.pushState(adid, list);
                deferred.resolve(reply);
            }
            pool.releaseConnection(conn);
        });
    });
    return deferred.promise;
};

/**
 *
 * @param adid
 * @param needFormat 是不是需要格式化
 * @returns {*}
 */
Monitor.findByAdId = function (adid, needFormat) {
    var deferred = Q.defer();
    pool.query(SELECT_BY_ADID_SQL, [adid], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply && reply.length > 0) {
                reply.forEach(function (n) {
                    arr.push(new Monitor(n).ado());
                });
            }
            if (needFormat)
                deferred.resolve(Monitor.format(arr));
            else {
                deferred.resolve(arr);
            }
        }
    });
    return deferred.promise;
};

/**
 *
 * @param list
 * @param showInternal 是否展示内部监测
 * @returns {{Impression: Array, Click: {}, OtherEvents: {}}}
 */
Monitor.format = function (list, showInternal) {
    var Trackings = {
        impr: [],
        clickUrl: {},
        events: [],
        eventsGroup: {}
    };

    list.forEach(function (n, i) {
        /*if (!showInternal) {
         if (n.source == 1 && n.type != 2) {
         return;
         }
         }*/

        if (n.type == 1) {
            Trackings.impr.push(n);
        } else if (n.type == 2) {
            Trackings.clickUrl = n;
        } else if (n.type == 4) {
            Trackings.events.push(n);
            if (!Trackings.eventsGroup[n.component]) {
                Trackings.eventsGroup[n.component] = [];
            }
            Trackings.eventsGroup[n.component].push(n);
        }
    });
    return Trackings;
};

/**
 * 推送监测消息
 * @param ad_id 广告ID
 * @param list 监测列表
 * @param type upadte or delete
 * @returns {*} promise
 */
Monitor.pushState = function (ad_id, list, type) {
    var deferred = Q.defer();

    Monitor.findByAdId(ad_id, false).then(function (list) {
        var json = {
            "table_name": "admonitor",
            "status": type || "update",
            "content": {
                "ad_id": String(ad_id),
                "monitors": []
            }
        };

        var userId;
        list.forEach(function (m) {
            userId = m.creator;
            var monitor = {
                type: String(m.source),
                offset: String(0),
                ext: ''
            };
            if (m.type == conf.TRACKING_TYPE.IMPRESSION) {
                monitor.event_type = conf.TRACKING_TYPE.IMPRESSION;
                monitor.event_name = '';
            } else if (m.type == conf.TRACKING_TYPE.CLICK_TRACKING) {
                monitor.event_type = conf.TRACKING_TYPE.CLICK_TRACKING;
                monitor.event_name = '';
            } else if (m.type == conf.TRACKING_TYPE.EVENT_TRACKING) {
                monitor.event_type = conf.TRACKING_TYPE.EVENT_TRACKING;
                monitor.event_name = m.component;
            }
            if (m.source == conf.TRACKING_SOURCE.WAB) {
                var queryDict = {
                    "mid": m.id,
                    "source": m.source,
                    "comid": encodeURIComponent(m.component || "")
                }, queryArr = [];
                for (var key in queryDict) {
                    queryArr.push(key + "=" + queryDict[key]);
                }

                monitor.url = conf.TRACKING_PREFIX + queryArr.join('&');
                if (m.type == conf.TRACKING_TYPE.CLICK_TRACKING) {
                    monitor.ext = "u=" + encodeURIComponent(m.url);
                } else if (m.type == conf.TRACKING_TYPE.EVENT_TRACKING && m.url) {
                    monitor.ext = "u=" + encodeURIComponent(m.url);
                }
            } else if (m.source == conf.TRACKING_SOURCE.OTHER) {
                monitor.url = m.url;
            }
            json.content.monitors.push(monitor);
        });
        pushState.init(ad_id, '推送监测地址', JSON.stringify(json), userId, type || 'online').log();
        deferred.resolve(pushState.push2Redis(json));

    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

Monitor.copy = function(adid,newAdId,userId){
    var deferred = Q.defer();
    pool.query(COPY_MONITOR_BY_ADID,[newAdId,userId,adid],function(data){
        Monitor.pushState(newAdId, null);
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};

util.inherits(Monitor, BaseModel);

module.exports = Monitor;