/**
 * Created by leiyao on 16/6/16.
 */

var BaseModel = require('./BasicModel');
var MongooseUtil = require('../utils/MongoUtils');
var mongoose = MongooseUtil.mongoose;
var db = MongooseUtil.db;

var ALI_GOODS_SCHEMA = mongoose.Schema({
    item_id: {type: String},
    item_type: {type: String},
    o_price: {type: String},
    pic_urls: {type: String},
    prom_price: {type: String},
    supported: {type: Boolean},
    title: {type: String},
    trace_supported: {type: Boolean},
    trace_url: {type: String},
    last_updated: {type: Date, default: Date.now},
    pic_urls_array: {type: Array},
    custom_title: {type: String},
    custom_pics: {type: Array}

});
var Ali_Goods = mongoose.model('Ali_Goods', ALI_GOODS_SCHEMA);

ALI_GOODS_SCHEMA.statics.insert = function (m) {
    var promise = new Promise();
    if (m && typeof m == 'object') {
        m = new Ali_Goods(m);
        m.save(function (err, result) {
            if (err) {
                promise.reject(err);
            } else {
                promise.resolve(result);
            }
        });
    } else {
        promise.reject(err);
    }
    return promise;
};

module.exports = Ali_Goods;

