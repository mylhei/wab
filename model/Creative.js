/**
 * Created by leiyao on 16/3/31.
 */
'use strict';
var pool = require('../utils/MysqlUtils');
var util = require('util');
var BaseModel = require('./BasicModel');
var Q = require('q');
var INSERT_SQL = "INSERT INTO `creatives` ( `name`, `form`, `platform`,`description`,`adzone`, `components`,`creator`,`groupId` ) values ( ?, ?,?,?,?,?,?,?);";
var SELECT_ALL_SQL = "SELECT c.*,p.name as platformName FROM `creatives` c left JOIN `platforms` p on c.platform = p.id where c.status=1 order by c.id desc";
var SELECT_ALL_GID_SQL = "SELECT c.*,p.name as platformName FROM `creatives` c left JOIN `platforms` p on c.platform = p.id where c.status=1 and c.groupId=? order by c.id desc";
var SELECT_ONE_SQL = "SELECT c.*,p.name as platformName FROM `creatives` c left JOIN `platforms` p on c.platform = p.id where c.id = ? order by c.id desc";
var SELECT_LIST_BY_PLATFORM_SQL = "SELECT c.id,c.name,c.form,p.name as platformName FROM `creatives` c left JOIN `platforms` p on c.platform = p.id where c.status=1 and c.platform = ? order by c.id desc";
var SELECT_LIST_BY_PLATFORM_GID_SQL = "SELECT c.id,c.name,c.form,p.name as platformName FROM `creatives` c left JOIN `platforms` p on c.platform = p.id where c.status=1 and c.platform = ? and c.groupId=? order by c.id desc";
var UPDATE_SQL = "UPDATE `creatives` set name = ? ,form = ? , platform = ?,description = ? ,updatetime=? ,updater = ? where id = ?;";
var UPDATE_STATUS_SQL = "UPDATE `creatives` set status = ? where id = ?;";

function Creative(obj) {
    this.Members = {
        'id': {}, 'name': {}, 'form': {}, 'platform': {}, 'platformName': {}, 'description': {}, 'adzone': {
            "default": 1
        }, 'components': {
            "default": 1
        }, 'createtime': {}, 'updatetime': {}, 'creator': {}, 'updater': {}, 'groupId': {}
    };

    this.init.apply(this, arguments);
}

Creative.prototype = {
    initWithData: function () {
        this.name = arguments[0];
        this.platform = arguments[1];
        this.description = arguments[2];
        this.adzone = arguments[3] || this.Members['adzone'].default;
        this.components = arguments[4] || this.Members['components'].default;
        this.creator = arguments[5]
    },
    toJson: function () {

    },
    insert: function () {
        if (this.id > 0) {
            // 说明这是更新啊
            return Creative.update(this);
        } else {
            // 这才是删除
            return Creative.insert(this);
        }
    },
    update: function () {
        if (this.id > 0) {
            return Creative.update(this);
        } else {
            // 这才是删除
            return Creative.insert(this);
        }
    }
};

Creative.insert = function (obj) {
    var deferred = Q.defer();

    if (obj && typeof obj == 'object') {
        pool.insert(INSERT_SQL, [obj.name, obj.form, obj.platform, obj.description, obj.adzone, obj.components, obj.creator, obj.groupId || 1], function (err, reply) {
            if (err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(reply);
        });
    }

    return deferred.promise;
};

Creative.update = function (obj) {
    var deferred = Q.defer();

    if (obj && typeof obj == 'object') {
        pool.update(UPDATE_SQL, [obj.name, obj.form, obj.platform, obj.description, obj.updatetime, obj.updater, obj.id], function (err, reply) {
            if (err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(reply);
        });
    }

    return deferred.promise;
};

Creative.changeStatus = function (id, status) {
    var deferred = Q.defer();

    if (id > 0) {
        pool.update(UPDATE_STATUS_SQL, [status, id], function (err, reply) {
            if (err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(reply);
        });
    }

    return deferred.promise;
};

Creative.findListByPlatformId = function (pid, gid) {
    var deferred = Q.defer();
    var sql = SELECT_LIST_BY_PLATFORM_SQL, values = [pid];
    if (gid != 0) {
        sql = SELECT_LIST_BY_PLATFORM_GID_SQL;
        values = [pid, gid];
    }
    pool.query(sql, values, function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(reply);
        }
    });
    return deferred.promise;
};

Creative.findOneById = function (id) {
    var deferred = Q.defer();
    pool.query(SELECT_ONE_SQL, [id], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            if (reply) {
                var arr = [];
                reply.forEach(function (n) {
                    arr.push(new Creative(n).ado());
                });
            }
            deferred.resolve(arr[0]);
        }
    });
    return deferred.promise;
};

Creative.findAll = function (gid) {
    var deferred = Q.defer();
    var sql = SELECT_ALL_SQL, values = [];
    if (gid != 0) {
        sql = SELECT_ALL_GID_SQL;
        values = [gid]
    }
    pool.query(sql, values, function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            if (reply) {
                var arr = [];
                reply.forEach(function (n) {
                    arr.push(new Creative(n).ado());
                });
            }
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};

util.inherits(Creative, BaseModel);
module.exports = Creative;