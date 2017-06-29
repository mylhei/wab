'use strict';
var router = require('express').Router();
var fs = require('fs');
var GoodsUtils = require('../utils/GoodsUtils.js');
var Goods = require('../model/Goods.js');
var mongoPager = require('../model/MongoPager.js');
var queryStringUtils = require('../utils/queryStringUtils.js');
var utils = require('../utils/utils.js');
var fileUtils = require('../utils/fileUtils.js');
var AD = require('../model/AD.js');
var Upload_File = require('../model/FileUpload.js');
var GoodsService = require('../service/GoodsService.js');

/**
 * 获取商品信息并入库
 **/
router.post('/iteminfo', function(req, res) {
    let current_user = req.session.currentUser;
    let item_id = req.body.item_id;
    let item_url = req.body.item_url;
    let goods_type = req.body.goods_type;
    let spuNo = req.body.spuNo;

    //如果只传了item_url,从item_url里解析item_id
    if (item_url && !item_id) {
        try {
            item_id = queryStringUtils.parse(item_url).id;
        } catch (e) {
            return utils.response(res, conf.ERRORS.SERVER_ERROR, '商品链接不合法，请重新输入');
        } finally {

        }
    }
    //根据item_id查询数据库中是否已存在相应的商品
    var queryGoodsByItemId = function(item_id) {
        let goods = new Goods({
            item_id: item_id
        });
        return goods.query(null, {
            item_id: item_id
        }).then(function(results) {
            if (results && results.results && results.results.length > 0) {
                return results.results[0];
            } else {
                return null;
            }
        })
    };


    let goods_id = '';
    if(goods_type == conf.GOODS.TYPE.ALI){
        goods_id = item_id;
    }else if(goods_type == conf.GOODS.TYPE.LEMALL){
        goods_id = spuNo;
    }


    //查询数据库和获取阿里商品同时进行
    //如果数据库中有此数据，将数据更新
    //如果不存在，直接入库
    Promise.all([GoodsService.info(goods_id,goods_type), queryGoodsByItemId(goods_id)]).then(function(values) {
        let goods_fetched = values[0];
        let goods_saved = values[1];
        console.log(JSON.stringify(goods_saved));
        //商品已存在，更新
        if (goods_saved) {
            return goods_saved;
        } else { //商品不存在，直接入库
            let goods = new Goods(goods_fetched);
            goods.create_user = current_user;
            return goods.insert();
        }
    }).then(function(saved) {
        let item_id = saved.item_id;
        if (item_id) {
            GoodsUtils.subscribe(item_id).then(function(result) {
                utils.response(res, conf.ERRORS.OK, saved);
            }).catch(function(err) {
                utils.response(res, conf.ERRORS.SERVER_ERROR, err.message);
            });
        }
    }).catch(function(err) {
        utils.response(res, err.code || conf.ERRORS.SERVER_ERROR, err.message);
    });
});

/**
 * 查询商品列表
 * 这里使用模糊搜索
 * keyword为搜索参数，这里按照item_id和title进行模糊搜索
 **/
router.get('/', function(req, res) {
    var page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 5;
    var queryOpt = {};
    if (req.query.keyword) {
        queryOpt = {
            $or: [{
                title: {
                    $regex: '.*' + req.query.keyword + '.*'
                }
            }, {
                item_id: {
                    $regex: '.*' + req.query.keyword + '.*'
                }
            }]
        };
    }
    var goods = new Goods();
    goods.query({
        page: page,
        limit: limit
    }, queryOpt).then((value) => {
        utils.response(res, 0, value);
    }).catch((err) => {
        utils.response(res, err.code || conf.ERRORS.SERVER_ERROR, err.message);
    })
});

/**
 * 获取商品二维码接口
 * 参数：
 *   url:商品在淘宝的商品id,使用query传参,使用urlencode转码
 *   tracking:打点信息，以query的形式传递
 *   format:数据返回格式，json:返回json格式，jsonp:返回jsonp格式,默认json
 *   fun:jsonp指定的函数名称，仅当format参数为jsonp时传该参数，如果不传，默认jsonp2
 *   type:商品类型，是否是阿里商品，是，从淘宝获取二维码，不是，自己生成二维码
 **/
router.get('/qrcode', function(req, res) {
    let url = req.query.url;
    let tracking = req.query.tracking;
    let format = req.query.format;
    let fun = req.query.fun || 'jsonp2';
    let type = req.query.type;
    let m = (format && format.toLowerCase() == 'jsonp') ? 'jsonp' : 'response';
    //url和tracking两个参数为必传参数
    if (!url && !tracking) {
        utils[m](res, conf.ERRORS.ARGUMENTS_ERROR, '参数错误，url不能为空', fun);
    }
    if (type == 'ali') {
        GoodsUtils.qrcode(url, tracking).then(function onSuccess(result) {
            utils[m](res, 0, result, fun);
        }).catch(function onError(err) {
            utils[m](res, conf.ERRORS.SERVER_ERROR, err.message, fun);
        })
    } else {
        utils[m](res, 0, '不支持非阿里商品二维码生成', fun);
    }

});

router.get('/:id', function(req, res) {
    let id = req.params.id;
    let goods = new Goods({
        _id: id
    });
    goods.queryById().then(function(result) {
        utils.response(res, 0, result);
    }).catch(function(err) {
        utils.response(res, conf.ERRORS.SERVER_ERROR, err.message);
    });
});

