app.service('orderService',['$http','$q','appTools','conf',function ($http,$q,appTools,conf) {
    this.getOrderList = function () {
        return $q(function (resolve,reject) {
            $http.get('/api/get_orders/').then(function onSuccess(response) {
                var data = response.data;
                appTools.checkResponse(data);
                //将coordinate字段json字符串解析成对象
                var orders = data.body.map(function (item) {
                    if(item.coordinate){
                        try{
                            item.coordinate = JSON.parse(item.coordinate);
                        }catch(err){
                            console.log(err);
                        }
                    }
                    return item;
                });
                resolve(orders);
            },function onError(error) {
                reject(error);
            });
        });
    };
    this.getOrderById = function (id) {
        return $q(function (resolve,reject) {
            $http.get('/api/get_order/' + id).then(function (response) {
                var data = response.data;
                appTools.checkResponse(data);
                var order = data.body;
                //如果有坐标,将其转换成对象
                if(order && order.coordinate && Object.prototype.toString.call(order.coordinate) == '[object String]'){
                    try{
                        order.coordinate = JSON.parse(order.coordinate);
                    }catch(err){
                        console.log('坐标转换失败:'+order.coordinate+'无法转换成对象');
                    }
                }
                resolve(order);
            },function onError(err) {
                reject(err);
            });
        });
    };
    this.saveOrder = function (order) {
        if(!order){
            reject({code:conf.ERRORS.ARGUMENTS_ERROR,message:'保存订单时,订单不能为空'});
        }
        
        return $q(function (resolve,reject) {
            $http.post('/api/save_order',order).then(function (response) {
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return;
                }
                resolve(true);

            },function (err) {
                reject(err);
            });
        });
    }
}]);
