var express = require('express');
var async = require('async');
var router = express.Router();
var User = require('../model/User');
var Utils = require('../utils/utils');
var Platform = require('../model/Platforms');
var Creative = require('../model/Creative');
var AD = require('../model/AD');
var Monitor = require('../model/Monitor');
var Stream = require('../model/Stream');
var LeAlbum = require('../model/LeAlbum');
var LeVideo = require('../model/LeVideo');
var Order = require('../model/Order');
var Handle_Log = require('../model/HandleLog');
var MongoPager = require('../model/MongoPager');
var UploadFile = require('../model/FileUpload');
var orderService = require('../service/OrderService.js');
var areaService = require('../service/AreaService.js');
var request = require('request');

/* GET users listing. */
router.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    if (req.baseUrl == '/api' && req.session && req.session.currentUser) {
        req.userId = req.session.currentUser.id;
        req.permission = req.session.currentUser.permission;
        req.groupId = req.session.currentUser.group;
    }
    if (!req.session.currentUser) {
        Utils.response(res, conf.ERRORS.NOT_LOGIN, "API未授权");
    } else {
        next();
    }
});

/***************** platform *********************/
router.get('/get_platforms', function (req, res, next) {
    Platform.getAll(req.userId, req.groupId).then(
        function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }
        , function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR);
        });
});
/***************** end platform *********************/

/***************** creative *********************/
/***************** 所有接口必须包含creative 以便路由拦截 *********************/
router.all('/*_creative*', function (req, res, next) {
    //TODO:增加权限验证

    next();
});
router.post('/save_creative', function (req, res, next) {
    var creative = new Creative(req.body);
    if (creative.id > 0) {
        // 说明是更新
        creative.updater = req.userId;
        creative.updatetime = new Date();
        creative.update().then(function (reply) {
            Utils.response(res, conf.ERRORS.OK, reply);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR);
        });
    } else {
        creative.creator = req.userId;
        //内部会处理更新的问题
        creative.insert().then(function (reply) {
            Utils.response(res, conf.ERRORS.OK, reply);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR);
        });
    }
});

router.get('/get_creatives/:pid?', function (req, res, next) {
    var pid = req.params['pid'];
    if (pid) {
        Creative.findListByPlatformId(pid, req.groupId).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        })
    } else {
        Creative.findAll(req.groupId).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        })
    }

});

router.get('/get_creative/:id', function (req, res, next) {
    var id = req.params.id;
    if (id && !isNaN(parseInt(id))) {
        Creative.findOneById(id).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function () {
            Utils.response(res, conf.ERRORS.DB_ERROR);
        });
    }
});

router.get('/del_creative/:id', function (req, res, next) {
    var id = req.params.id;
    if (id && !isNaN(parseInt(id))) {
        Creative.changeStatus(id, 0).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function () {
            Utils.response(res, conf.ERRORS.DB_ERROR);
        });
    }
});

/***************** end creative *********************/

/***************** ads ******************************/

router.all('*_ads', function (req, res, next) {
    //TODO:增加权限验证
    next();
});

