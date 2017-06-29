'use strict';
var Goods = require('../model/Goods.js');
var GoodsUtils = require('../utils/GoodsUtils.js');



describe('GoodsUtils', function() {
    it('subscribe', function(done) {
        GoodsUtils.subscribe('1').then(function(result) {
            console.log(JSON.stringify(result));
            done();
        }).catch(function(err) {
            console.log('err of subscribe');
            console.log(err);
            done();
        });
    });
    it('unsubscribe', function(done) {
        GoodsUtils.unsubscribe('1').then(function (result) {
            console.log(JSON.stringify(result));
            done();
        }).catch(function (err) {
            console.log('err of unsubscribe');
            console.log(err);
            done();
        });
    });
    it.skip('iteminfo', function(done) {
        GoodsUtils.iteminfo({
            item_id: '1',
            item_url: 'https://item.taobao.com/item.htm?spm=a219r.lm0.14.37.AuHuwP&id=33159613340&ns=1&abbucket=7'
        }).then(function(resolved) {
            let goods = new Goods(resolved);
            goods.insert().then(function(result) {
                done();
            });
        }).catch(function(err) {
            console.log('err');
            console.log(err);
            done();
        });
    });
});

// var id = '5768e75d8709818748f74795';
//
// var goods = new Goods();
//
// goods.query(null, {
//   _id: id
// }).then((value) => {
//   let goods_item = value.results[0];
//   goods_item.modified = [{
//     "key": "prom_price",
//     "last_value": 50.0,
//     "update_time": new Date()
//   }, {
//     "key": "title",
//     "last_value": "健身服防震聚拢运动文胸无钢圈女跑步透气瑜伽内衣夏",
//     "update_time": new Date()
//   }];
//   goods = new Goods(goods_item);
//   console.log(JSON.stringify(goods));
//   return goods.update();
// }).then((value) => {
//   console.log(value);
// }).catch((err) => {
//   console.log({
//     err: err,
//     ret: 500
//   });
// });