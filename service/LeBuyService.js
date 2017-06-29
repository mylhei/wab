'use strict';

'use strict';
const mysql = require('mysql');
const MongoClient = require('mongodb').MongoClient;
const LeBuyGoods = require('../model/LeBuyGoods.js');
const schedule = require('node-schedule');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '10.200.83.22',
    user: 'deal_lebuy_s',
    password: 'Ayp56jIns1Al',
    database: 'deal_lebuy'
});


/**
 * 将接口数据转换为LeBuyGoods实体类
 * @param  {Object} result 
 * @return {LeBuyGoods}        
 */
const convert2LeBuyGoods = function(result) {
    if (result) {
        try {
            let extJson = JSON.parse(result.ext);
            result.imgs = extJson.imgs;
            result.price = extJson.price;
            result.original_price = extJson.original_price;
            let pextJson = JSON.parse(result.pext);
            result.have_mmsid = pextJson.have_mmsid;
            result.desc = pextJson.product_desc;
            return new LeBuyGoods(result);
        } catch (err) {
            throw err;
        }
    } else {
        return null;
    }
}

/**
 * 查询数据库中商品信息
 * @param  {string} limit  每页条数
 * @param  {string} offset 每页偏移量
 * @return {Promise}       查询到数据，封装成Promise
 */
const queryProducts = (limit = 100, offset = 0) => {
    //这里只查询状态为1:上线的商品
    return excSql(`SELECT s.*,p.product_id,p.product_name,p.category_id,p.product_type,p.ext as pext from v3_sku s LEFT JOIN v3_products p ON s.spu_no=p.spu_no where s.status=1 limit ${offset},${limit}`).then((result) => {
        return result.map((item) => {
            //item._id = item.sku_no;
            item.add_time = new Date(item.add_time * 1000);
            item.update_time = new Date(item.update_time * 1000);
            let lebuy_goods = convert2LeBuyGoods(item);
            lebuy_goods.lebuy_goods = item;
            return lebuy_goods;
        });
    });
}

/**
 * 查询总条数
 * @return {Promise} 总条数，封装成Promise
 */
const countProducts = () => {
    return excSql(`SELECT count(sku_no) as count from v3_sku`).then((result) => {
        return result[0].count;
    });
}

const excSql = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * 从商品库导入
 * @return {Promise}        
 */
const importGoods = () => {
    let limit = 100;
    let promises = [];
    return countProducts().then(count => {
        for (let i = 0; i * limit < count; i++) {
            promises.push(queryProducts(limit, i * limit).then((goods) => {
                return Promise.all(goods.map((item) => {
                    return new Promise((resolve, reject) => {
                        LeBuyGoods.findOneAndUpdate({product_id:item.product_id}, {"$set":{
                            lebuy_goods:item.lebuy_goods,
                            sku_no:item.sku_no,
                            status:item.status,
                            sku_id:item.sku_id,
                            spu_no:item.spu_no,
                            sku_name:item.sku_name,
                            update_time:new Date(),
                            product_name:item.product_name,
                            category_id:item.category_id,
                            product_type:item.product_type,
                            imgs:item.imgs,
                            price:item.price,
                            original_price:item.original_price,
                            have_mmsid:item.have_mmsid >>> 0,
                            desc:item.desc
                        }}, {
                            upsert: true
                        }, (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(true);
                            }
                        });
                    });
                }));
            }));
        }
        return Promise.all(promises);
    })
}

/**
 * 定时刷新任务
 */
const task = () => {
    let j = schedule.scheduleJob({
        hour: 0,
        minute: 0
    }, () => {
        console.log('正在导入大屏商品，请稍等。。。。。。');
        module.exports.importGoods().then(() => {
            console.log('导入大屏商品库成功');
        }).catch((err) => {
            console.log('导入大屏商品库错误');
            console.log(err);
        });
    });
}

const start = () => {
    console.log('正在导入大屏商品，请稍等。。。。。。');
    module.exports.importGoods().then(() => {
        console.log('导入大屏商品库成功');
    }).catch((err) => {
        console.log('导入大屏商品库错误');
        console.log(err);
    });
}


module.exports = {
    start,
    importGoods,
    task
}