/**
 *  插入,修改广告
 *  @test curl -d "%7b%26quot%3bform%26quot%3b%3a%7b%26quot%3bplatform%26quot%3b%3a2%2c%26quot%3bcreative_id%26quot%3b%3a23%2c%26quot%3bname%26quot%3b%3a%26quot%3b%e5%b9%bf%e5%91%8a%e5%90%8d%e7%a7%b0%26quot%3b%2c%26quot%3bdescription%26quot%3b%3a%26quot%3b%e6%8f%8f%e8%bf%b0%26quot%3b%2c%26quot%3bform%26quot%3b%3a%26quot%3b%7b%5c%26quot%3bdisplayURL%5c%26quot%3b%3a%5c%26quot%3b%e9%98%bf%e6%96%af%e9%a1%bf%e5%8f%91%e7%94%9f%e7%9a%84%5c%26quot%3b%2c%5c%26quot%3bindex%5c%26quot%3b%3a%5c%26quot%3b8%5c%26quot%3b%2c%5c%26quot%3btitle%5c%26quot%3b%3a%5c%26quot%3b234234234%5c%26quot%3b%2c%5c%26quot%3btime%5c%26quot%3b%3a%5c%26quot%3b%e6%98%af%e5%af%b9%e7%9a%84%e6%96%b9%e5%bc%8f%e5%9c%b0%e6%96%b9%e6%97%b6%e4%bb%a3%e5%9c%b0%e6%96%b9%5c%26quot%3b%2c%5c%26quot%3bdesc%5c%26quot%3b%3a%5c%26quot%3b%e9%98%bf%e8%bf%aa%e8%88%92%e6%9c%8d%e5%95%8a%e6%b0%b4%e7%94%b5%e8%b4%b9%5c%26quot%3b%2c%5c%26quot%3bxxx%5c%26quot%3b%3a%5b%7b%5c%26quot%3bdata%5c%26quot%3b%3a%5c%26quot%3b23123123%5c%26quot%3b%2c%5c%26quot%3btitle%5c%26quot%3b%3a%5c%26quot%3b%e5%9b%be%e7%89%87%e5%88%97%e8%a1%a8-1%5c%26quot%3b%7d%2c%7b%5c%26quot%3bdata%5c%26quot%3b%3a%5c%26quot%3b234234%5c%26quot%3b%2c%5c%26quot%3btitle%5c%26quot%3b%3a%5c%26quot%3b%e5%9b%be%e7%89%87%e5%88%97%e8%a1%a8-2%5c%26quot%3b%7d%2c%7b%5c%26quot%3bdata%5c%26quot%3b%3a%5c%26quot%3b234234%5c%26quot%3b%2c%5c%26quot%3btitle%5c%26quot%3b%3a%5c%26quot%3b%e5%9b%be%e7%89%87%e5%88%97%e8%a1%a8-3%5c%26quot%3b%7d%5d%2c%5c%26quot%3byyyy%5c%26quot%3b%3a%5b%7b%5c%26quot%3bdata%5c%26quot%3b%3a%5c%26quot%3b234234%5c%26quot%3b%2c%5c%26quot%3btitle%5c%26quot%3b%3a%5c%26quot%3byyy%e5%9b%be%e7%89%87%e5%88%97%e8%a1%a8-1%5c%26quot%3b%7d%2c%7b%5c%26quot%3bdata%5c%26quot%3b%3a%5c%26quot%3b234234%5c%26quot%3b%2c%5c%26quot%3btitle%5c%26quot%3b%3a%5c%26quot%3byyy%e5%9b%be%e7%89%87%e5%88%97%e8%a1%a8-2%5c%26quot%3b%7d%5d%7d%26quot%3b%7d%2c%26quot%3btracking%26quot%3b%3a%7b%26quot%3bimpr%26quot%3b%3a%7b%26quot%3b0%26quot%3b%3a%26quot%3b234234234%26quot%3b%2c%26quot%3b1%26quot%3b%3a%26quot%3b76756756%26quot%3b%7d%2c%26quot%3bclickUrl%26quot%3b%3a%26quot%3b234234%26quot%3b%2c%26quot%3botherEventsName%26quot%3b%3a%7b%26quot%3b0%26quot%3b%3a%26quot%3bxxx-click-0%26quot%3b%2c%26quot%3b1%26quot%3b%3a%26quot%3bxxx-impr-0%26quot%3b%7d%2c%26quot%3botherEventsTracking%26quot%3b%3a%7b%26quot%3b0%26quot%3b%3a%26quot%3b234234234%26quot%3b%2c%26quot%3b1%26quot%3b%3a%26quot%3b%e8%80%8c%e7%89%b9%e4%ba%ba%26quot%3b%7d%2c%26quot%3bEventTracking%26quot%3b%3a%7b%26quot%3bxxx-click-0%26quot%3b%3a%5b%26quot%3b234234234%26quot%3b%2c%26quot%3b234234234%26quot%3b%5d%2c%26quot%3bxxx-impr-0%26quot%3b%3a%5b%26quot%3b%e8%80%8c%e7%89%b9%e4%ba%ba%26quot%3b%2c%26quot%3b%e8%80%8c%e7%89%b9%e4%ba%ba%26quot%3b%5d%7d%7d%7d" http://127.0.0.1:3000/api/save_ads
 */
