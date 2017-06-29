var fs = require('fs');
var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var Upload_File = require('../model/FileUpload');
var upload_to_cdn = require('../utils/upload_to_cdn');
var multiparty = require('multiparty');
var Utils = require('../utils/utils');

function computeFileSum(filePath, callback) {
    if (fs.existsSync(filePath)) {
        var hash = crypto.createHash('md5'),
            hashStream = fs.createReadStream(filePath);
        hashStream.on('data', function (data) {
            hash.update(data)
        });

        hashStream.on('end', function () {
            var md5results = hash.digest('hex');
            callback(md5results);
        });
    } else {
        callback(null);
    }
}

router.all('/*', function (req, res, next) {
    if (req.baseUrl == '/upload' && req.session && req.session.currentUser) {
        req.userId = req.session.currentUser.id;
        req.permission = req.session.currentUser.permission;
        req.groupId = req.session.currentUser.group;
    }
    if (!req.session.currentUser) {
        Utils.response(res, conf.ERRORS.NOT_LOGIN, "API未授权");
    } else {
        next();
    }
});

router.post('/', function (req, res, next) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: conf.UPLOAD.uploadHttpRoot});
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            Utils.response(res, conf.ERRORS.UPLOAD_LOCAL_FAIL, err);
        } else {
            var inputFile = files.file[0];
            var uploadedPath = inputFile.path;
            computeFileSum(uploadedPath, function (sum) {
                if (sum) {
                    inputFile.summary = sum;
                    Upload_File.find({summary: sum}, function (err, docs) {
                        if (docs && docs.length > 0) {
                            Utils.response(res, conf.ERRORS.UPLOAD_LOCAL_EXIST, docs[0]);
                        } else {
                            req.body.fileData = inputFile;
                            next();
                        }
                    });

                } else {
                    Utils.response(res, conf.ERRORS.UPLOAD_LOCAL_SUM_FAIL, "计算文件摘要值失败,可能文件不存在!");
                }
            });

        }
    });
}, upload_to_cdn);

router.get('/get_all', function (req, res, next) {
    Upload_File.find({}, function (err, cols) {
        Utils.response(res, conf.ERRORS.OK, cols);
    });
});
module.exports = router;
