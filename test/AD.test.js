/**
 * Created by leiyao on 16/7/1.
 */

var conf = require('../conf');
var log = require('../log');
var AD = require('../model/AD');
var Order = require('../model/Order');

var assert = require('assert');

describe('ad', function () {
    var ad_id = 259;
    var ali_id = '43818085419';
    var nextPrice = (Math.random() * 100).toFixed(2);
    it('change ali goods price', function (done) {
        console.log('nextPrice:' + nextPrice);

        AD.changeGoodsProperty(AD.SOURCE.BAICHUAN, ali_id, conf.SOLDIER.messagerId, {prom_price: nextPrice})
            .then(function (data) {
                assert.ok(data, '数据返回失败');
                //数据库操作成功
                assert.equal(data[0].affectedRows, 1);
            }).catch(function (err) {
            console.log(err);
        }).done(function () {
            done();
        });
    });

    it('change ali goods price not exist goods', function (done) {
        AD.changeGoodsProperty(AD.SOURCE.BAICHUAN, 'not exist id', conf.SOLDIER.internalId, nextPrice)
            .then(function (data) {
                assert.equal(data.length, 0);
            }).catch(function (err) {
            console.log(err);
        }).done(function () {
            done();
        });
    });

    it('check ali goods price', function (done) {
        AD.getAdByGoodsId(AD.SOURCE.BAICHUAN, ali_id, function (err, data) {
            data.forEach(function (n) {
                var form = JSON.parse(n.form);
                assert.equal(form.ali_item_prom_price, nextPrice);
            });
            done();
        });

    });

    /**
     * 根据阿里商品ID下线广告
     */
    it('ali goods offline', done=> {
        AD.pauseByGoodsId(AD.SOURCE.BAICHUAN, ali_id, conf.SOLDIER.messagerId, AD.OFFLINE_REASON.ALI_GOODS_SoldOut).then(function (data) {
            assert.ok(data.length > 0, '处理的订单个数为0');
            data.forEach(function (n) {
                Order.findById(n[0].id).then(function (order) {
                    console.log('订单' + n[0].id + "下线");
                    //关联的订单为下线状态
                    console.log(n[0].ad_id);

                    AD.getAdById(n[0].ad_id).then(function (ad) {
                        console.log('广告:' + ad[0].id + "下线");
                        assert.equal(ad.status = AD.status_code.PAUSE);
                    });
                    assert.equal(order.status == Order.status_code.OFFLINE);
                });
            });

            setTimeout(function () {
                done()
            }, 1500)

        }).catch(function (err) {
            console.log(err);
            done();
        }).done();
    });
});

after(function () {
    console.log('all test done');
});