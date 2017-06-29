app.controller('TmpListCtrl', ['$scope', '$http','toaster','appTools',function($scope, $http,toaster,appTools) {
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [13, 25, 50],
        pageSize: 13,
        currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize){
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText || $scope.platfilter) {
                var ft = searchText.toLowerCase();
                var pt = ($scope.platfilter+"").toLowerCase();
                $http.get('/api/get_creatives').success(function (data) {
                    if (!appTools.checkResponse(data)) {
                        return;
                    }
                    var largeLoad = data.body;
                    data = largeLoad.filter(function(item) {
                        if(searchText && $scope.platfilter)
                            return ((item.id+"").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1) && item.platformName.toLowerCase().indexOf(pt) != -1;

                        else if(searchText){
                            return (item.id+"").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1;

                        }else if($scope.platfilter){
                            return item.platformName.toLowerCase().indexOf(pt) != -1;

                        }
                    });
                    $scope.setPagingData(data,page,pageSize);
                });
            } else {
                $http.get('/api/get_creatives').success(function (data) {
                    if (!appTools.checkResponse(data)) {
                        return;
                    }
                    var largeLoad = data.body;
                    $scope.setPagingData(largeLoad,page,pageSize);
                });
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

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
        newVal = newVal || '';
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('searchText', function (newVal, oldVal) {
        if (newVal == oldVal && oldVal == undefined) {
            return;
        }
        newVal = newVal || '';
        $scope.filterOptions.filterText = newVal.toLowerCase();
    });

    $scope.removeItem = function(id){
        if (!confirm("确定删除此条信息？")) {
            return;
        }
        $http.get('/api/del_creative/'+id).then(function (reply) {
            var data = reply.data;
            if (!appTools.checkResponse(data)) {
                return;
            }
            toaster.pop("success","提示","删除成功");
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        },function(err){
            toaster.pop("error","提示","删除失败");
        })

    };
    $scope.gridOptions = {
        data: 'myData',
        rowTemplate: '',
        multiSelect: false,
        enableCellSelection: false,
        enableRowSelection: true,
        enableCellEdit: true,
        enableHighlighting:true,
        enablePinning: false,
        showFilter:false,
        columnDefs: [{
            field: 'id',
            displayName: '序号',
            width: 60,
            pinnable: false,
            enableCellEdit: false,
            sortable: true
        }, {
            field: 'name',
            displayName: '名称',
            enableCellEdit: false
        }, {
            field: 'platformName',
            displayName: '平台',
            enableCellEdit: false,
            showFilter:true,
            width: 220
        }, {
            field: 'createtime',
            displayName: '创建日期',
            enableCellEdit: false,
            width: 180
        },  {
            field: 'orderId',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            cellTemplate: '<div><a class="btn btn-sm" ui-sref="app.creative.view({id:row.entity[\'id\']})">查看/编辑</a><a class="btn btn-default" ng-click="removeItem(row.entity[\'id\'])"><i class="fa fa-remove"></i></a></div>'
        }],
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };

    $scope.$on('filterplatChanged', function (event,item) {
        if (item == undefined) {
            return;
        }
        $scope.platfilter = item;
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    });
}]);


app.directive('ngGridFilterSelectColumn',['$compile',function($compile){
    return{
        restrict:'EA',
        template:'',
        link:function(scope,elm,attrs,ctrl){
            var col = attrs['ngGridFilterSelectColumn'] || 2;
            setTimeout(function(){
                //var titleDiv = elm.find('.colt2')[0];
                if(col){
                    titleDiv = elm.find('.colt'+col)[0];
                    var htmlCode = $compile('<columnselect col=' + col + ' style=" z-index: 1001; position: absolute;   top: 3px;  margin-right: 10px;  right: 0; "></columnselect>')(scope);
                    $(titleDiv).append(htmlCode);
                }
                //空列表提示
                scope.$watch('totalServerItems',function(newVal,oldVal){
                    if(scope.totalServerItems == 0){
                        if($('#emptyGridTip').length<=0)
                            $('.ngCanvas').append('<div id="emptyGridTip" class="wrapper-md" style="text-align: center">'
                                +   '<div class="alert alert-info ng-binding" style="color: #C3C6C8;background-color: #EFF3F5;border-color: #F2F6F7;"><h4>暂无数据</h4></div>'
                                +   '</div>');
                    }else{
                        if($('#emptyGridTip').length>0){
                            $('#emptyGridTip').remove();
                        }
                    }
                });
            },500)
        }
    }
}]);
app.directive('columnselect',['$http','$compile','appTools',function($http,$compile,appTools){
    return{
        restrict:'EA',
        template:'<div><div id="columnFilterBtn" style=" width:20px; height: 20px;" ng-click="filtercolumnselect()"><i class="fa fa-filter"></i></div>'
        +'</div>',
        scope:{

        },
        controller: ['$scope', '$window', '$attrs', function ($scope, $window, $attrs) {
            $scope.$watch('filterplat', function (newV, oldV) {
                if(newV=='全部') {
                    newV = '';
                }
                $scope.$emit('filterplatChanged', newV);
            });
            $scope.selectChange=function(name){
                $scope.showSelect = false;
                $scope.filterplat = name;
            };

        }],
        link:function(scope,elm,attrs,ctrl){
            scope.showSelect =false;
            scope.getplatforms = function(){
                $http.get('/api/get_platforms').then(function (reply) {
                    var data = reply.data;
                    if (!appTools.checkResponse(data)) {
                        return;
                    }else{
                        data.body.splice(0,0,{name:'全部'});
                        scope.plats = data.body;
                    }
                });
            };
            scope.getplatforms();
            scope.filtercolumnselect=function(){
                var e = event || window.event;
                var le = e.clientX - 400;
                var ri = e.clientY;
                var htmlCode = $compile('<div id="SelectPlatForm" ng-show="showSelect"  style="left:' + le + 'px;right:' + ri + 'px;width:200px; position:absolute;-moz-border-radius: 3px;-webkit-border-radius: 3px;border-radius: 3px;background-color: #eeeeee;border: 1px solid #eeeeee;z-index: 1;"><div style="margin-bottom: 0"  ng-repeat="plat in plats" class="list-group"><a class="list-group-item" ng-model="filterplat" ng-click="selectChange(plat.name)">{{plat.name}}</a></div></div>')(scope);
                if($('#SelectPlatForm').length == 0)
                    $('.ngTopPanel').append(htmlCode);
                scope.showSelect = !scope.showSelect;

            };
        }
    }
}]);


