/**
 * Created by leiyao on 16/5/5.
 */
'use strict';
var pool = require('../utils/MysqlUtils');
var util = require('util');
var Q = require('q');
var BaseModel = require('./BasicModel');
var async = require('async');

var SELECT_ALL = "select id,name from basic_album order by id desc;";
var SELECT_ALL_LIMIT = "select id,name from basic_album order by id desc limit ?;";
var SELECT_LIKE = "select id,name from basic_album where id like ? limit 200;";
var SELECT_LIKE_NAME = "select id,name from basic_album where name like ? limit 200;";
var SELECT_IN = "select id,name from basic_album where id in (?) limit 200;";

function LeAlbum() {
    this.Members = {
        'id': {},
        'name': {}
    };
    this.init.apply(this, arguments);
}

LeAlbum.findAll = function (limit) {
    var deferred = Q.defer();
    pool.queryAfp(limit ? SELECT_ALL_LIMIT : SELECT_ALL, [parseInt(limit)], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply) {
                reply.forEach(function (n) {
                    arr.push(new LeAlbum(n).ado());
                });
            }
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};

LeAlbum.findLike = function (key) {
    var deferred = Q.defer();
    var sql = SELECT_LIKE;
    if (isNaN(parseInt(key))) {
        sql = SELECT_LIKE_NAME;
    }
    pool.queryAfp(sql, [key + '%'], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply) {
                reply.forEach(function (n) {
                    n.id = String(n.id);
                    arr.push(new LeAlbum(n).ado());
                });
            }
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};

LeAlbum.findIn = function (arr) {
    var deferred = Q.defer();
    pool.queryAfp(SELECT_IN, [arr], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply) {
                reply.forEach(function (n) {
                    arr.push(new LeAlbum(n).ado());
                });
            }
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};


util.inherits(LeAlbum, BaseModel);
module.exports = LeAlbum;

