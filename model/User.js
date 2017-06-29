/**
 * Created by leiyao on 16/3/27.
 */
'use strict';
var pool = require('../utils/MysqlUtils');
var cryptoUtil = require('../utils/cryptoUtils');
var Utils = require('util');
var Q = require('q');

/**
 * 用户对象
 * @param user {Object} or {String} 
 * @constructor
 */
function User(user){
    if (user instanceof User){
        Utils.inherits(this,user);
    }else {
        this.username = arguments[0];
        this.password = arguments[1];
        this.permission = arguments[2];
        this.group = arguments[3];
    }
    this.ext = {};
}

var LOGIN_SQL = "select * from users where username = ? ;";
var SIGNUP_SQL = "insert into users(`username`,`password`,`permission`,`group`) values(?,?,?,?);";
var CHANGE_PASSWORD_SQL = "update users set password = ? where username = ?"

User.prototype = {
    encodePassword:function(){
        if (!this.ext.hasEncoded){
            this.password = cryptoUtil.md5(this.password);
            this.ext.hasEncoded = true;
        }
    },
    setPasswordEncode:function () {
      this.ext.hasEncoded = true;  
    },
    signUp:function(cb){
        this.encodePassword();
        pool.query(SIGNUP_SQL,[this.username,this.password,this.permission,this.group],function(){
            cb.apply(this,arguments);
        });
    },
    login:function(cb){
        this.encodePassword();
        pool.query(LOGIN_SQL,this.username,function(err,reply){
            cb(err,reply);
        });
    }
};
User.changePassword = function (userId, username, raw_password, new_password) {
    var defered = Q.defer();
    var user = new User(username, raw_password, -1, 1);
    new_password = cryptoUtil.md5(new_password);
    user.login(function (err, data) {
        if (data && data.length > 0) {
            var u = data[0];
            if (u.password == user.password) {
                pool.query(CHANGE_PASSWORD_SQL, [new_password, username], function (err, data) {
                    if (err) {
                        defered.reject(err);
                    } else {
                        defered.resolve(data);
                    }
                })
            } else {
                defered.reject(new Error('原密码输入错误!'));
            }
        }
    });
    return defered.promise;
};

module.exports = User;