router.post('/save_ads', function (req, res, next) {
    var ad = new AD(req.body.form);
    var form = JSON.parse(ad.form);
    if (form.ali_item_id) {
        ad.source = AD.SOURCE.BAICHUAN;
        ad.sourceId = form.ali_item_id;
    } else if (form.goods_id) {
        ad.sourceId = form.goods_id;
    } else if(form.v_activityid){
        ad.source = AD.SOURCE.VOTE;
        ad.sourceId = form.v_activityid;
    }
    var convertBody2Monitors = function (newAdId, isUpdate) {
        var trackings = req.body.trackings;
        var imprs = [];
        if (trackings.impr) {
            //更新时,不需要生成id
            //if (!isUpdate)
            imprs.push(new Monitor(null, null, ad.creative_id, newAdId, null, conf.TRACKING_TYPE.IMPRESSION, "曝光", null, ad.creator, conf.TRACKING_SOURCE.WAB));
            for (var imr in trackings.impr) {
                //填了监测地址才会加入第三方,否则不加入
                if (trackings.impr[imr].url)
                    imprs.push(new Monitor(null, null, ad.creative_id, newAdId, null, conf.TRACKING_TYPE.IMPRESSION, "曝光", trackings.impr[imr].url, ad.creator, conf.TRACKING_SOURCE.OTHER));
            }
        }
        if (trackings.clickUrl && trackings.clickUrl.url) {
            imprs.push(new Monitor(null, null, ad.creative_id, newAdId, null, conf.TRACKING_TYPE.CLICK_TRACKING, "点击", trackings.clickUrl.url, ad.creator, conf.TRACKING_SOURCE.WAB));
        }
        if (trackings.events) {
            var uniqueKey = {};//每一种监测只生成一次系统监测
            for (var i in trackings.events) {
                var evt = trackings.events[i].component;
                var url = trackings.events[i].url;
                var title = trackings.events[i].title;
                if (!evt) {
                    //没有名字说明没选,所以不用填
                    continue;
                }
                if (evt.indexOf('-impr') > -1) {
                    if (!uniqueKey[evt]) {
                        uniqueKey[evt] = true;
                        //id,component,creative_id,ad_id,oiid,type,typename,url,creator,source,offset
                        imprs.push(new Monitor(null, evt, ad.creative_id, newAdId, null, conf.TRACKING_TYPE.EVENT_TRACKING, title, null, ad.creator, conf.TRACKING_SOURCE.WAB));
                    }
                    //填了url才需要入库
                    if (url)
                        imprs.push(new Monitor(null, evt, ad.creative_id, newAdId, null, conf.TRACKING_TYPE.EVENT_TRACKING, title, url, ad.creator, conf.TRACKING_SOURCE.OTHER));
                } else if (evt.indexOf('-click') > -1) {
                    // 点击只保存一条
                    if (!uniqueKey[evt]) {
                        uniqueKey[evt] = true;
                        imprs.push(new Monitor(null, evt, ad.creative_id, newAdId, null, conf.TRACKING_TYPE.EVENT_TRACKING, title, url, ad.creator, conf.TRACKING_SOURCE.WAB));
                    }
                } else if (evt.indexOf('-resp')) {
                    if (!uniqueKey[evt]) {
                        uniqueKey[evt] = true;
                        imprs.push(new Monitor(null, evt, ad.creative_id, newAdId, null, conf.TRACKING_TYPE.EVENT_TRACKING, title, url, ad.creator, conf.TRACKING_SOURCE.WAB));
                    }
                }
            }
        }
        return imprs;
    };
    if (ad.name.trim() == '') {
        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, "广告名称不可以为空!");
        return;
    }
    if (ad.id > 0) {
        // 说明是更新
        ad.updater = req.session.currentUser.id;
        ad.updatetime = new Date();
        var saveAd = function (callback) {
            ad.update().then(function (reply) {
                callback(null, reply);
                //Utils.response(res, conf.ERRORS.OK, reply);
            }, function (err) {
                callback(err, null);
                //Utils.response(res, conf.ERRORS.DB_ERROR);
            });
        };
        var updateMonitor = function (updateResult, callback) {
            var imprs = convertBody2Monitors(ad.id, true);
            Monitor.updateByAd(ad.id, imprs).then(function (data) {
                callback(null, data);
            }, function (err) {
                callback(err, null);
            });
        };
        //TODO 推送引擎
        async.waterfall([saveAd, updateMonitor], function (err, reply) {
            if (!err)
                Utils.response(res, conf.ERRORS.OK, ad);
            else
                Utils.response(res, conf.ERRORS.DB_ERROR);
        });

    } else {
        ad.creator = req.userId;
        ad.groupId = req.groupId;
        //内部会处理更新的问题
        ad.insert().then(function (reply) {
            var imprs = convertBody2Monitors(reply.insertId);
            var insertId = reply.insertId;
            Monitor.generateByAd(reply.insertId, imprs, function (err, reply) {
                if (err) {
                    Utils.response(res, conf.ERRORS.DB_ERROR);
                } else {
                    ad.id = insertId;
                    Utils.response(res, conf.ERRORS.OK, ad.ado());

                }
            });

        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR);
        });
    }
});

router.get('/get_ads/:pid?', function (req, res, next) {
    var platformId = req.params.pid;
    if (platformId) {
        AD.getAllByPlatform(platformId, req.userId, req.permission, req.groupId).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR);
        });
    } else {
        AD.getAllByPlatform(null, req.userId, req.permission, req.groupId).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR);
        });
    }
});

router.get('/get_ad/:id', function (req, res, next) {
    var id = req.params.id;
    if (id) {
        AD.getAdById(id).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        });
    } else
        Utils.response(res.conf.ERRORS.ARGUMENTS_ERROR);
});

router.get('/del_ad/:id', function (req, res, next) {
    var id = req.params.id;
    if (id) {
        var state = AD.status_code.DELETED;
        var ad = new AD({id: id});
        Order.findByAdId(id).then(function (data) {
            if (data && data.length > 0) {
                Order.offlineOrderBatch(data, Order.status_code.OFFLINE, req.userId).then(function (data) {
                    Utils.response(res, conf.ERRORS.OK, data);
                }, function (err) {
                    Utils.response(res, conf.ERRORS.DB_ERROR, err);
                }).catch(function (err) {
                    Utils.response(res, conf.ERRORS.DB_ERROR, err);
                });
                ad.changeState(state, req.userId);
            } else {
                ad.updater = req.userId;
                ad.changeState(state, req.userId).then(function (reply) {
                    Utils.response(res, conf.ERRORS.OK, reply);
                }, function (err) {
                    Utils.response(res, conf.ERRORS.DB_ERROR);
                });
            }
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        });
    } else {
        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR);
    }
});

