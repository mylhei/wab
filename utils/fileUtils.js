'use strict';

var request = require('request');
var Utils = require('../utils/utils');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var Upload_File = require('../model/FileUpload');

const computeFileSum = function computeFileSum(filePath, callback) {
    if (fs.existsSync(filePath)) {
        var hash = crypto.createHash('md5'),
            hashStream = fs.createReadStream(filePath);
        hashStream.on('data', function (data) {
            hash.update(data)
        });

        hashStream.on('end', function () {
            var md5results = hash.digest('hex');
            callback(null,md5results);
        });
    } else {
        callback(new Error('文件不存在'));
    }
}

/**
* 上传文件
* filePath:文件的路径
* return : 保存到数据库的文件对象
**/
const upload = function(filePath) {
    let stat = fs.statSync(filePath);

    return new Promise(function(resolve, reject) {
        var theReq = request.post(conf.UPLOAD.cdnUrl, function(err, cdnRes, body) {
            if (err) {
                reject(err);
            }
            if (body) {
                var result = JSON.parse(body);
                if (!result.file || result.file == 'err') {
                    reject({code:conf.ERRORS.UPLOAD_CDN_FAIL,message:'CDN服务返回文件上传失败'});
                }else{
                    resolve(result);
                }
                // let fileData = {};
                // fileData.fileCdnUrl = result.file;
                // fileData.size = stat.size;
                // fileData.localPath = filePath;
                // fileData.summary = 
                // var reply = {
                //     name: fileData.originalFilename,
                //     size: fileData.size,
                //     userId: req.userId,
                //     localPath: fileData.path,
                //     fileType: fileData.headers["content-type"],
                //     cdnUrl: fileData.fileCdnUrl,
                //     summary: fileData.summary
                // };
                // Upload_File.insert(reply, function(err, result) {
                //     if (!err) {
                //         resolve(reply);
                //     } else {
                //         reject(err);
                //     }
                // });

            } else {
                // return Utils.response(res, conf.ERRORS.UPLOAD_CDN_FAIL, "CDN服务没有返回结果.");
                reject({code:conf.ERRORS.UPLOAD_CDN_FAIL,message:'CDN服务没有返回结果'});
            }
        });
        console.log(filePath);
        var form = theReq.form();
        form.append('username', 'creative');
        form.append('md5str', '77f7919442398f4a312a20c7e27ea0c3');
        form.append('watermark', '0');
        form.append('compress', '85');
        form.append('channel', 'creative');
        form.append('single_upload_submit', 'ok');
        form.append('single_upload_file', fs.createReadStream(filePath));
    });

}


module.exports = {
    upload,
    computeFileSum
}
