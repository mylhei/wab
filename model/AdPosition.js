'use strict';

const BaseModel = require('./BasicModel');
const MongooseUtil = require('../utils/MongoUtils');
const Schema = require('mongoose').Schema;
const ObjectId = require('mongoose').ObjectId;
const mongoose = MongooseUtil.mongoose;
const MongoPager = require('./MongoPager.js');
const db = MongooseUtil.db;

const auditStatus = {
  UNAUDIT: 0, AUDIT: 1
}

const AdPositionSchema = new Schema({
  vid: {
    type: String
  },
  title: {
    type: String
  },
  cid: {
    type: String
  },
  pid: {
    type: String
  },
  fps: {
    type: String
  },
  tag_list: {
    type: Object
  },
  tag: {
    type: Object
  },
  auditStatus: {
    type: String,
    default: auditStatus.AUDIT  //TODO 初期状态默认为1，默认不审核，以后添加审核管理员后默认状态改为0
  }

});

var AdPosition = mongoose.model('AdPosition', AdPositionSchema);

AdPosition.prototype.insert = function () {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.save(function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

AdPosition.prototype.delete = function() {
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
AdPosition.prototype.query = function(pagination, queryParams, sortParams) {
  let page = pagination && pagination.page || 1;
  let limit = pagination && pagination.limit || 5;
  return new Promise(function(resolve, reject) {
    MongoPager.pageQuery(page, limit, AdPosition, '', queryParams, sortParams || {
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

/**
 * 根据id查询
 **/
AdPosition.prototype.queryById = function() {
  let that = this;
  let id = that._id;
  return new Promise(function(resolve, reject) {
    AdPosition.findOne({
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

AdPosition.prototype.queryByVidAndTag = function(vid,tag){
  let self = this;
  let query = {
    auditStatus:auditStatus.AUDIT
  };
  if(vid){
    query.vid = vid;
  }
  if(tag){
    query.tag = tag;
  }
  return new Promise(function(resolve,reject){
    AdPosition.findOne(query,function(err,doc){
      if(err){
        reject(err);
      }else{
        resolve(doc);
      }
    });
  });
}


module.exports = AdPosition;