router.get('/copy_ad/:id', function (req, res, next) {
    var id = req.params.id;
    if (id) {
        AD.getAdById(id).then(function (data) {
            if (data && data.length > 0) {
                var data = new AD(data[0]);
                data.copy(req.userId).then(function (result) {
                    if (result && result.insertId) {
                        Monitor.copy(id, result.insertId, req.userId);
                    }
                    Utils.response(res, conf.ERRORS.OK, result);
                }, function (err) {
                    Utils.response(res, conf.ERRORS.DB_ERROR);
                }).catch(function (err) {
                    Utils.response(res, conf.ERRORS.SERVER_ERROR);
                });
            } else {
                Utils.response(res, conf.ERRORS.AD_STATUS_NOT_OK, "目标广告不存在");
            }
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR);
        }).catch(function (err) {
            Utils.response(res, conf.ERRORS.SERVER_ERROR);
        })
    } else {
        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR);
    }
});

router.post('/update_ad_batch', function (req, res) {
    var method = req.body.method;
    var ids = req.body.ids;
    var idArr = ids.split(',');
    var deleteFunc = function (ids) {
        var state = AD.status_code.DELETED;
        var funcArr = [];
        var userId = req.userId;
        ids.forEach(function (id) {
            funcArr.push(
                new Promise(function (resolve, reject) {
                    let ad = new AD({id: id});
                    Order.findByAdId(id).then(function (data) {
                        if (data && data.length > 0) {
                            ad.changeState(state, userId);
                            Order.offlineOrderBatch(data, Order.status_code.OFFLINE, userId).then(function (result) {
                                resolve(result);
                            }).catch(function (err) {
                                reject(err);
                            })
                        } else {
                            ad.updater = userId;
                            ad.changeState(state, userId).then(function (result) {
                                resolve(result);
                            }).catch(function (err) {
                                reject(err);
                            });
                        }
                    }, function (err) {
                        reject(err);
                    });
                })
            );
        });

        return funcArr;
    };

    var changeStateFunc = function (ids, state) {
        var funcArr = [];
        if (state != 'update' && state != 'delete') {
            return funcArr;
        }
        ids.forEach(function (id) {
            funcArr.push(new Promise(function (resolve, reject) {
                AD.getAdById(id).then(function (data) {
                    let ad = new AD(data[0]);
                    let pushResult = ad.pushState(state, '批量推送引擎');
                    if (pushResult) {
                        Monitor.pushState(ad.id);
                        resolve(pushResult);
                    } else {
                        reject(false);
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }));
        });
        return funcArr;
    };

    switch (method) {
        case 'delete':
            Promise.all(deleteFunc(idArr)).then(function (values) {
                Utils.response(res, conf.ERRORS.OK, values);
            }).catch(function (err) {
                Utils.response(res, conf.ERRORS.DB_ERROR, err);
            });
            break;
        case 'online':
            Promise.all(changeStateFunc(idArr, 'update')).then(function (values) {
                Utils.response(res, conf.ERRORS.OK, values);
            }).catch(function (err) {
                Utils.response(res, conf.ERRORS.DB_ERROR, err);
            });
            break;
        case 'offline':
            Promise.all(changeStateFunc(idArr, 'delete')).then(function (values) {
                Utils.response(res, conf.ERRORS.OK, values);
            }).catch(function (err) {
                Utils.response(res, conf.ERRORS.DB_ERROR, err);
            });
            break;
        case 'pause':
            break;
        default:
            Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, "method参数非法");
            break;
    }
});
/***************** end ads **************************/

/***************** stream  **************************/

router.get('/get_streams/:key?', function (req, res, next) {
    var key = req.params.key;
    var limit = req.query.limit;
    if (key) {
        Stream.findLike(key).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        });
    } else {
        Stream.findAll(limit).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        });
    }
});

/***************** end stream  **********************/

/***************** order  **************************/

