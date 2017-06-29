'use strict';

const Schema = require('mongoose').Schema;
const MongooseUtil = require('../utils/MongoUtils');
const mongoose = MongooseUtil.mongoose;

const AreaSchema = new Schema({
  id: {
    type: Number
  },
  available: {
    type: Number    //1:启用，0:禁用
  },
  name: {
    type: String    //名称
  },
  parent_id: {
    type: Number    //父id，北京的父id为中国的id
  },
  type: {
    type: Number    //类型，0:国家，1:省份，2:城市
  },
  country_id: {
    type: Number    //国家id
  }
});

var Area = mongoose.model('Area', AreaSchema);

module.exports = Area;