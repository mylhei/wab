/**
 * Created by leiyao on 16/3/31.
 */

var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: 'console',
            category: "console"
        }, //控制台输出
        {
            type: "dateFile",
            filename: 'logs/log.log',
            pattern: "_yyyy-MM-dd",
            alwaysIncludePattern: false,
            category: 'dateFileLog'
        },
        {
            type: "dateFile",
            filename: 'logs/sqllog.log',
            pattern: "_yyyy-MM-dd",
            alwaysIncludePattern: false,
            category: 'sqlFileLog'
        },
        {
            type: 'file',
            filename: 'logs/soldier.log',
            category: 'soldierLog'
        }
    ],
    replaceConsole: true,   //替换console.log
    levels: {
        dateFileLog: 'INFO',
        sqlFileLog: 'INFO',
        soldierLog: 'ERROR'
    }
});

var dateFileLog = log4js.getLogger('dateFileLog');
var soldierLog = log4js.getLogger('soldierLog');
var sqlFile = log4js.getLogger('sqlFileLog');


exports.logger = dateFileLog;

exports.use = function (app) {
    //页面请求日志,用auto的话,默认级别是WARN
    //app.use(log4js.connectLogger(dateFileLog, {level:'auto', format:':method :url'}));
    app.use(log4js.connectLogger(dateFileLog, {level: 'debug', format: ':method :url'}));
};

global.logger = dateFileLog;
global.sqlLogger = sqlFile;
global.soldierLog = soldierLog;