router.post('/save_order', function (req, res, next) {
    var form = req.body;
    console.log('---------------------api.js/save_order----------------------');
    console.log(JSON.stringify(form));
    if(typeof form.coordinate == 'object'){
        form.coordinate = JSON.stringify(form.coordinate);
    }
    var doSaveOrder = function (form) {
        if (form.targetType == 'live') {
            if (!form.duration) {
                form.duration = 15;
            }
            if (form.deliverType == 'auto') {
                //格式化时间
                form.startTime = new Date(form.startTime);
                // 在开始时间的基础上+duration + 2分钟
                form.endTime = Date.addMinute(Date.addSecond(form.startTime, form.duration), 2);
            } else {
                form.startTime = form.endTime = undefined;
            }
        } else if (form.targetType == 'vod') {
            var now = new Date();
            form.deliverType = 'auto';
            if (!form.duration) {
                form.duration = 15;
            }
            if (!form.offset) {
                form.offset = 0;
            }
            //格式化时间
            form.startTime = new Date(form.startTime);
            form.endTime = new Date(form.endTime);
            if (form.endTime <= form.startTime) {
                Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, "开始时间小于结束时间!");
                return;
            } else if (now > form.endTime) {
                Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, "订单排期时间已过期,请修改排期后继续操作!");
                return;
            }
            form.videos = form.videos || [];
            form.albums = form.albums || [];

        } else {
            Utils.response(res, conf.ERRORS.OK, null);
            return;
        }
        if (form.name == '') {
            Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, "订单名称不可以为空!");
            return;
        }
        var order = new Order(form);
        console.log('----------------------------api.js/save_order/405---------------');
        // Utils.response(res,conf.ERRORS.OK,'OK');
        // return ;
        if (order.id > 0) {
            order.updater = req.userId;
            order.updatetime = new Date();
            orderService.check_conflict(order).then((data)=>{
                if(data.conflict){
                    console.log(JSON.stringify(data));
                    console.log(Array.isArray(data.conflicts));
                    if(Array.isArray(data.conflicts)){
                        //时间冲突
                        Utils.response(res,conf.ERRORS.REPEAT_TIME_STREAM_ORDER,data.conflicts);
                    }else{
                        Utils.response(res,conf.ERRORS.ORIENT_CONFLICT,data.conflicts);
                    }
                }else{
                    order.update().then(function (reply) {
                        Utils.response(res,conf.ERRORS.OK,reply);
                    },function (err) {
                        console.log(err);
                        Utils.response(res,conf.ERRORS.DB_ERROR,err);
                    });
                }
            }).catch((err)=>{
                console.log('-------------api/save_order----------');
                console.log(JSON.stringify(err.data));
                // Utils.response(res,conf.ERRORS.DB_ERROR,err);
                // Utils.response(res,err.code,err.data);

                if(err.code == conf.ERRORS.ORDER_OUT_OF_LIMIT){
                    let msg = '订单超限，已存在订单id：';
                    let oids = [];
                    err.data.forEach(function (item) {
                        oids.push(item.id);
                    });
                    msg += oids.join(',');
                    Utils.response(res,err.code,msg);
                }else{
                    Utils.response(res,err.code,err.message);
                }

            });

        } else {
            console.log('------------新建order------------');
            order.creator = req.userId;
            order.groupId = req.groupId;
            orderService.check_conflict(order).then((data)=>{
                if(data.conflict){
                    console.log(JSON.stringify(data.conflicts));
                    if(Array.isArray(data.conflicts)){
                        Utils.response(res,conf.ERRORS.REPEAT_TIME_STREAM_ORDER,data.conflicts);
                    }else{
                        Utils.response(res,conf.ERRORS.ORIENT_CONFLICT,data.conflicts);
                    }
                }else{
                    order.insert().then(function (reply) {
                        Utils.response(res,conf.ERRORS.OK,reply);
                    },function (err) {
                        console.log(err);
                        Utils.response(res,conf.ERRORS.DB_ERROR,err);
                    })
                }
            }).catch((err)=>{
                console.log('---------------api.js/save_order新建订单--------------');
                console.log(err);
                if(err.code == conf.ERRORS.ORDER_OUT_OF_LIMIT){
                    let msg = '订单超限，已存在订单id：';
                    let oids = [];
                    err.data.forEach(function (item) {
                        oids.push(item.id);
                    });
                    msg += oids.join(',');
                    Utils.response(res,err.code,msg);
                }else{
                    Utils.response(res,err.code,err.message);
                }
            });

        }
    };

    AD.getAdById(form.ad_id).then(function (data) {
        if (data && data.length > 0) {
            var ad = new AD(data[0]);
            if (ad.state == AD.status_code.DELETED || ad.state == AD.status_code.PAUSE) {
                Utils.response(res, conf.ERRORS.AD_STATUS_NOT_OK, "该订单当前关联的广告状态为:[" + AD.status[parseInt(ad.state)] + "],不能保存!");
            } else {
                console.log('save order:'+JSON.stringify(form));
                doSaveOrder(form);
            }
        } else {
            Utils.response(res, conf.ERRORS.AD_STATUS_NOT_OK, "该订单当前关联的广告状态为:[" + AD.status[0] + "],不能上线!");
        }
    }, function (err) {
        Utils.response(res, conf.ERRORS.DB_ERROR, err);
    }).catch(function (err) {
        Utils.response(res, conf.ERRORS.DB_ERROR, err);
    });
});

router.get('/get_orders', function (req, res, next) {
    if (req.query.pid) {
        Order.findByPlatform(pid).then(function (reply) {
            Utils.response(res, conf.ERRORS.OK, reply);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        })
    } else if (req.query.self && req.permission != -1) {
        Order.findByUserId(req.userId).then(function (reply) {
            Utils.response(res, conf.ERRORS.OK, reply);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        })
    } else {
        Order.findAll(req.groupId).then(function (reply) {
            Utils.response(res, conf.ERRORS.OK, reply);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        })
    }
});

router.get('/get_stream_orders/:sid', function (req, res, next) {
    var sid = req.params.sid;
    if (sid) {
        Order.findOrderByTargeting(sid, req.userId, 'live', req.groupId).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        })
    } else {
        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR);
    }
});

