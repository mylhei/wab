/**
 * 乐视商品实体类
 * aligoods:保存的是从阿里平台获取的商品信息，人工不能更改，只能从订阅更改
 * 其他的字段基本和aligoods保持一致，人工可以更改
 * 额外字段
 **/
'use strict';


module.exports = function(goods, goods_type) {
    if (goods_type == conf.GOODS.TYPE.ALI) {
        if (!goods) {
            return null;
        };
        this.goods_type = goods_type;
        this.create_time = goods.create_time || new Date();
        this.update_time = goods.update_time || new Date();
        this.item_id = goods.item_id;
        this.item_type = goods.item_type;
        this.o_price = goods.o_price;
        this.prom_price = goods.prom_price;
        this.supported = goods.supported;
        this.title = goods.title;
        this.trace_supported = goods.trace_supported;
        this.trace_url = goods.trace_url;
        this.last_updated = goods.last_updated;
        this.modified = {};
        if (goods.pic_urls) {
            this.pic_urls = goods.pic_urls && goods.pic_urls.split(';');
        } else {
            this.pic_urls = [];
        }
        this.ali_goods = goods;
    } else if (goods_type == conf.GOODS.TYPE.LEMALL) {
        if (!goods) {
            return null;
        };
        this.goods_type = goods_type;
        this.create_time = goods.create_time || new Date();
        this.update_time = goods.update_time || new Date();
        this.item_id = goods.spuNo;
        this.o_price = goods.marketPrice;
        this.prom_price = goods.price;
        this.title = goods.spuName;
        this.trace_supported = goods.trace_supported;
        this.trace_url = goods.trace_url;
        this.last_updated = goods.last_updated || new Date();
        this.modified = {};
        this.pic_urls = [];
        // this.pic_urls.push(conf.GOODS.LEMALL.IMG_HOST + goods.listImgUrl);
        if(goods.skus){
            goods.skus.forEach(sku =>{
                sku.imgs.forEach(img => {
                    this.pic_urls.push(conf.GOODS.LEMALL.IMG_HOST + img.url);
                })
            });
        }
        this.le_goods = goods;
        if(goods.isShelfOn == 1){
            this.status = conf.GOODS.STATUS.OnSale;
        }else if(goods.isShelfOn == 0){
            this.status = conf.GOODS.STATUS.SaleOut;
        }
    } else {
        return null;
    }

}
