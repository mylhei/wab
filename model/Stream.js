/**
 * Created by leiyao on 16/4/11.
 */
'use strict';
var pool = require('../utils/MysqlUtils');
var util = require('util');
var Q = require('q');
var BaseModel = require('./BasicModel');

var SELECT_ALL = "select id,name from basic_stream order by last_updated desc limit 200;";
var SELECT_ALL_LIMIT = "select id,name from basic_stream order by last_updated desc limit ?;";
var SELECT_LIKE = "select id,name from basic_stream where id like ? limit 200;";

function Stream() {
    this.Members = {
        'id': {},
        'name': {},
        'date_created': {},
        'last_updated': {}
    };
    this.init.apply(this, arguments);
}

Stream.prototype = {
    initWithData: function (id, name) {
        this.id = id;
        this.name = name;
    },
    findAll: function () {
        return Stream.findAll();
    },
    findLike:function(key){
        return Stream.findLike(key);
    }
};

Stream.findAll = function (limit) {
    var deferred = Q.defer();
    pool.queryAfp(limit ? SELECT_ALL_LIMIT : SELECT_ALL, [parseInt(limit)], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply) {
                reply.forEach(function (n) {
                    arr.push(new Stream(n).ado());
                });
            }
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};

Stream.findLike = function (key) {
    var deferred = Q.defer();
    pool.queryAfp(SELECT_LIKE, ['%' + key + '%'], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply) {
                reply.forEach(function (n) {
                    arr.push(new Stream(n).ado());
                });
            }
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};



util.inherits(Stream, BaseModel);
module.exports = Stream;