router.get('/get_video_orders/:vid', function (req, res, next) {
    var vid = req.params.vid;
    if (vid) {
        Order.findOrderByTargeting(vid, req.userId, 'video', req.groupId).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        })
    } else {
        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR);
    }
});
router.get('/get_album_orders/:aid', function (req, res, next) {
    var aid = req.params.aid;
    if (aid) {
        Order.findOrderByTargeting(aid, req.userId, 'album', req.groupId).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        })
    } else {
        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR);
    }
});

router.get('/get_order/:oid', function (req, res, next) {
    var oid = req.params.oid;
    if (oid) {
        Order.findById(oid).then(function (reply) {
            console.log(JSON.stringify(reply));
            Utils.response(res, conf.ERRORS.OK, reply);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        });
    } else {
        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, err);
    }
});

router.get('/get_orders_targeting/:oid', function (req, res, next) {
    var oid = req.params.oid;
    Order.getTargeting(oid).then(function (reply) {
        Utils.response(res, conf.ERRORS.OK, reply);
    }, function (err) {
        Utils.response(res, conf.ERRORS.DB_ERROR, err);
    });
});

router.get('/get_orders_by_adid/:adid/:state?', function (req, res, next) {
    var adid = req.params.adid;
    var state = req.params.state;
    if (adid) {
        if (state == undefined) {
            Order.findByAdId(adid).then(function (reply) {
                Utils.response(res, conf.ERRORS.OK, reply);
            }, function (err) {
                Utils.response(res, conf.ERRORS.DB_ERROR, err);
            });
        } else {
            Order.findByAdIdAState(adid, state).then(function (reply) {
                Utils.response(res, conf.ERRORS.OK, reply);
            }, function (err) {
                Utils.response(res, conf.ERRORS.DB_ERROR, err);
            });
        }
    } else {
        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, err);
    }
});

router.post('/update_order_batch', function (req, res) {
    var method = req.body.method;
    var ids = req.body.ids;
    var idArr = ids.split(',');
    var deleteFunc = function (ids) {
        var state = AD.status_code.DELETED;
        var funcArr = [];
        var userId = req.userId;
        ids.forEach(function (id) {
            funcArr.push(
                new Promise(function (resolve, reject) {
                    let ad = new AD({id: id});
                    Order.findByAdId(id).then(function (data) {
                        if (data && data.length > 0) {
                            ad.changeState(state, userId);
                            Order.offlineOrderBatch(data, Order.status_code.OFFLINE, userId).then(function (result) {
                                resolve(result);
                            }).catch(function (err) {
                                reject(err);
                            })
                        } else {
                            ad.updater = userId;
                            ad.changeState(state, userId).then(function (result) {
                                resolve(result);
                            }).catch(function (err) {
                                reject(err);
                            });
                        }
                    }, function (err) {
                        reject(err);
                    });
                })
            );
        });

        return funcArr;
    };

    var changeStateFunc = function (ids, state) {
        var funcArr = [];
        if (state != 'update' && state != 'delete') {
            return funcArr;
        }
        ids.forEach(function (id) {
            funcArr.push(new Promise(function (resolve, reject) {
                AD.getAdById(id).then(function (data) {
                    let ad = new AD(data[0]);
                    let pushResult = ad.pushState(state, '批量推送引擎');
                    if (pushResult) {
                        Monitor.pushState(ad.id);
                        resolve(pushResult);
                    } else {
                        reject(false);
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }));
        });
        return funcArr;
    };

    switch (method) {
        case 'delete':
            /*Promise.all(deleteFunc(idArr)).then(function (values) {
                Utils.response(res, conf.ERRORS.OK, values);
            }).catch(function (err) {
                Utils.response(res, conf.ERRORS.DB_ERROR, err);
            });*/
            Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR,'暂时未实现删除功能!');
            break;
        case 'online':
            /*Promise.all(changeStateFunc(idArr, 'update')).then(function (values) {
                Utils.response(res, conf.ERRORS.OK, values);
            }).catch(function (err) {
                Utils.response(res, conf.ERRORS.DB_ERROR, err);
            });
            break;*/
        case 'offline':
            /*Promise.all(changeStateFunc(idArr, 'delete')).then(function (values) {
                Utils.response(res, conf.ERRORS.OK, values);
            }).catch(function (err) {
                Utils.response(res, conf.ERRORS.DB_ERROR, err);
            });
            break;*/
        case 'pause':
            Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR,'暂时未实现'+method+'功能!');
            break;
        default:
            Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, "method参数非法");
            break;
    }
});

