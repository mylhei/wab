'use strict';
app.controller('adpListController', ['$scope', '$http','$state', '$modal','toaster', 'appTools','adPositionService', function ($scope, $http,$state, $modal,toaster, appTools,adPositionService) {

    $scope.form = Object.create(null);
    $scope.applyed = false; //标识是否申请


    //要创建一个pid申请记录，标识这个pid当前已申请状态
    //当获取到相关广告位时，修改申请状态
    $scope.apply = function(pid){
        if(pid){
            adPositionService.addJob(pid).then(function (result) {
                //result 标识jobid
                toaster.pop('info','信息','您的申请已经提交，请等待');

                $scope.job = null;
                $scope.tip = null;
                $scope.levelTip = null;
                $('#applyModal').modal('hide');
            }).catch(function (err) {
                toaster.pop('error','错误',err);
                $('#applyModal').modal('hide');
            });
        }
    }

    $scope.changeJobPriority = function (jid,level) {
        if(jid && (level > 0 && level <= 2)){
            level = level > 2 ? 2 : level;
            adPositionService.changeJobPriority(jid,level).then(function (result) {
                toaster.pop('info','信息',result);

                $scope.job = null;
                $scope.tip = null;
                $scope.levelTip = null;

                $('#applyModal').modal('hide');
            }).catch(function (err) {
                toaster.pop('error','错误',err);
                $('#applyModal').modal('hide');
            });
        }else{
            $('#applyModal').modal('hide');
            toaster.pop('info','提示','好的');
        }
    }

    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 25, 50],
        pageSize: 10,
        currentPage: 1
    };

    $scope.list = function(){
        var opt = Object.create(null);
        if($scope.form.tag && $scope.form.tag.length > 0){
            opt.tag = $scope.form.tag[0].name;
        }
        if($scope.form.brand && $scope.form.brand.length > 0){
            opt.brand = $scope.form.brand[0].name;
        }
        if($scope.form.pid){
            opt.pid = $scope.form.pid;
        }
        $scope.getPagedDataAsync({
            pageSize: $scope.pagingOptions.pageSize,
            page: $scope.pagingOptions.currentPage
        },opt);
        if(!$scope.tags){
            adPositionService.tags().then(function(result){
                $scope.tags = result.map(function(item){
                    return {
                        id:item,
                        name:item
                    }
                });
            }).catch(function(err){
                toaster.pop('error','错误',err.message);
            });
        }
        if(!$scope.brands){
            adPositionService.brands().then(function(result){
                $scope.brands = result.map(function(item){
                    return {
                        id:item,
                        name:item
                    }
                });
            }).catch(function(err){
                toaster.pop('error','错误',err.message);
            });
        }
        
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
        adPositionService.listAdps(search_opt.tag,search_opt.brand,search_opt.pid).then(function(result){
            $scope.adps = result;
            pagination.total = result.length;

            //如果没有查询到广告位数据,然后先查询JOB，看有没有已生成JOB
            if(result.length == 0 && search_opt.pid){
                adPositionService.queryJob(search_opt.pid).then(function (result) {
                    //已查询到Job，直接显示其状态
                    if(result && result.jid){
                        $scope.job = result;
                        $scope.tip = '您好，您搜索的PID标签正在生成中，请耐心等待！';
                        $scope.levelTip = '当前优先级：' + result.level + '，最小优先级0，最大优先级2'
                    }
                    //未查询到Job，发送JOB
                    else{
                        $scope.tip = '您好，您搜索的PID暂时没有该类型标签，是否现在进行视频分析？';
                    }
                    return $('#applyModal').modal('show');
                }).catch(function (err) {
                });
            }


            $scope.setPagingData(result,pagination);
        }).catch(function(err){
            toaster.pop('error','错误',err.message);
        });
        
    };


    $scope.$watch('form.tag',function(newV,oldV){
        adPositionService.brands(newV && newV[0] && newV[0].name).then(function(result){
            $scope.brands = result.map(function(item){
                return {
                    id:item,
                    name:item
                }
            });
        }).catch(function(err){
            toaster.pop('error','错误',err.message);
        });
    })

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        //if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal == oldVal && oldVal == undefined) {
            return;
        }
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('searchText', function (newV, oldV) {
        if (newV == oldV && oldV == undefined) {
            return;
        }
        newV = newV || "";
        $scope.filterOptions.filterText = newV.toLowerCase();
    });

    $scope.$watch('search_type', function (newVal, oldVal) {
        var key = 'live',
            keys = {
                live: {
                    url: '/api/get_streams/',
                    text: '搜索直播定向条件'
                }, album: {
                    url: '/api/get_albums/',
                    text: '搜索专辑定向条件'
                }, video: {
                    url: '/api/get_videos/',
                    text: '搜索单集定向条件'
                }
            };
        switch (newVal) {
            case '直播':
                key = 'live';
                break;
            case '专辑':
                key = 'album';
                break;
            case '单集':
                key = 'video';
                break;
            default:
                key = 'live';
                break;
        }
        $scope.$broadcast('search_type_changed', keys[key]);
        //search_type_changed
    });


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
            field: 'pid',
            displayName: 'pid',
            width: 100,
            pinnable: false,
            enableCellEdit: false,
            sortable: true
        }, {
            field: 'album_name',
            displayName: '专辑名称',
            enableCellEdit: false,
            width: 160
        },
            {
                field: 'count',
                displayName: '全剧集',
                enableCellEdit: false,
                showFilter: true,
                width: 80
            },
            {
                field: 'tags',
                displayName: '广告位',
                enableCellEdit: false,
                width: 400
            },
            {
                field: 'adps',
                displayName: '广告数量',
                enableCellEdit: false,
                width: 100
            }
            ,{
                field: 'id',
                displayName: '操作',
                enableCellEdit: false,
                sortable: false,
                width: 200,
                pinnable: false,//TODO:上线下线函数接口待定
                cellTemplate: '<div class="ngCellText"><span ><a class="btn btn-default btn-xs" ui-sref="app.adp.detail({pid:row.entity.pid})">查看/编辑</a>'+
                              '</span></div>'
            }],
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };


}]);
