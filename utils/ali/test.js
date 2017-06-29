/**
 * Created by leiyao on 16/6/15.
 */
var conf = require('../../conf'),
    aliConf = conf.ALIBABA;
TopClient = require('./topClient').TopClient;
var client = new TopClient({
    'appkey': aliConf.app_key,
    'appsecret': aliConf.app_secret,
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});
//session: 6102226551a0ca39cf98200ed0b90b86b614fef97b5e7c22890962045
//refresh_token: 6100c265693c06f5b3986b0706f5f85e6c1041ea38a97372890962045

client.execute('taobao.baichuan.microservice.iteminfo', {
    'tracer':'pid=123&uid=456&t=20160517',
    'extra':'showItem;showPrice',
    'item_id': '45507422852',
    //'item_url':'https://item.taobao.com/item.htm?spm=686.1000925.0.0.TAQSew&id=43818085419',
    'trace_app_key':aliConf.app_key
}, function(error, response) {
    if (!error) console.log(response);
    else console.log(error);
});

//https://item.taobao.com/item.htm?id=521599866509


client.execute('taobao.baichuan.item.subscribe', {
    'item_id': '43818085419',
    'session': '6102226551a0ca39cf98200ed0b90b86b614fef97b5e7c22890962045'
}, function (error, response) {
    if (!error) console.dir(JSON.stringify(response));
    else console.dir(error);
});

/*client.execute('taobao.baichuan.item.unsubscribe', {
 'item_id':'43818085419',
 'session':'6102226551a0ca39cf98200ed0b90b86b614fef97b5e7c22890962045'
 }, function(error, response) {
 if (!error) console.dir(JSON.stringify(response));
 else console.dir(error);
 });*/
/*
 */
