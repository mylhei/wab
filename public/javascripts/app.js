/**
 * Created by leiyao on 16/3/27.
 */

'use strict';


angular.module('app', [
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'oc.lazyLoad',
    'angularjs-datetime-picker',
    'isteven-multi-select',
    'ngSanitize',
    'angucomplete'
]).constant('conf', {
    'ERRORS': {
        "OK": 0,
        "ARGUMENTS_ERROR": 1,
        "SERVER_ERROR": 2,
        "NOT_LOGIN": 10,
        "REPEAT_TIME_STREAM_ORDER": 11,
        "ORIENT_CONFLICT":111,
        "EXIST_ORDER_BY_ADID": 12,
        "ORDER_OUT_OF_LIMIT":13,
        "TARGET_DATA_NOT_EXIST": 20,
        "AD_STATUS_NOT_OK": 31,
        "UPLOAD_LOCAL_FAIL": 41,
        "UPLOAD_LOCAL_RENAME_FAIL": 42,
        "UPLOAD_LOCAL_SUM_FAIL": 43,
        "UPLOAD_LOCAL_EXIST": 44,
        "UPLOAD_CDN_FAIL": 51,
        "UPLOAD_MONGODB_FAIL": 61,
        "DB_ERROR": 1001,
        "QUERY_ERROR": 1002,
        "TRANSACTION_ERROR": 1003,
        "DB_CONNECT_ERROR": 1004
    },
    "PAGINATION":{
        "LIMIT":15
    }
}).factory('appTools', ['$http', 'conf', 'toaster', function($http, conf, toaster) {
    return {
        checkResponse: function(data) {
            if (data && data.header) {
                var status_code = data.header.code >>> 0;
                if (status_code != conf.ERRORS.OK) {
                    console.log(status_code);
                    console.log(data.body);
                }
                switch (status_code) {
                    case conf.ERRORS.OK:
                        return true;
                    case conf.ERRORS.SERVER_ERROR:
                        toaster.pop('error', '错误', data.body || '服务器错误!');
                        return false;
                    case conf.ERRORS.ARGUMENTS_ERROR:
                        var msg = '<br/>';
                        if (data.body) {
                            msg += data.body;
                        }
                        toaster.pop('error', '提示', 'API参数不正确!' + msg);
                        return false;
                    case conf.ERRORS.NOT_LOGIN:
                        toaster.pop('error', '提示', '登陆过期,请<a href="/#/access/signin">点此</a>登录');
                        return false;
                    case conf.ERRORS.REPEAT_TIME_STREAM_ORDER:
                        var html = [];
                        if (data.body && data.body.length) {
                            data.body.forEach(function(n) {
                                var target_type = '直播流';
                                if (n.target_type == 'video') {
                                    target_type = '剧集ID:';
                                } else if (n.target_type == 'album') {
                                    target_type = '专辑ID:';
                                }
                                html.push('<li>订单ID:<label class="label label-warning">' + n.id +
                                    '</label>,' + target_type +
                                    ':<label class="label label-warning">' + n.target_value +
                                    '</label>,开始时间:<label class="label">' + n.startTime +
                                    '</label>结束:<label class="label">' + n.endTime +'</label>'+
                                    (n.target!='live'?('时间轴:<label class="label">'+ n.offset+'</label>'):'')+
                                    '</li>');
                            });
                        }
                        toaster.pop('error', '提示', '该订单与以下订单冲突,请稍后上线<br/>' + html.join(''));
                        return false;
                    case conf.ERRORS.ORDER_OUT_OF_LIMIT:
                        toaster.pop('error','提示',data.body);
                        return false;
                    case conf.ERRORS.EXIST_ORDER_BY_ADID:
                        var html = [];
                        if (data.body && data.body.length) {
                            data.body.forEach(function(n) {
                                html.push('<li><label class="label label-warning">' + n.id +
                                    '</label> : <label class="label label-warning">' + n.name +
                                    '</label></li>')
                            });
                        }
                        toaster.pop('error', '提示', '该广告已经被以下订单使用,不能删除.<br/>' + html.join(''));
                        return false;
                    case conf.ERRORS.TARGET_DATA_NOT_EXIST:
                        toaster.pop('error', '提示', '未找到对象实体!');
                    case conf.ERRORS.AD_STATUS_NOT_OK:
                        toaster.pop('error', '提示', "操作失败!<br/>" + data.body);
                        return false;
                    case conf.ERRORS.DB_ERROR:
                        toaster.pop('error', '提示', '数据库错误!');
                        return false;
                    case conf.ERRORS.QUERY_ERROR:
                        toaster.pop('error', '提示', '数据查询失败!');
                        return false;
                    case conf.ERRORS.TRANSACTION_ERROR:
                        toaster.pop('error', '提示', '数据事务失败!');
                        return false;
                    case conf.ERRORS.DB_CONNECT_ERROR:
                        toaster.pop('error', '提示', '数据库连接失败!');

                        return false;
                    case conf.ERRORS.UPLOAD_LOCAL_EXIST:
                        toaster.pop('error', '提示', data.body);
                        return false;
                    case conf.ERRORS.ORIENT_CONFLICT:
                        toaster.pop('error','错误',data.body);
                        return false;
                    default:
                        toaster.pop('error', '提示', '操作失败<br/>' + data.status_code);
                        return false;
                }
            } else {
                toaster.pop('error', '提示', '接口调用失败!');
            }
        }
    }
}]);

angular.module('app').factory('socketTools', ['toaster', function(toaster) {
    var socket;
    return {
        connect: function() {
            if (!window.socket) {
                try {
                    socket = io.connect();
                    this.on('message', function(msg) {
                        toaster.pop('success', '服务端消息', msg.message);
                    });
                    console.log('链接服务器成功!');
                } catch (e) {
                    console.log('链接服务器失败!');
                }
            }
            return socket;
        },
        disconnect: function() {
            socket.disconnect();
        },
        on: function(eventName, callback) {
            socket.on(eventName, callback);
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, callback);
        }
    }
}]);
