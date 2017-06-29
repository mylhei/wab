'use strict';

const request = require('request');
const LeGoods = require('../model/LeGoods.js');
const GoodsUtils = require('../utils/GoodsUtils.js');
/**
 * [info 获取商品信息，type为类型，ALI为阿里商品，LEMALL为乐视商城商品,item_id分别对应阿里的item_id或乐视商城的spuNo]
 * @param  {[type]} goods_id    [商品的id，阿里商品为阿里的item_id,乐视商城为spuNo]
 * @param  {[type]} goods_type [商品类型：ALI，LEMALL]
 * @return {[Promise]}            [Goods]
 */
const info = function (goods_id,goods_type) {
    if(goods_type == conf.GOODS.TYPE.ALI){
        return GoodsUtils.iteminfo({item_id:goods_id});
    }else if(goods_type == conf.GOODS.TYPE.LEMALL){
        let spuNo = goods_id;
        return new Promise(function (resolve,reject) {
            request.get('http://openapi.shop.letv.com/api/spu/getSpuBySpuNo.json?spuNo='+spuNo,function (error,response,body) {
                if(error && response.statusCode != 200){
                    reject(error || {code:conf.ERRORS.SERVER_ERROR,message:'服务器错误'});
                }
                if(typeof body == 'string'){
                    let r = body;
                    try {
                        r = JSON.parse(body);
                        console.log(r.result);
                        let le_goods = new LeGoods(r.result,goods_type);
                        resolve(le_goods);
                    } catch (e) {
                        console.log('------------GoodsService/31----------------');
                        console.log(e);
                        reject(e);
                    } finally {

                    }
                }else{
                    resolve(body);
                }
            });
        });

    }else{
        return Promise.reject(new Error('参数错误，goods_type必须为ALI或LEMALL两个值'));
    }
}


module.exports = {
    info:info
}
