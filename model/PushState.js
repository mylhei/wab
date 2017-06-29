/**
 * Created by leiyao on 16/4/14.
 */
'use strict';
var HandleLog = require('./HandleLog');
var redis = require('redis'),
    redisClient = redis.createClient(conf.PUSH_REDIS_CONF);

/*{
 "table_name": "orderitem",
 "status": "STATUS",
 "content": {
 "id": "ID",
 "duration": "DURATION",
 "type": "TYPE",
 "adid": "ADID",
 "positive": {
 "platform_ids": ["PLATFORM_ID1,"PLATFORM_ID2 "],
 "live_ids ":["LIVE_ID1 ","LIVE_ID2 "]
 },
 "negative ":
 {
 "platform_ids ":["PLATFORM_ID1, "PLATFORM_ID2"],
 "live_ids": ["LIVE_ID1", "LIVE_ID2"]
 }
 }
 }*/

redisClient.on('error', function (err) {
    Mailer.error('redis cant connected\t' + err);
});

function PushAd() {

}

function PushState(table, id, state, content, creator, type) {
    this.table = table;
    this.id = id;
    this.state = state;
    this.content = content;
    this.creator = creator;
    if (type)
        this.type = type;
}

PushState.prototype = {
    init: function (id, state, content, creator, type) {
        this.id = id;
        this.state = state;
        this.content = content;
        this.creator = creator;
        if (type)
            this.type = type;
        return this;
    },
    create: function () {
        this.log('insert');
    },
    update: function () {
        this.log('update');
    },
    "delete": function () {
        this.log('delete');
    },
    log: function (type) {
        try {
            new HandleLog(this.table, this.id, this.state, this.content, type || this.type || '', this.creator).insert()
        } catch (ex) {
            logger.error(type, ex);
        }
    },
    push2Redis: function (value) {
        var redis_value;
        if (typeof value == 'string') {
            redis_value = value;
        } else if (typeof value == 'object') {
            redis_value = JSON.stringify(value);
        }
        try {
            logger.info(JSON.stringify(value));
        } catch (x) {
        }
        var pushResult = redisClient.lpush('message_queue', redis_value);
        if (!pushResult) {
            Mailer.error('推送消息失败\t' + redis_value);
        }
        return pushResult;
    }
};

module.exports = PushState;
