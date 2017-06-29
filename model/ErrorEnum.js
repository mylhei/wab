/**
 * Created by leiyao on 16/3/27.
 */
'use strict';
var Utils = require('util');

function ErrorEnum(code,message){
    this.code = code;
    //message && console.log(message.stack);
    //this.message = message || 'unknown';
}

ErrorEnum.prototype = {
    "print":function(){
        console.log(this);
    }
};

Utils.inherits(ErrorEnum,Error);

module.exports = ErrorEnum;