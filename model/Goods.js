'use strict';
/**
 * Created by leiyao on 16/6/16.
 */

var BaseModel = require('./BasicModel');
var MongooseUtil = require('../utils/MongoUtils');
var Schema = require('mongoose').Schema;
var ObjectId = require('mongoose').ObjectId;
var mongoose = MongooseUtil.mongoose;
var MongoPager = require('./MongoPager.js');
var db = MongooseUtil.db;
var ALI_GOODS_SCHEMA = new Schema({
  item_id: {
    type: String
  },
  item_type: {
    type: String
  },
  o_price: {
    type: String
  },
  pic_urls: {
    type: String
  },
  prom_price: {
    type: String
  },
  supported: {
    type: Boolean
  },
  title: {
    type: String
  },
  trace_supported: {
    type: Boolean
  },
  trace_url: {
    type: String
  }
});
var GOODS_SCHEMA = new Schema({
  create_user: {
    type: Object
  },
  ali_goods: {
    type: ALI_GOODS_SCHEMA
  },
  le_goods:{
      type:Object
  },
  goods_type:{
      type:String
  },
  item_id: {
    type: String,
    unique: true
  },
  item_type: {
    type: String
  },
  o_price: {
    type: String
  },
  pic_urls: {
    type: Array,
    default:[]
  },
  prom_price: {
    type: String
  },
  supported: {
    type: Boolean
  },
  title: {
    type: String
  },
  trace_supported: {
    type: Boolean
  },
  trace_url: {
    type: String
  },
  last_updated: {
    type: Date,
    default: Date.now
  },
  create_time: {
    type: Date,
    default: Date.now
  },
  update_time: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Object,
    default: {}
  },
  status:{
      type:String,
      default:conf.GOODS.STATUS.OnSale
  }
});

var Goods = mongoose.model('Goods', GOODS_SCHEMA);

Goods.prototype.insert = function() {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.save(function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

Goods.prototype.delete = function() {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.remove({
      _id: that._id
    }, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
/**
 * pagination封装分页条件(page:第几页，limit:每页的条数)
 * opt封装查询条件
 **/
Goods.prototype.query = function(pagination, queryParams, sortParams) {
  let page = pagination && pagination.page || 1;
  let limit = pagination && pagination.limit || 5;
  return new Promise(function(resolve, reject) {
    MongoPager.pageQuery(page, limit, Goods, '', queryParams, sortParams || {
      _id: '-1'
    }, function(err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

};

Goods.prototype.queryByItemId = function (item_id) {
    return Goods.findOne({item_id:item_id});
}

/**
 * 根据id查询
 **/
Goods.prototype.queryById = function() {
  let that = this;
  let id = that._id;
  return new Promise(function(resolve, reject) {
    Goods.findOne({
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



/**
 * 更新操作，使用set控制更新字段
 * 必须字段：id:根据id进行更新
 * 其余为更新字段，更新哪个字段传哪个字段即可
 **/
Goods.prototype.update = function() {
  let that = this;
  let _id = that._id;
  return new Promise(function(resolve, reject) {
    Goods.update({
      _id: _id
    }, that, {}, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = Goods;
