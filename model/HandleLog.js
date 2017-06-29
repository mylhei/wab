/**
 * Created by leiyao on 16/4/12.
 */

var pool = require('../utils/MysqlUtils');
var util = require('util');
var Q = require('q');
var BaseModel = require('./BasicModel');

var INSERT_SQL = "INSERT INTO handle_log(table_name,target_id,target_state,content,type,creator) VALUES(?,?,?,?,?,?);";
var SELECT_SQL = "SELECT h.*,u.nickname FROM handle_log h left join users u on h.creator=u.id WHERE table_name=? and target_id=? order by h.id desc limit ?;";

function HandleLog() {
    this.Members = {
        'id': {},
        'table_name': {},
        'content': {},
        'update_time': {},
        'creator': {},
        'nickname': {
            'default': '巡逻兵'
        },
        'type': {},
        'target_id': {},
        'target_state': {}
    };
    this.init.apply(this, arguments);
}

HandleLog.prototype = {
    initWithData: function (table_name, target_id, target_state, sql, type, creator_id,id) {
        this.table_name = table_name;
        this.target_id = target_id;
        this.target_state = target_state;
        this.content = sql;
        this.type = type;
        this.creator = creator_id;
        if (id) {
            this.id = id;
        }
    },
    insert: function () {
        return HandleLog.insert(this);
    }
};

HandleLog.insert = function (obj) {
    var deferred = Q.defer();
    pool.query(INSERT_SQL, [obj.table_name, obj.target_id, obj.target_state, obj.content, obj.type, obj.creator], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(reply);
        }
    });
    return deferred.promise;
};

HandleLog.findByTableId = function (table, id, limit) {
    var deferred = Q.defer();
    pool.query(SELECT_SQL, [table, id, parseInt(limit)], function (err, reply) {
        if (err) {
            deferred.reject(err);
        } else {
            var arr = []
            if (reply && reply.length > 0) {
                reply.forEach(function (n) {
                    arr.push(new HandleLog(n).ado());
                });
            }
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};

util.inherits(HandleLog, BaseModel);

module.exports = HandleLog;