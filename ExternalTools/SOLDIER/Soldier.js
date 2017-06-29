/**
 * Created by leiyao on 16/3/31.
 * @remark 哨兵
 */

var util = require('util'),
    conf,
    process = require('process');

if (process.env.NODE_ENV == 'production') {
    conf = require('./../../conf-online');
    console.log('online' + global.conf.MYSQL.host);
} else {
    conf = require('./../../conf');
}
var PushState = require('./../../model/PushState');
var Order = require('./../../model/Order');
/**
 *
 * @constructor
 */
function Soldier() {

}

/**
 * 等待
 * @param ticks 毫秒
 */
var wait = function (ticks, func) {
    setTimeout(func, ticks);
    //var now = new Date();
    //while (new Date - now <= ticks);
};


Soldier.prototype = {
    run: function () {
        var kueConf = {
            "prefix": 'w',
            "redis": conf.REDIS,
            "jobEvents": true
        };

        // MQ
        //queue = kue.createQueue(kueConf);
        //kue.app.listen(4000);

        this.Patrols();
    },
    /**
     * 巡逻
     * @constructor
     */
    "Patrols": function () {
        var me = this;
        var lastDone = true;
        var run = function () {
            if (lastDone) {
                lastDone = false;
                //30s超时
                me.timer = setTimeout(function () {
                    soldierLog.error("处理任务超时");
                    Mailer.error("处理任务超时");
                }, 30000);
                me.DoWork(null, function (err, r) {
                    lastDone = true;
                    clearTimeout(me.timer);
                    wait(conf.SOLDIER.interval, function () {
                        process.nextTick(run);
                    });
                });
            }
        };
        run();
    },
    "DoWork": function (job, done) {
        //call find_push_state('2016-04-17','2016-04-30')
        Order.loop().then(function (reply) {
            var list = reply;
            if (list.length > 0) {
                var handle_count = 0;
                var i = 0;
                for (i = 0; i < list.length; ++i) {
                    var n = list[i];
                    var order = new Order(n);
                    order.pushState().then(function (data) {
                        ++handle_count;
                        soldierLog.error(handle_count);
                        if (handle_count == list.length) {
                            done();
                        }
                    }, function (err) {
                        ++handle_count;
                        soldierLog.error("err:" + handle_count);
                        if (handle_count == list.length) {
                            done();
                        }
                    });
                }
            } else {
                soldierLog.error('empty loop');
                done();
            }
        }, function (err) {
            soldierLog.error(err);
            done();
        }).catch(function (err) {
            soldierLog.error(err);
            done();
        });
    }
};

exports.Soldier = Soldier;