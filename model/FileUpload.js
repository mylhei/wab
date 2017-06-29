/**
 * Created by leiyao on 16/6/1.
 */
'use strict';
var MongooseUtil = require('../utils/MongoUtils');
var mongoose = MongooseUtil.mongoose;
var db = MongooseUtil.db;

var UploadFileSchema = mongoose.Schema({
    name: {type: String},
    size: {type: Number},
    userId: {type: Number},
    localPath: {type: String},
    fileType: {type: String},
    cdnUrl: {type: String},
    summary: {type: String},
    date: {type: Date, default: Date.now}
});


UploadFileSchema.statics.insert = function (file, callback) {
    if (file && typeof file == 'object') {
        file = new UploadFile(file);
        file.save(callback);
    } else {
        file = new UploadFile({
            name: 'xx3x',
            size: 100,
            userId: 1,
            cdnUrl: 'http://ssssss'
        });
        file.save(callback);
    }
};

var UploadFile = mongoose.model('UploadFile', UploadFileSchema);

module.exports = UploadFile;
//UploadFile.methods.save