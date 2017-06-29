'use strict';

app.service('lebuyService', ['$http','conf','appTools','$q',
    function($http,conf,appTools,$q) {
        this.queryById = function (id) {
            return $q(function (resolve,reject) {
                if (!id) {
                    reject({code:conf.ERRORS.ARGUMENTS_ERROR,message:'id不能为空',err:'参数错误'});
                }
                $http({
                    url: '/lebuy/' + id,
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

        this.list = function(searchText,page,limit){
            page = page || 1;
            limit = limit || 20;
            let url = '/lebuy?page=' + page + '&limit=' + limit ;
            if(searchText){
                url = url + '&keyword=' + searchText;
            }
            return $q(function(resolve,reject){
                $http.get(url).then(function(largeLoad){
                    appTools.checkResponse(largeLoad.data);
                    resolve(largeLoad.data && largeLoad.data.body);
                },function(err){
                    reject(err);
                });
            });
        }

    }
]);
