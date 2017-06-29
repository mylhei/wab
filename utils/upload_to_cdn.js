/**
 * Created by leiyao on 16/6/1.
 */

var request = require('request');
var Utils = require('../utils/utils');
var fs = require('fs');
var path = require('path');

var Upload_File = require('../model/FileUpload');


module.exports = function (req, res, next) {
    var fileData = req.body.fileData;
    var theReq = request.post(conf.UPLOAD.cdnUrl, function (err, cdnRes, body) {
        if (err) {
            return Utils.response(res, conf.ERRORS.UPLOAD_CDN_FAIL, err);
        }
        if (body) {
            var result = JSON.parse(body);
            console.log(result);
            if (!result.file || result.file == 'err') {
                return Utils.response(res, conf.ERRORS.UPLOAD_CDN_FAIL, "CDN服务返回文件上传失败.");
            }
            fileData.fileCdnUrl = result.file;
            var reply = {
                name: fileData.originalFilename,
                size: fileData.size,
                userId: req.userId,
                localPath: fileData.path,
                fileType: fileData.headers["content-type"],
                cdnUrl: fileData.fileCdnUrl,
                summary: fileData.summary
            };
            Upload_File.insert(reply, function (err, result) {
                if (!err) {
                    Utils.response(res, conf.ERRORS.OK, reply);
                } else {
                    Utils.response(res, conf.ERRORS.UPLOAD_MONGODB_FAIL, err);
                }
            });

        } else {
            return Utils.response(res, conf.ERRORS.UPLOAD_CDN_FAIL, "CDN服务没有返回结果.");
        }
    });
    var fileData = req.body.fileData;
    var filePath = path.join(process.cwd(), fileData.path);
    console.log(filePath);
    var form = theReq.form();
    form.append('username', 'creative');
    form.append('md5str', '77f7919442398f4a312a20c7e27ea0c3');
    form.append('watermark', '0');
    form.append('compress', '85');
    form.append('channel', 'creative');
    form.append('single_upload_submit', 'ok');
    form.append('single_upload_file', fs.createReadStream(filePath));
};