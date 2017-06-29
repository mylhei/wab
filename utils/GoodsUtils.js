'use strict';
var LeGoods = require('../model/LeGoods');
var Promise = require('bluebird')
var  aliConf = conf.ALIBABA;
//var TopClient = require('../utils/ali/topClient').TopClient;
var ApiClient = require('./ali/index.js').ApiClient;
var client = new ApiClient({
    'appkey': aliConf.app_key,
    'appsecret': aliConf.app_secret,
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});

/**
 * opt封装条件
 * item_id:物品在淘宝的id
 * item_url:物品在淘宝的url,url和id只需一个，如果同时存在，以url为准
 * tracer:打点信息
 **/
var iteminfo = function (opt) {
    let _opt = /*{
        'tracer': opt.tracer || '',
        'extra': opt.extra || '',
        'item_id': opt.item_id || '',
        'item_url': opt.item_url || '',
        'trace_app_key': aliConf.app_key
    };*/
    {
        'item_filter_request': JSON.stringify({
            'tracer': opt.tracer || '',
            'extra': opt.extra || '',
            'item_id': opt.item_id || '',
            'item_url': opt.item_url || '',
            'trace_app_key': aliConf.app_key
        })
    };
    return new Promise(function (resolve, reject) {
        client.execute('taobao.baichuan.microservice.iteminfo', _opt, function (err, result) {
            if (err) {
                reject({
                    code: conf.ERRORS.GOODS_ITEMINFO_FAIL,
                    name: '淘宝接口对接错误',
                    message: err
                });
            } else {
                let item_trace_response = result.result;
                if (item_trace_response.error_code) {
                    reject({
                        code: conf.ERRORS.GOODS_ITEMINFO_FAIL,
                        name: '淘宝接口对接错误',
                        message: item_trace_response.error_message
                    });
                }else {
                    let le_goods = new LeGoods(item_trace_response);
                    resolve(le_goods);
                }
            }
        });
    });
};

/**
 * 商品订阅
 * 参数：item_id
 * 返回：promise
 **/
var subscribe = function (item_id) {
    if (!item_id) {
        return Promise.reject({
            code: conf.ERRORS.ARGUMENTS_ERROR,
            message: '参数错误，item_id不能为空'
        });
    }
    return new Promise(function (resolve, reject) {
        client.execute('taobao.baichuan.item.subscribe', {
            item_id: item_id,
            session: conf.ALIBABA.session
        }, function (err, response) {
            if (err) {
                reject({
                    code: conf.ERRORS.SERVER_ERROR,
                    message: '订阅错误：' + err.message
                });
            } else {
                let result = response.result;
                let code = result && result.result_list && result.result_list.result_meta && result.result_list.result_meta[
                        0].code;
                /**
                 * code:
                 * 0  正常
                 * 10  订阅关系已存在
                 **/
                if (code == 0 || code == 10) {
                    resolve(result);
                } else {
                    reject({
                        code: conf.ERRORS.SERVER_ERROR,
                        message: result.result_list.result_meta[0].msg
                    });
                }
            }
        });
    });

};

/**
 * 取消商品订阅
 * 参数：item_id
 * 返回：promise
 **/
var unsubscribe = function unsubscribe(item_id) {
    if (!item_id) {
        return Promise.reject({
            code: conf.ERRORS.ARGUMENTS_ERROR,
            message: '取消订阅商品错误：item_id不能为空'
        });
    }
    return new Promise(function (resolve, reject) {
        client.execute('taobao.baichuan.item.unsubscribe', {
            item_id: item_id,
            session: conf.ALIBABA.session
        }, function (err, result) {
            if (err) {
                reject({
                    code: conf.ERRORS.SERVER_ERROR,
                    message: err.message
                });
            } else {
                result = result.result;
                let code = result && result.result_list && result.result_list.result_meta && result.result_list.result_meta[
                        0].code;
                /**
                 * code:
                 * 0:正常
                 * 11:订阅关系不存在
                 **/
                if (code == 0 || code == 11) {
                    resolve(result);
                } else {
                    reject({
                        code: conf.ERRORS.SERVER_ERROR,
                        message: result.result_list.result_meta[0].msg
                    });
                }
            }
        });
    });
}

/**
 * 生成二维码
 **/
var qrcode = function qrcode(url, tracking) {

    if (!url || !tracking) {
        return Promise.reject({
            code: conf.ERRORS.ARGUMENTS_ERROR,
            message: 'url或tracking不能为空'
        });
    }

    let ybhpss = new Buffer(encodeURI(tracking) + '_' + aliConf.app_key).toString('base64');
    // let content = 'https://h5.m.taobao.com/awp/core/detail.htm?id=' + item_id + '&ybhpss=' + ybhpss;
    let content = url + '&ybhpss=' + ybhpss;
    console.log(content);
    return new Promise(function (resolve, reject) {
        client.execute('taobao.wireless.xcode.create', {
            content: content
        }, function (err, response) {
            if (err) {
                console.log(err);
                reject({
                    code: conf.ERRORS.SERVER_ERROR,
                    message: err.message
                });
            } else {
                resolve(response);
            }
        });
    });


}

module.exports = {
    iteminfo,
    subscribe,
    unsubscribe,
    qrcode
};
