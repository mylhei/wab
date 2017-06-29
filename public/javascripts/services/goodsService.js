'use strict';

app.service('goodsService', ['$http','conf','appTools','$q',
    function($http,conf,appTools,$q) {
        this.iteminfo = function iteminfo(data) {
            return $q(function(resolve, reject){
                $http({
                    method: 'POST',
                    url: '/goods/iteminfo',
                    data: data
                }).then(function onSuccess(response) {
                    var data = response.data;
                    var h = data.header;
                    var data = data.body;
                    if (h.code !== 0) {
                        reject({code:h.code,err:'错误',message:data});
                    }
                    resolve(data);
                }, function onError(response) {
                    reject({code:conf.ERRORS.ARGUMENTS_ERROR,err:'错误',message:response});
                });
            });
        };
        this.deleteById = function deleteById(id) {
            return $q(function (resolve,reject) {
                $http({
                    method: 'DELETE',
                    url: '/goods/' + id
                }).then(function(result) {
                    var data = result.data;
                    if(!appTools.checkResponse(data)){
                        return
                    };
                    resolve(true);
                }, function(err) {
                    reject(err);
                });
            });
        };
        this.queryById = function (id) {
            return $q(function (resolve,reject) {
                if (!id) {
                    reject({code:conf.ERRORS.ARGUMENTS_ERROR,message:'id不能为空',err:'参数错误'});
                }
                $http({
                    url: '/goods/' + id,
                    method: 'GET'
                }).then(function onSuccess(response) {
                    response = response.data;
                    appTools.checkResponse(response);
                    resolve(response.body);
                }, function onFail(err) {
                    reject({code:conf.ERRORS.SERVER_ERROR,err:'错误',message:'获取商品信息异常，异常信息:<br>' + err.message});
                })
            });
        };

        this.update = function (goods) {
            if(!goods){
                return Promise.reject({code:conf.ERRORS.ARGUMENTS_ERROR,err:'参数错误',message:'更新操作，goods不能为空'});
            }
            return $q(function (resolve,reject) {
                $http({
                    url: '/goods/' + goods._id,
                    method: 'PUT',
                    data: goods
                }).then(function onSuccess(result) {
                    if (!appTools.checkResponse(result.data)) {
                        return
                    }
                    resolve(true);
                }, function onFail(err) {
                    reject({code:conf.ERRORS.SERVER_ERROR,err:'错误',message:err.message});
                });
            });
        };


    }
]);
