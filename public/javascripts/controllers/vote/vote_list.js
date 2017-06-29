'use strict';

app.controller('VoteListController', ['$scope', '$http', '$q', '$state', '$stateParams', 'toaster', 'appTools', 'voteService', function ($scope, $http, $q,
    $state, $stateParams, toaster, appTools, voteService) {
    //分页选项
    $scope.pagingOptions = {
        pageSizes: [25, 50, 100],
        pageSize: 25,
        currentPage: 1
    };

    $scope.list = function() {
        $scope.getPagedDataAsync({
            pageSize: $scope.pagingOptions.pageSize,
            page: $scope.pagingOptions.currentPage
        });
    }

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
            voteService.getVoteList().then(function(data){
                pagination.total = data.total;
                $scope.setPagingData(data.results,pagination);
            }).catch(function(err){
                toaster.pop('error','错误','获取投票列表失败'+err.message);
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
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs: [{
            // field: 'v_activityid',
            field: 'v_groupid',
            displayName: '活动id'
        }, {
            field: 'v_title',
            displayName: '活动标题'
        },{
            field:'updateTime',
            displayName:'更新时间'
        }, {
            field: 'v_activityid',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            cellTemplate: '<div><a class="btn btn-sm" ui-sref="app.vote.detail({v_activityid:row.entity.v_activityid})">查看/编辑</a></div>'
        }]
    };
}]);
