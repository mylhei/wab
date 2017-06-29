'use strict';

const router = require('express').Router();
const LeBuyGoods = require('../model/LeBuyGoods.js');
const utils = require('../utils/utils.js');


router.get('/', function(req, res) {
    var page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 5;
    var queryOpt = {};
    if (req.query.keyword) {
        queryOpt = {
            $or: [{
                sku_name: {
                    $regex: '.*' + req.query.keyword + '.*'
                }
            }, {
                sku_no: {
                    $regex: '.*' + req.query.keyword + '.*'
                }
            }]
        };
    }

    var goods = new LeBuyGoods();
    goods.query({
        page: page,
        limit: limit
    }, queryOpt).then((value) => {
        utils.response(res, 0, value);
    }).catch((err) => {
        utils.response(res, err.code || conf.ERRORS.SERVER_ERROR, err.message);
    })
});

router.get('/:id',(req,res)=>{
    let id = req.params.id;
    let goods = new LeBuyGoods({
        _id: id
    });
    goods.queryById().then(function(result) {
        utils.response(res, 0, result);
    }).catch(function(err) {
        utils.response(res, conf.ERRORS.SERVER_ERROR, err.message);
    });
});

module.exports = router;