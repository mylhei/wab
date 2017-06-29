'use strict'

const express = require('express');
const router = express.Router();
// const Area = require('../model/Area.js');
const utils = require('../utils/utils.js');
const areaService = require('../service/AreaService');

router.get('/', function (req, res, next) {

    let query = req.query;
    let id = query.id;
    let pid = query.parent_id;
    let type = query.type;
    let country_id = query.country_id;
    let name = query.name;
    let _q = {};
    if(id != null){
        _q.id = {operator:'=',value:id >>> 0} ;
    }
    if(pid != null){
        _q.parent_id = {operator:'=',value:pid >>> 0} ;
    }
    if(type != null){
        _q.type = {operator:'=',value: type >>> 0};
    }
    if(country_id != null){
        _q.country_id = {operator:'=',value:country_id >>> 0} ;
    }
    if(name != null){
        _q.name = {operator:'=',value:name} ;
    }

    areaService.query(_q).then(result => {
        result = result.map(item => {
            console.log();
            item.available = JSON.parse(JSON.stringify(item.available)).data[0];
            return item;
        })
        utils.response(res, conf.ERRORS.OK, result);
    }).catch(err => {
        utils.response(res, conf.ERRORS.SERVER_ERROR, err.message);
    });

});

module.exports = router;