router.delete('/:id', function(req, res) {
    let _id = req.params.id;
    if (!_id) {
        return res.json({
            err: '删除操作id不能为空'
        });
    }
    let goods = new Goods({
        _id: _id
    });

    goods.queryById().then(function(doc) {
        if (doc && doc.item_id) {
            console.log('取消商品订阅');
            return GoodsUtils.unsubscribe(doc.item_id);
        }
        return Promise.resolve(true);
    }).then(function(result) {
        return goods.delete();
    }).then(function(result) {
        utils.response(res, 0);
    }).catch(function(err) {
        utils.response(res, conf.ERRORS.SERVER_ERROR, err.message);
    });

});

/**
 * 更新
 * PUT使用全量更新
 **/
router.put('/:id', function(req, res) {
    let id = req.params.id;
    let body = req.body;
    let user_id = req.session.currentUser && req.session.currentUser.id;
    if (!id || !body) {
        return utils.response(res, conf.ERRORS.SERVER_ERROR, 'id和商品信息不能为空');
    }
    var updateAd = function(source, goodsId, userId, reason, goods) {
        return Promise.all([AD.changeGoodsProperty(source, goodsId, userId, goods), AD.pauseByGoodsId(AD.SOURCE
            .BAICHUAN, goodsId, userId, reason)]);
    };
    let goods = new Goods(body);
    goods.update().then(function(updated) {
        console.log(updated);
        updateAd(AD.SOURCE.BAICHUAN, goods.item_id, user_id, AD.OFFLINE_REASON.MANUAL, goods);
        return utils.response(res, 0, updated);
    }).catch(function(error) {
        console.log('商品更新失败');
        console.log(error);
        return utils.response(res, conf.ERRORS.SERVER_ERROR, '更新失败');
    });
});

router.post('/notification', function(req, res) {
    let body = req.body;
    let topic = body && body.topic;
    let messageStr = body && body.message;
    if (!topic || !messageStr) {
        return utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, '参数错误，topic或message不能为空');
    }
    //暂时先关注价格
    let message = JSON.parse(messageStr);
    let itme_info = message.itme_info;
    let item_id = message.item_id;
    if (!item_id) {
        return utils.response(res, conf.ERRORS.ARGUMENTS_ERROR, '参数错误，item_id不能为空');
    }
    let goods = new Goods({
        item_id: item_id
    });
    //根据item_id查询数据库中是否已存在相应的商品
    var queryGoodsByItemId = function(item_id) {
        let goods = new Goods({
            item_id: item_id
        });
        return goods.query(null, {
            item_id: item_id
        }).then(function(results) {
            if (results && results.results && results.results.length > 0) {
                return results.results[0];
            } else {
                return null;
            }
        })
    };
    var updateAd = function(source, goodsId, userId, reason, goods) {
        return Promise.all([AD.changeGoodsProperty(source, goodsId, userId, goods), AD.pauseByGoodsId(AD.SOURCE
            .BAICHUAN, goodsId, userId, reason)]);
    };
    var updateGoods = function updateGoods(item_id, topic, message) {
        let item_info = message.item_info;
        return queryGoodsByItemId(item_id).then(function(doc) {
            if (doc) {
                var reason = AD.OFFLINE_REASON.ALI_GOODS_SoldOut;
                //价格变化
                if (topic == 'taobao_tae_ItemPriceChange') {
                    console.log(item_id + '商品变更接口，价格发生变化');
                    doc.modified.prom_price = {
                        modified: true,
                        last_value: doc.prom_price,
                        update_time: message.timestamp
                    };
                    doc.prom_price = item_info.price;
                }
                if (topic == 'taobao_tae_ItemSoldOut') {
                    console.log(item_id + '商品变更接口，商品已售完');
                    doc.status = conf.GOODS.STATUS.SaleOut;
                }
                if (topic == 'taobao_tae_ItemDelete') {
                    console.log(item_id + '商品变更接口，商品已删除');
                    reason = AD.OFFLINE_REASON.ALI_GOODS_Delete;
                    doc.status = conf.GOODS.STATUS.Delete;
                }
                if (topic == 'taobao_tae_ItemDownShelf') {
                    console.log(item_id + '商品变更接口，商品已下架');
                    reason = AD.OFFLINE_REASON.ALI_GOODS_DownShelf;
                    doc.status = conf.GOODS.STATUS.DownShelf;
                }
                let goods = new Goods(doc);
                return goods.update().then(function(result) {
                    var current_user = req.session.currentUser;
                    var user_id = current_user && current_user.id;
                    return updateAd(AD.SOURCE.BAICHUAN, item_id, user_id, reason, goods);
                }).catch(function(err) {
                    return Promise.reject(err);
                });
            } else {
                console.log(item_id + '商品变更接口，根据' + item_id + '未查询到商品');
                return Promise.resolve(true);
            }
        });
    }

    updateGoods(item_id, topic, message).then(function(result) {
        utils.response(res, 0, result);
    }).catch(function(err) {
        utils.response(res, conf.ERRORS.SERVER_ERROR, err.message);
    });
});

/**
 * 接收乐视商城商品变更通知
 */
router.get('/lemall/change/:spuNo',function (req,res) {
     let spuNo = req.params.spuNo;
     let querySaved = function (spuNo) {
         let goods = new Goods();
         return goods.queryByItemId(spuNo);
     }
     let fetch = function (spuNo) {
         return GoodsService.info(spuNo,conf.GOODS.TYPE.LEMALL);
     }
     Promise.all([querySaved(spuNo),fetch(spuNo)]).then(function (result) {
         let goods_saved = result[0];
         let goods_fetched = result[1];
         //如果商品存在，进行更新操作
         if(goods_saved){
             //TODO 比较商品字段，待完善
         }
         res.send({goods_saved:goods_saved,goods_fetched:goods_fetched});
     }).catch(function (err) {

     });
});




module.exports = router;
