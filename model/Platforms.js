/**
 * Created by leiyao on 16/4/1.
 */
'use strict';
var pool = require('../utils/MysqlUtils');
var Q = require('q');
var SELECT_ALL = "select * from platforms order by id;";
var SELECT_ALL_BY_GID = "select * from platforms where groupId=? order by id;";

function Platforms(id,name,desc){
    //if ()
}

Platforms.getAll = function (userId,groupId){
    var deferred = Q.defer();
    var sql = SELECT_ALL,values=[];
    if (groupId != 0) {
        sql = SELECT_ALL_BY_GID;
        values = [groupId];
    }
    pool.query(sql,values,function(err,reply){
        if (!err){
            deferred.resolve(reply);
        }else{
            deferred.reject(err);
        }
    });
    return deferred.promise;
};

module.exports = Platforms;