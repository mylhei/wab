'ust strict';

var BaseModel = require('./BasicModel');
var MongooseUtil = require('../utils/MongoUtils');
var MongoPager = require('./MongoPager.js');
var mongoose = MongooseUtil.mongoose;
var db = MongooseUtil.db;

var LeBuy_GOODS_SCHEMA = mongoose.Schema({
    sku_id: {type: Number},
    product_id:{type:Number},
    product_name:{type:String},
    category_id:{type:Number},
    product_type:{type:Number},
    have_mmsid:{type:Number},
    sku_no: {type: String},
    spu_no: {type: String},
    sku_name: {type: String},
    status: {type: Number}, //0:未知状态，1:上线，2:待上线，3:下线，4:已删除
    update_time: {type: Date},
    add_time: {type: Date},
    imgs: {type: Object},
    price: {type: Number},
    original_price: {type: Number},
    lebuy_goods:{type:Object},
    desc:{type:String}
});
var Lebuy_Goods = mongoose.model('Lebuy_Goods', LeBuy_GOODS_SCHEMA);

LeBuy_GOODS_SCHEMA.statics.insert = function (m) {
    var promise = new Promise();
    if (m && typeof m == 'object') {
        m = new Lebuy_Goods(m);
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

Lebuy_Goods.prototype.query = function(pagination, queryParams, sortParams) {
  let page = pagination && pagination.page || 1;
  let limit = pagination && pagination.limit || 5;
  return new Promise(function(resolve, reject) {
    MongoPager.pageQuery(page, limit, Lebuy_Goods, '', queryParams, sortParams || {
      _id: '-1'
    }, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

};

Lebuy_Goods.prototype.queryById = function() {
  let that = this;
  let id = that._id;
  return new Promise(function(resolve, reject) {
    Lebuy_Goods.findOne({
      _id: id
    }, function(err, doc) {
      if (err) {
        reject(err);
      } else {
        resolve(doc);
      }
    })
  });
};

module.exports = Lebuy_Goods;

