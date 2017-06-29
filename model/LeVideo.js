/**
 * Created by leiyao on 16/5/5.
 */

'use strict';
var pool = require('../utils/MysqlUtils');
var util = require('util');
var Q = require('q');
var BaseModel = require('./BasicModel');
var async = require('async');

var SELECT_ALL = "select id,name from basic_video order by id desc;";
var SELECT_ALL_LIMIT = "select id,name,duration,parent_id from basic_video order by id desc limit ?;";
var SELECT_LIKE = "select id,name,duration,parent_id from basic_video where id = ? limit 200;";
var SELECT_LIKE_NAME = "select id,name,duration,parent_id from basic_video where name like ? limit 200;";
var SELECT_IN = "select id,name,duration,parent_id from basic_video where id in (?) limit 200;";

function LeVideo(){
    this.Members = {
        'id':{},
        'name':{},
        'duration':{},
        'parent_id':{},
        'album_name':{}
    };
    this.init.apply(this, arguments);
}

LeVideo.findAll = function (limit) {
    var deferred = Q.defer();
    pool.queryAfp(limit ? SELECT_ALL_LIMIT : SELECT_ALL, [parseInt(limit)], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply) {
                reply.forEach(function (n) {
                    arr.push(new LeVideo(n).ado());
                });
            }
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};

LeVideo.findLike = function (key) {
    var deferred = Q.defer();
    var sql = SELECT_LIKE;
    if (isNaN(parseInt(key))){
        sql = SELECT_LIKE_NAME;
    }
    pool.queryAfp(sql, [key + '%'], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply) {
                reply.forEach(function (n) {
                    arr.push(new LeVideo(n).ado());
                });
            }
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};

LeVideo.findIn = function(arr){
    var deferred = Q.defer();
    pool.queryAfp(SELECT_IN, [arr], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = [];
            if (reply) {
                reply.forEach(function (n) {
                    arr.push(new LeVideo(n).ado());
                });
            }
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};

util.inherits(LeVideo, BaseModel);
module.exports = LeVideo;
