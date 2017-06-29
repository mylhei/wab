/**
 * Created by leiyao on 16/4/6.
 */
require('./DateUtils');
var Utils = {
    "response":function(res,code,content){
        var cnt = 0;
        if(code != conf.ERRORS.OK && content){
            if (content instanceof Error) {
                content = content.stack;
            }
        }else if (content && content.constructor == Array){
            cnt = content.length;
        }
        var response = {
            header:{
                code:code
            },
            body:content
        };
        if (cnt){
            response.header.count = cnt;
        }
        res.json(response);
    },
    "jsonp":function (res,code,content,callback) {
        var cnt = 0;
        if(code != conf.ERRORS.OK && content){
            if (content instanceof Error) {
                content = content.stack;
            }
        }else if (content && content.constructor == Array){
            cnt = content.length;
        }
        var response = {
            header:{
                code:code
            },
            body:content
        };
        if (cnt){
            response.header.count = cnt;
        }
        var s = callback + '(' + JSON.stringify(response) + ')';
        res.send(s);
    }  
};

module.exports = Utils;
