'use strict';

app.controller('ListController', ['$scope', '$http','$q', '$stateParams', 'toaster','FileUploader' ,'appTools','lebuyService', function($scope, $http,$q,
    $stateParams, toaster,FileUploader, appTools,lebuyService) {
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
            lebuyService.list(searchText,page,pageSize).then(function(body){
                pagination.total = body.total;
                let results = body.results;
                data = results;
                if(searchText){
                    let ft = searchText.toLowerCase();
                    data = results.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) !=
                            -1;
                    });
                }
                $scope.setPagingData(data, pagination);
            }).catch(function(err){
                return toaster.pop('error','错误',err);
            });
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
            field: 'sku_no',
            displayName: 'sku_no'
        }, {
            field:'product_id',
            displayName:'product_id'
        },{
            field:'sku_name',
            displayName:'商品名称'
        },  {
            field:'category_id',
            displayName:'category_id'
        },{
            field:'product_type',
            displayName:'product_type'
        },{
            field:'have_mmsid',
            displayName:'have_mmsid'
        },{
            field: 'original_price',
            displayName: '原价'
        }, {
            field: 'price',
            displayName: '现价',
            cellTemplate:'<span ng-class="{true:\'text-danger \'}[row.entity.modified.prom_price.modified]">{{COL_FIELD}}</span>'
        }, {
            field: 'imgs[0]',
            displayName: '图片',
            cellTemplate: '<img src="{{COL_FIELD}}" class="img-responsive" alt="Responsive image">'
        }, {
            field: '_id',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            cellTemplate: '<div><a class="btn btn-sm" ui-sref="app.lebuy.detail({id:row.entity._id})">查看/编辑</a></div>'
        }]
    };


}]);
