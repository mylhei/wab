'use strict';
app.controller('adpDetailController', ['$scope', '$http','$state', '$stateParams', 'toaster', 'appTools','adPositionService', function ($scope, $http,$state,$stateParams, toaster, appTools,adPositionService) {

    $scope.pagingOptions = {
        pageSizes: [10, 25, 50],
        pageSize: 10,
        currentPage: 1
    };

    $scope.detail = function(){
        var pid = $stateParams.pid;
        $scope.getPagedDataAsync({
            pageSize: $scope.pagingOptions.pageSize,
            page: $scope.pagingOptions.currentPage
        },{pid:pid});
    }


    $scope.setPagingData = function(data, pagination) {
        var page = pagination.page;
        var pageSize = pagination.pageSize;
        
        $scope.myData = data;
        $scope.totalServerItems = pagination.total;;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.getPagedDataAsync = function (pagination, search_opt) {
        var page = pagination && pagination.page || 1;
        var pageSize = pagination && pagination.pageSize || $scope.pagingOptions.pageSize;
        adPositionService.listByPid(search_opt.pid).then(function(result){
            console.log(result);
            $scope.adps = result;
            pagination.total = result.length;

            var data = result;
            data.forEach(function(item){
                var brands = [];
                item.tag_list[0].ad_list.forEach(function(ad){
                    if(!~brands.indexOf(ad.brand)){
                        brands.push(ad.brand);
                    }
                });
                item.brands = brands;
            })
            data.sort(function(a,b){
                return a.vid - b.vid;
            });

            $scope.setPagingData(result,pagination);
        }).catch(function(err){
            toaster.pop('error','错误',err.message);
        });
        
    };


    // $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        //if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.gridOptions = {
        data: 'myData',
        rowTemplate: '',
        multiSelect: false,
        selectedItems: $scope.orderSelections,
        enableCellSelection: false,
        enableRowSelection: true,
        enableCellEdit: true,
        enableHighlighting: true,
        enablePinning: false,
        showFilter: false,
        columnDefs: [{
            field: 'title',
            displayName: '剧集',
            width: 175,
            pinnable: false,
            enableCellEdit: false,
            sortable: true
        }, {
            field: 'vid',
            displayName: 'vid',
            enableCellEdit: false,
            width: 150
        },
            {
                field: 'tag',
                displayName: '广告位类别',
                enableCellEdit: false,
                showFilter: true,
                width: 100
            },
            {
                field: 'tag_list[0].ad_list.length',
                displayName: '广告位数量',
                enableCellEdit: false,
                width: 100
            },
            {
                field: 'brands',
                displayName: '品牌列表',
                enableCellEdit: false,
                width: 500
            }
            ],
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };


}]);
