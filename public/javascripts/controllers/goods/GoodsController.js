'use strict';

app.controller('GoodsController', ['$scope', '$http','$q', '$stateParams', 'toaster','FileUploader' ,'appTools','goodsService', function($scope, $http,$q,
    $stateParams, toaster,FileUploader, appTools,goodsService) {
    $scope.iteminfo = function() {
        goodsService.iteminfo($scope.form).then(function (item) {
            console.log(JSON.stringify(item));
            toaster.pop('info','提示','商品已入库，如商品信息不正确，直接删除即可');
            $scope.goods = item;
        }).catch(function (err) {
            toaster.pop('error','错误',err.message);
        });

    };
    $scope.delete = function() {
        var item = $scope.goods;
        if (!item) {
            return toaster.pop('error', '错误', '没有商品无法做删除操作');
        }
        if (!confirm("确定要删除id为【" + item.item_id + "】的商品【" + item.title + "】？")) {
            return;
        }

        goodsService.deleteById(item._id).then(function (result) {
            if(result){
                $scope.goods = null;
                console.log(toaster.pop);
                toaster.pop('info','提示','商品已删除');
            }
        }).catch(function (err) {
            toaster.pop('error','错误','删除失败'+err.message);
        });


    };

    $scope.detail = function(id) {
        if (!id) {
            id = $stateParams.id;
        }
        goodsService.queryById(id).then(function (result) {
            $scope.goods = result;
        }).catch(function (err) {
            toaster.pop('error',err.err,err.message);
        });
    }

    $scope.update = function() {
        var goods = $scope.goods;
        goodsService.update(goods).then(function (updated) {
            toaster.pop('success','成功','更新成功');
        }).catch(function (err) {
            toaster.pop('error',err.err,err.message);
        });

    }

    $scope.search = function() {
        var keyword = $scope.searchText;
        $scope.filterOptions.filterText = keyword;
        // $scope.getPagedDataAsync({}, keyword)
    }

    $scope.list = function() {
        $scope.getPagedDataAsync({
            pageSize: $scope.pagingOptions.pageSize,
            page: $scope.pagingOptions.currentPage
        });
    }

    $scope.remove_goods_pic = function ($index) {
        $scope.goods.pic_urls.splice($index,1);
        toaster.pop('info','提示','记得要保存哦');
    }

    $scope.open_file_upload_modal = function () {
        $('#file_modal').modal('show');
    }
    $scope.close_file_upload_modal = function () {
        $('#file_modal').modal('hide');
        $q.all(uploader.queue.map(function (item) {
            return $q(function (resolve , reject) {
                if(item._xhr && item._xhr.response && item._xhr.response){
                    if(typeof item._xhr.response == 'string'){
                        resolve($scope.goods.pic_urls.push(JSON.parse(item._xhr.response).body.cdnUrl));
                    }else if(typeof item._xhr.response == 'object'){
                        resolve($scope.goods.pic_urls.push(item._xhr.response.body.cdnUrl));
                    }
                }else{
                    resolve(null);
                }
            })
        })).then(function (value) {
            toaster.pop('success','成功','图片已上传，不要忘记保存哦');
            uploader.clearQueue();
        },function (error) {
            toaster.pop('error','失败',error.message);
            uploader.clearQueue();
        });
        // Promise.all(uploader.queue.map(function (item) {
        //     return new Promise(function (resolve , reject) {
        //         if(item._xhr && item._xhr.response && item._xhr.response){
        //             if(typeof item._xhr.response == 'string'){
        //                 resolve($scope.goods.pic_urls.push(JSON.parse(item._xhr.response).body.cdnUrl));
        //             }else if(typeof item._xhr.response == 'object'){
        //                 resolve($scope.goods.pic_urls.push(item._xhr.response.body.cdnUrl));
        //             }
        //         }else{
        //             resolve(null);
        //         }
        //     });
        // })).then(function (value) {
        //     // toaster.pop('success','成功','图片上传成功，不要忘记最后的保存哦');
        //     uploader.clearQueue();
        // }).catch(function (err) {
        //     toaster.pop('error','失败',err.message);
        //     console.log(err);
        // });
    }
    /**
     * 上传图片，FileUpload插件配置
     * **/

    var uploader = $scope.uploader = new FileUploader({
        url: '/upload'
    });
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    // uploader.onAfterAddingFile = function (fileItem) {
    //     console.info('onAfterAddingFile', fileItem);
    // };
    // uploader.onAfterAddingAll = function (addedFileItems) {
    //     console.info('onAfterAddingAll', addedFileItems);
    //     var item = addedFileItems[0];
    //     uploader.uploadAll();
    // };
    // uploader.onBeforeUploadItem = function (item) {
    //     console.info('onBeforeUploadItem', item);
    // };
    // uploader.onProgressItem = function (fileItem, progress) {
    //     console.info('onProgressItem', fileItem, progress);
    // };
    // uploader.onProgressAll = function (progress) {
    //     console.info('onProgressAll', progress);
    // };
    // uploader.onSuccessItem = function (fileItem, response, status, headers) {
    //     console.info('onSuccessItem', fileItem, response, status, headers);
    // };
    // uploader.onErrorItem = function (fileItem, response, status, headers) {
    //     console.info('onErrorItem', fileItem, response, status, headers);
    // };
    // uploader.onCancelItem = function (fileItem, response, status, headers) {
    //     console.info('onCancelItem', fileItem, response, status, headers);
    // };
    // uploader.onCompleteItem = function (fileItem, response, status, headers) {
    //     if (response.header.code != 44 && !appTools.checkResponse(response)) {
    //         return;
    //     } else if (response.header.code == 44) {
    //         toaster.pop('success', '提示', '该文件已经存在,不需要再上传啦,CDN地址已经自动填入到表单中.<br/><img width="180" class="img-responsive" src="'+response.body.cdnUrl+'" />');
    //         // $scope.goods.pic_urls.push(response.body.cdnUrl);
    //     }
    //     else {
    //         toaster.pop('success', '恭喜', '文件上传成功,CDN地址已经自动填入到表单中.<br/><img width="180" class="img-responsive" src="'+response.body.cdnUrl+'" />');
    //         // $scope.goods.pic_urls.push(response.body.cdnUrl);
    //     }
    //     //$scope.curSelectInput.attr('tooltip',"<img src='"+response.body.cdnUrl+"' />");
    //     // console.info('onCompleteItem', fileItem, response, status, headers);
    // };
    // uploader.onCompleteAll = function () {
    //     toaster.pop('success', '成功', '更新成功');
    // };

    /**
     * 上传文件配置结束
     * **/

    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [25, 50, 100],
        pageSize: 25,
        currentPage: 1
    };
    /**
     * pagination:
     *{
     * page:page,  //第几页
     * pageSize:pageSize,//每页的大小
     * total:total     //服务器端总共多少页
     * }
     **/
    $scope.setPagingData = function(data, pagination) {
        var page = pagination.page;
        var pageSize = pagination.pageSize;
        $scope.myData = data;
        $scope.totalServerItems = pagination.total;;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function(pagination, searchText) {
        var page = pagination && pagination.page || 1;
        var pageSize = pagination && pagination.pageSize || $scope.pagingOptions.pageSize;
        setTimeout(function() {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('/goods?page=' + page + '&limit=' + pageSize + '&keyword=' +
                    searchText).success(function(
                    largeLoad) {
                    appTools.checkResponse(largeLoad);
                    var body = largeLoad.body;
                    pagination.total = body.total;
                    var results = body.results;
                    data = results.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) !=
                            -1;
                    });
                    $scope.setPagingData(data, pagination);
                });
            } else {
                $http.get('/goods?page=' + page + '&limit=' + pageSize).success(function(
                    largeLoad) {
                    appTools.checkResponse(largeLoad);
                    var body = largeLoad.body;
                    pagination.total = body.total;
                    data = body.results;
                    $scope.setPagingData(data, pagination);
                });
            }
        }, 100);
    };

    $scope.$watch('pagingOptions', function(newVal, oldVal) {
        if (newVal.currentPage != oldVal.currentPage || newVal.pageSize != oldVal.pageSize) {
            $scope.getPagedDataAsync({
                pageSize: $scope.pagingOptions.pageSize,
                page: $scope.pagingOptions.currentPage
            }, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync({
                pageSize: $scope.pagingOptions.pageSize,
                page: $scope.pagingOptions.currentPage
            }, $scope.filterOptions.filterText);
        }
    }, true);


    $scope.gridOptions = {
        rowHeight: 150,
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: [{
            field: 'item_id',
            displayName: '物品id'
        }, {
            field:'goods_type',
            displayName:'商品来源',
            cellTemplate:'<span ng-if="row.entity.goods_type==\'1\'">阿里</span><span ng-if="row.entity.goods_type==\'2\'">乐视商城</span>'
        },{
            field: 'title',
            displayName: '物品标题'
        }, {
            field: 'create_user.username',
            displayName: '创建用户'
        }, {
            field: 'o_price',
            displayName: '原价'
        }, {
            field: 'prom_price',
            displayName: '现价',
            cellTemplate:'<span ng-class="{true:\'text-danger \'}[row.entity.modified.prom_price.modified]">{{COL_FIELD}}</span>'
        }, {
            field: 'pic_urls[0]',
            displayName: '图片',
            cellTemplate: '<img src="{{COL_FIELD}}" class="img-responsive" alt="Responsive image">'
        }, {
            field: '_id',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            cellTemplate: '<div><a class="btn btn-sm" ui-sref="app.goods.detail({id:row.entity._id})">查看/编辑</a></div>'
        }]
    };


}]);