router.get('/change_order_status/:oid/:state', function (req, res, next) {
    var oid = req.params.oid;
    var state = parseInt(req.params.state);

    if (oid && !isNaN(state)) {
        var changeState = function (order) {
            order = order || {};
            Order.updateOnlineState(order, state, req.userId).then(function (data) {
                Utils.response(res, conf.ERRORS.OK, data);
            }).catch(function (err) {
                Utils.response(res, conf.ERRORS.DB_ERROR, err);
            });
        };

        Order.findById(oid).then(function (order) {
            var now = new Date();
            if (state == 2) {
                if (order.targetType == 'live') {
                    order.startTime = Date.addSecond(new Date(), 5);
                    //TODO 有效期,要改成2分钟后
                    order.endTime = Date.addMinute(Date.addSecond(order.startTime, order.duration), 2);
                } else if (order.targetType == 'vod') {
                    if (now > new Date(order.endTime)) {
                        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, "订单已不在排期内,请修改排期后继续操作!");
                        return;
                    }
                }
                AD.getAdById(order.ad_id).then(function (data) {
                    if (data && data.length > 0) {
                        var ad = new AD(data[0]);
                        if (ad.state == AD.status_code.DELETED || ad.state == AD.status_code.PAUSE) {
                            Utils.response(res, conf.ERRORS.AD_STATUS_NOT_OK, "该订单当前关联的广告状态为:[" + AD.status[parseInt(ad.state)] + "],不能上线!");
                        } else {
                            // Order.findExsitSameStreamAndTime(order).then(function (data) {
                            //     if (data && data.length > 0) {
                            //         Utils.response(res, conf.ERRORS.REPEAT_TIME_STREAM_ORDER, data);
                            //     } else {
                            //         changeState(order);
                            //     }
                            // }, function (err) {
                            //     Utils.response(res, conf.ERRORS.DB_ERROR, err);
                            // });
                            orderService.check_conflict(order).then((data)=>{
                                console.log('-------------api/change_order_status/'+oid+'/'+state+'----------');
                                console.log('订单冲突');
                                console.log(JSON.stringify(data));
                                if(data.conflict){
                                    if(Array.isArray(data.conflicts)){
                                        Utils.response(res,conf.ERRORS.REPEAT_TIME_STREAM_ORDER,data.conflicts);
                                    }else{
                                        Utils.response(res,conf.ERRORS.ORIENT_CONFLICT,data.conflicts);
                                    }
                                }else{
                                    changeState(order);
                                }
                            }).catch((err)=>{
                                console.log('-------------api/change_order_status/'+oid+'/'+state+'----------');
                                console.log(JSON.stringify(err.data));
                                // Utils.response(res,conf.ERRORS.DB_ERROR,err);
                                // Utils.response(res,err.code,err.data);

                                if(err.code == conf.ERRORS.ORDER_OUT_OF_LIMIT){
                                    let msg = '订单超限，已存在订单id：';
                                    let oids = [];
                                    err.data.forEach(function (item) {
                                        oids.push(item.id);
                                    });
                                    msg += oids.join(',');
                                    Utils.response(res,err.code,msg);
                                }else{
                                    Utils.response(res,err.code,err.message);
                                }

                            });
                        }
                    } else {
                        Utils.response(res, conf.ERRORS.AD_STATUS_NOT_OK, "该订单当前关联的广告状态为:[" + AD.status[0] + "],不能上线!");
                    }
                }, function (err) {
                    Utils.response(res, conf.ERRORS.DB_ERROR, err);
                }).catch(function (err) {
                    Utils.response(res, conf.ERRORS.DB_ERROR, err);
                });
            } else {
                changeState(order);
            }
        });
    } else {
        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR);
    }
});

/**
 * 批量下线订单,根据adid
 */
router.get('/change_order_status_by_adid/:adid/:restore?', function (req, res, next) {
    var adid = req.params.adid;
    var restore = req.params.restore;
    if (adid) {
        if (restore) {
            //设置成恢复状态
            AD.changeState({id: adid}, AD.status_code.ONLINE, req.userId).then(function (data) {
                Utils.response(res, conf.ERRORS.OK, data);
            }, function (err) {
                Utils.response(res, conf.ERRORS.DB_ERROR, err);
            }).catch(function (err) {
                Utils.response(res, conf.ERRORS.DB_ERROR, err);
            });
        } else {
            AD.pauseOrderByAdId(adid, Order.status_code.OFFLINE, req.userId, AD.OFFLINE_REASON.MANUAL).then(function (reply) {
                Utils.response(res, conf.ERRORS.OK, reply);
            }, function (err) {
                Utils.response(res, conf.ERRORS.DB_ERROR, err);
            }).catch(function (err) {
                Utils.response(res, conf.ERRORS.SERVER_ERROR, err);
            });
        }
    } else {
        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, err);
    }
});

router.get('/delete_order/:oid', function (req, res, next) {
    var oid = req.params.oid;
    if (oid) {
        Order.findById(oid).then(function (order) {
            if (order) {
                Order.delete(order, req.userId).then(function (data) {
                    Utils.response(res, conf.ERRORS.OK, data);
                }, function (err) {
                    Utils.response(res, conf.ERRORS.DB_ERROR, err);
                });
            } else {
                Utils.response(res, conf.ERRORS.TARGET_DATA_NOT_EXIST);
            }
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR);
        });

    } else {
        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR);
    }
});


/***************** end order  **************************/

