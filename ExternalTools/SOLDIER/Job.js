/**
 * Created by leiyao on 16/4/1.
 */

var log = require('./../../log');
var mailer = require('./../../utils/Mailer');
//mailer.error('服务已经启动\thost:' + require('os').hostname() + '\t' + 'pid:' + process.pid + '\t' + new Date());

var Soldier = require('./Soldier').Soldier,
    soldier = new Soldier;
soldier.run();
process.on('uncaughtException', function (err) {
    soldierLog.error(err);
    mailer.error(err.message);
});