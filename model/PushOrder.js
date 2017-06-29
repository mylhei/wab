/**
 * Created by leiyao on 16/4/18.
 */
'use strict';
var Order = require('./Order');

var PushOrder = {
    "update": function (n, callback) {
        var me = this;
        this.buildRedisJson(n, function (json) {
            json.status = 'UPDATE';
            callback(json);
        });
    },
    "delete": function (n) {

    },
    "buildRedisJson": function (n, callback) {

    }
};

exports.PushOrder = PushOrder;