/***************** Monitor  ****************************/
router.get('/get_monitor/:adid', function (req, res, next) {
    var adid = req.params.adid;
    if (!adid) {
        Utils.response(res, conf.ERRORS.QUERY_ERROR, err);
    } else {
        Monitor.findByAdId(adid, true).then(function (reply) {
            Utils.response(res, conf.ERRORS.OK, reply);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        });
    }
});

/***************** end monitor *************************/

router.get('/get_log/:table/:id/:limit?', function (req, res, next) {
    var table = req.params.table;
    var id = req.params.id;
    var limit = req.params.limit || 1000;
    if (table && id) {
        Handle_Log.findByTableId(table, id, limit).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, err);
        });
    } else {
        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR);
    }
});

/***************** LeAlbum &Video ******************************/
router.get('/get_albums/:key?', function (req, res, next) {
    var key = req.params.key;
    var limit = req.query.limit || 10;
    if (key) {
        LeAlbum.findLike(key).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        });
    } else {
        LeAlbum.findAll(limit).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        });
    }
});

router.get('/get_videos/:key?', function (req, res, next) {
    var key = req.params.key;
    var limit = req.query.limit || 10;
    if (key) {
        LeVideo.findLike(key).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        });
    } else {
        LeVideo.findAll(limit).then(function (data) {
            Utils.response(res, conf.ERRORS.OK, data);
        }, function (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        });
    }
});

router.get('/get_video_album_batch', function (req, res, next) {
    var vids = req.query.vids;
    var aids = req.query.aids;
    var vidArr = vids ? vids.split(',') : [];
    var aidArr = aids ? aids.split(',') : [];

    async.parallel({
        video: function (callback) {
            if (vidArr.length > 0) {
                LeVideo.findIn(vidArr).then(function (result) {
                    var obj = {};
                    if (result && result.length > 0) {
                        result.forEach(function (item) {
                            obj[String(item.id)] = item.name;
                        });
                    }
                    callback(null, obj);
                }, function (err) {
                    callback(err, {});
                }).catch(function (err) {
                    callback(err, {});
                }).done();
            } else {
                callback(null, {});
            }
        },
        album: function (callback) {
            if (aidArr.length > 0) {
                LeAlbum.findIn(aidArr).then(function (result) {
                    var obj = {};
                    if (result && result.length > 0) {
                        result.forEach(function (item) {
                            obj[String(item.id)] = item.name;
                        });
                    }
                    callback(null, obj);
                }, function (err) {
                    callback(err, {});
                }).catch(function (err) {
                    callback(err, {});
                }).done();
            } else {
                callback(null, {});
            }
        }
    }, function (err, results) {
        Utils.response(res, conf.ERRORS.OK, results);
    });
});
/***************** End LeAlbum **************************/


/***************** Mongoose pager*/

router.get('/mongo_pager', function (req, res, next) {
    var pageIdx, pageSize, Model, populate, queryParams, sortParams;
    pageIdx = parseInt(req.query.page) || 1;
    pageSize = parseInt(req.query.pageSize) || 10;
    Model = req.query.Model;
    populate = req.query.populate || '';
    req.query.queryParams = req.query.queryParams || '{}';
    queryParams = (typeof req.query.queryParams == 'object' ? req.query.queryParams : JSON.parse(req.query.queryParams)) || {};
    req.query.sortParams = req.query.sortParams || '{}';
    sortParams = (typeof req.query.sortParams == 'object' ? req.query.sortParams : JSON.parse(req.query.sortParams)) || {};
    if (!Model) {
        Utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, "文档对象不可以为空");
        return;
    }

    switch (Model) {
        case 'uploadfiles':
            Model = UploadFile;
            break;
    }

    MongoPager.pageQuery(pageIdx, pageSize, Model, populate, queryParams, sortParams, function (err, page) {
        if (err) {
            Utils.response(res, conf.ERRORS.DB_ERROR, err);
        } else {
            Utils.response(res, conf.ERRORS.OK, page);
        }
    })
});

router.get('/get_stream_names_by_id',function (req,res) {
    let id = req.query.id;
    if(!id){
        return Utils.response(res,conf.ERRORS.ARGUMENTS_ERROR,'直播流id不能为空');
    }
    request.get('http://api.live.letv.com/v1/liveRoom/single/1001?id='+id,function (error,response,body) {

        if(error || response.statusCode !== 200){
            return Utils.response(res,conf.ERRORS.SERVER_ERROR,error || JSON.parse(body).errMsg);
        }
        let robj = body;
        if(typeof body == 'string'){
            robj = JSON.parse(body);
        }
        let result = [];
        let cids = robj.cids;
        for(let cid in cids){
            result.push({id:cid,name:cids[cid]});
        }
        Utils.response(res,conf.ERRORS.OK,result);
    });
});

router.get('/get_areas_result',(req,res)=>{
    let zid = (req.query.zid||'').split(',');
    let fid = (req.query.fid||'').split(',');
    if (zid[0] == '') zid=[];
    if (fid[0] == '') fid=[];

    let areaResult = areaService.queryIn({zid:zid,fid:fid});
    Utils.response(res,conf.ERRORS.OK,areaResult) ;
});

module.exports = router;
