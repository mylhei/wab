/**
 * Module dependencies.
 */

ApiClient = require('../index.js').ApiClient;

var client = new ApiClient({
                            'appkey':'4272',
                            'appsecret':'0ebbcccfee18d7ad1aebc5b135ffa906',
                            'url':'http://api.daily.taobao.net/router/rest'});

client.execute('taobao.user.get',
              {
                  'fields':'nick,type,sex,location',
                  'nick':'sandbox_c_1'
              },
              function (error,response) {
                  if(!error)
                    console.log(response);
                  else
                    console.log(error);
              })