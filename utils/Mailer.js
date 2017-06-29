/**
 * Created by leiyao on 16/5/12.
 */

var Q = require('q');

var Mailer = {
    send: function (toList, title, html, attachements) {
        var defered = Q.defer();

        var spawn = require('child_process').spawn;
        var args = ['sendMail.py', toList, title, html];
        if (attachements) {
            args.push(attachements);
        }
        sendMail = spawn('python', args);
        sendMail.stdout.on('data', function (data) {
            //console.log('mail data:'+data);
            defered.reject(data);
        });

        sendMail.stderr.on('data', function (data) {
            //console.log('mail err:'+data);
            defered.resolve(data);
        });

        sendMail.on('exit', function (code, signal) {
            //console.log('mail exit');
        });

        return defered.promise;
    },
    error: function (msg) {
        try {
            msg = msg.replace(/\t/g, '<br/>');
            return this.send(conf.Mail.toList, conf.Mail.defaultTitle, msg, null);
        } catch (ex) {
            return {};
        }
    }
};

module.exports = Mailer;

global.Mailer = Mailer;