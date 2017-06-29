app.controller('OrderListCtrl', ['$scope', '$http','$state', 'toaster', 'appTools', 'orderService',function ($scope, $http,$state, toaster, appTools,orderService) {


    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 25, 50],
        pageSize: 10,
        currentPage: 1
    };
    $scope.setPagingData = function (data, page, pageSize) {
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
            //按直播流请求数据
            if ($scope.streamfilter) {
                var ft = searchText.toLowerCase();
                var pt = ($scope.platfilter + "").toLowerCase();
                var st = $scope.streamfilter.split(' ')[0];
                var api = '/api/get_stream_orders/';
                switch ($scope.search_type) {
                    case '专辑':
                        api = '/api/get_album_orders/';
                        break;
                    case '单集':
                        api = '/api/get_video_orders/';
                        break;
                    case '直播':
                    default:
                        api = '/api/get_stream_orders/';
                        break;
                }
                $http.get(api + st).success(function (data) {
                    if (!appTools.checkResponse(data)) {
                        return;
                    }
                    var largeLoad = data.body;
                    data = largeLoad.filter(function (item) {
                        if (searchText && $scope.platfilter) {
                            return ((item.id + "").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1) && item.platformName.toLowerCase().indexOf(pt) != -1;
                        }
                        else if (searchText) {
                            return (item.id + "").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1;

                        } else if ($scope.platfilter) {
                            return item.platformName.toLowerCase().indexOf(pt) != -1;

                        } else {
                            return item;

                        }
                    });
                    $scope.setPagingData(data, page, pageSize);
                });
            }
            //请求全部数据
            else if (searchText || $scope.platfilter) {
                var ft = searchText.toLowerCase();
                var pt = ($scope.platfilter + "").toLowerCase();

                orderService.getOrderList().then(function (orders) {
                    var data = orders.filter(function (item) {
                        if (searchText && $scope.platfilter)
                            return ((item.id + "").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1) && item.platformName.toLowerCase().indexOf(pt) != -1;

                        else if (searchText) {
                            return (item.id + "").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1;

                        } else if ($scope.platfilter) {
                            return item.platformName.toLowerCase().indexOf(pt) != -1;

                        }
                    });
                    $scope.setPagingData(data, page, pageSize);
                }).catch(function (err) {
                    alert('获取订单列表失败'+err.message);
                });

            } else {
                orderService.getOrderList().then(function (orders) {
                    $scope.setPagingData(orders, page, pageSize);
                }).catch(function (err) {
                    alert('获取订单列表失败'+err.message);
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

    $scope.copyOrder = function (id) {
        id = id || ($scope.orderSelections && $scope.orderSelections[0] && $scope.orderSelections[0].id);
        if(!id){
            return toaster.pop('error','提示','请选中一条数据进行复制');
        }
        $state.go('app.order.copy',{id:id});
    }

    $scope.removeItem = function (id) {
        if (!id) {
            if ($scope.orderId) {
                id = $scope.orderId;
            } else {
                toaster.pop('error', '提示', '请选中一条数据进行删除');
                return;
            }
        }
        if (!confirm('确定要删除ID:' + id + '的订单么?\n删除后不可恢复!')) {
            return;
        }
        $http.get('/api/delete_order/' + id).then(function (reply) {
            var data = reply.data;
            if (!appTools.checkResponse(data)) {
                return;
            }
            toaster.pop("success", "提示", "删除成功");
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }, function (err) {
            toaster.pop("error", "提示", "删除失败");
        });
    };
    var orderStatus = ['已删除', '待上线', '已上线', '已下线', '已修改'];
    $scope.changeStatus = function (id, status, deliverType) {
        if (!id) {
            if ($scope.orderId) {
                id = $scope.orderId;
            } else {
                toaster.pop('error', '提示', '请选中一条数据进行删除');
                return;
            }
        }
        var curOrder = $scope.orderSelections[0];
        if (!status) {
            if (curOrder.state == 1 || curOrder.state == 3) {
                status = 2;
            } else {
                status = 3;
            }
        }
        if (!deliverType) {
            deliverType = curOrder.deliverType;
        }
        status = parseInt(status);
        var pass = false;
        if (curOrder.targetType == 'live' && deliverType == 'auto') {
            pass = confirm('该订单为自动投放订单,点击[立即上线/立即下线],该订单将转为手动投放订单,点击确定继续');
        } else {
            pass = true;
        }
        if (pass) {
            $http.get('/api/change_order_status/' + id + '/' + status).then(function (reply) {
                var data = reply.data;
                if (!appTools.checkResponse(data)) {
                    return;
                }
                toaster.pop("success", "提示", "状态已修改为[" + orderStatus[status] + "]");
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
            }, function (err) {
                toaster.pop("error", "提示", "删除失败");
            });
        }
    };
    $scope.orderSelections = [];

    $scope.$watch('orderSelections[0]', function (newVal, oldVal) {
        if (!newVal)
            return;
        var order = angular.fromJson(newVal),
            orderid = order.id;
        $scope.orderDescription = order.description;
        //$scope.order_ad = order.ad_id + ":" + order.adName;
        //获取直播流
        $http.get('/api/get_orders_targeting/' + orderid).then(function (reply) {
            console.log('--------------');
            console.log(reply);
            var data = reply.data;
            if (!appTools.checkResponse(data)) {
                return;
            }
            $scope.orderStream = '';
            var html = {stream: [], album: [], video: [],member:'',z_area:[],f_area:[]};
            data.body.forEach(function (n, i) {
                switch (n.target_type) {
                    case 'live':
                        html.stream.push({type:'直播流name',value:n.target_value});
                        break;
                    case 'live_id':
                        html.stream.push({type:'直播流id',value:n.target_value});
                        break;
                    case 'album':
                        html.album.push(n.target_value);
                        break;
                    case 'video':
                        html.video.push(n.target_value);
                        break;
                    case 'member':
                        switch(n.target_value){
                            case '0':html.member='全部';break;;
                            case '1':html.member='非会员';break;;
                            case '2':html.member='会员';break;;
                        }
                        break;
                    case 'area':
                        if (n.operator == '=') {
                            html.z_area.push(n.target_value);
                        }else if (n.operator == '!'){
                            html.f_area.push(n.target_value);
                        }
                        break;
                }
            });
            if (html.stream.length) {
                $scope.orderStream += '<h5>直播流:</h5>';
                html.stream.forEach(function(item){
                    $scope.orderStream += '</br>';
                    $scope.orderStream += (item.type + ' ： ' + item.value)
                });
                // $scope.orderStream += '<h5>直播流:</h5>' + html.stream.join(',');
            }
            if (html.album.length) {
                $scope.orderStream += '<h5>专辑:</h5>' + html.album.join(',');
            }
            if (html.video.length) {
                $scope.orderStream += '<h5>单集:</h5>' + html.video.join(',');
            }
            if (html.member.length){
                $scope.orderStream += '<h5>会员定向:'+html.member+'</h5>';
            }
            /*$http.get('/api/get_areas_result?zid='+html.z_area.join(',')+'&fid='+html.f_area.join(',')).then(function(reply){
                var data = reply.data;
                if (!appTools.checkResponse(data)) {
                    return;
                }

            }).catch(function(err){
                toaster.pop('error','获取地域出错',err);

            });*/
            if (html.z_area.length){
                $scope.orderStream += '<h5>地域正定向:</h5>'+html.z_area.join(',');
            }
            if (html.f_area.length){
                $scope.orderStream += '<h5>地域反定向:</h5>'+html.f_area.join(',');
            }
        }, function (err) {
            toaster.pop("error", "提示", "获取直数据失败");
        });
        $scope.orderId = orderid;
        $scope.seeMoreLog(5, orderid);


    });
    $scope.seeMoreLog = function (limit, orderid) {
        limit = limit || 500;
        orderid = orderid || $scope.orderId;
        if (!orderid) return;
        $http.get('/api/get_log/orders/' + orderid + '/' + limit).then(function (reply) {
            var data = reply.data;
            if (!appTools.checkResponse(data)) {
                return;
            }
            //var logsHtml = ['<accordion close-others="oneAtATime">'];
            //data.body.forEach(function (n, i) {
            //    logsHtml.push('<accordion-group heading="'+ n.update_time+'">'+n.target_state+'<br/>'+ n.content+'</accordion-group>')
            //});
            //logsHtml.push('</accordion>');
            $scope.handleLog = data.body;
        }, function (err) {
            toaster.pop("error", "提示", "获取直数据失败");
        });
    };
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
            field: 'id',
            displayName: '序号',
            width: 75,
            pinnable: false,
            enableCellEdit: false,
            sortable: true
        }, {
            field: 'name',
            displayName: '名称',
            enableCellEdit: false,
            width: 220
        },
            {
                field: 'platformName',
                displayName: '平台',
                enableCellEdit: false,
                showFilter: true,
                width: 140
            },
            {
                field: 'targetType',
                displayName: '投放方式',
                enableCellEdit: false,
                width: 100,
                cellTemplate: '<div class="ngCellText"><span ng-if="row.getProperty(col.field) == \'vod\'" class="label bg-warning dker ng-scope" title="点播">点播</span><span ng-if="row.getProperty(col.field) == \'live\'" class="label bg-info dker" title="直播">直播</span>&nbsp;<span ng-if="row.getProperty(col.field) == \'live\'" class="label bg-light">{{row.getProperty(\'deliverType\')==\'manual\'?\'手动\':\'自动\'}}</span></div>'
            },
            {
                field: 'startTime',
                displayName: '开始时间',
                enableCellEdit: false,
                width: 140,
                cellTemplate: '<div class="ngCellText" title="{{row.getProperty(\'deliverType\')==\'manual\'?\'手动上线\':\'自动上线\'}}"><span class="label label-info" ng-if="row.getProperty(\'deliverType\')==\'manual\' && !row.getProperty(\'startTime\')">手动</span><span ng-if="row.getProperty(\'startTime\')">{{row.getProperty(col.field)}}</span></div>'
            }
            , {
                field: 'state',
                displayName: '状态',
                enableCellEdit: false,
                //sortable: false,
                pinnable: false,
                width: 80,
                cellTemplate: '<div class="ngCellText"><span ng-if="row.getProperty(col.field) ==1" class="label bg-warning" title="待上线">待上线</span>' +
                '<span ng-if="row.getProperty(col.field) ==2" class="label bg-success" title="已上线">已上线</span>' +
                '<span ng-if="row.getProperty(col.field) ==3" class="label bg-light" title="已完成">已下线</span>' +
                '</div>'
            }, {
                field: 'id',
                displayName: '操作',
                enableCellEdit: false,
                sortable: false,
                width: 200,
                pinnable: false,//TODO:上线下线函数接口待定
                cellTemplate: '<div class="ngCellText"><span ><a ng-if="row.entity[\'orderType\']==1" class="btn btn-default btn-xs" ui-sref="app.order.visual_detail({id:row.entity[\'id\'],orderType:row.entity[\'orderType\']})">查看/编辑</a>'+
                                '<a ng-if="row.entity[\'orderType\']==0" class="btn btn-default btn-xs" ui-sref="app.order.detail({id:row.entity[\'id\'],orderType:0})">查看/编辑</a>'+
                                '<a ng-if="row.entity[\'orderType\']==2" class="btn btn-default btn-xs" ui-sref="app.order.auto_detail({id:row.entity[\'id\'],orderType:0})">查看/编辑</a>'+
                                '</span></div>'
            }],
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };
    $scope.$on('filterplatChanged', function (event, item) {
        if (item == undefined) return;
        $scope.platfilter = item;
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    });
    $scope.$on('selectResultDone', function (event, item) {
        $scope.streamfilter = item.title;
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    });
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) {
            $scope.streamfilter = $('#selectedStream_value').val();// $scope.searchStr;
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    };

    $scope.$on('selectResultNone', function (event, value, results) {
        $scope.streamfilter = null;
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    });
    //是否显示右侧详情面板
    var detailMessageShow = function () {
        var contentWidth = window.innerWidth;
        if (contentWidth < 1334) {
            $scope.isDeitailMessageShow = false;
            $scope.detailMessageClass = 'col-sm-12';
        }
        else {
            $scope.isDeitailMessageShow = true;
            $scope.detailMessageClass = 'col-sm-9';
        }
    };
    detailMessageShow();
    $(window).resize(function () {
        $scope.$apply(function () {
            detailMessageShow();
        });
    });
}]);

app.directive('ngGridFilterSelectColumn', ['$compile', function ($compile) {
    return {
        restrict: 'EA',
        template: '',
        link: function (scope, elm, attrs, ctrl) {
            var col = attrs['ngGridFilterSelectColumn'] || 2;
            setTimeout(function () {
                //var titleDiv = elm.find('.colt2')[0];
                if (col) {
                    titleDiv = elm.find('.colt' + col)[0];
                    var htmlCode = $compile('<columnselect col=' + col + ' style=" z-index: 1001; position: absolute;   top: 3px;  margin-right: 10px;  right: 0; "></columnselect>')(scope);
                    $(titleDiv).append(htmlCode);
                }
                //空列表提示
                scope.$watch('totalServerItems', function (newVal, oldVal) {
                    if (scope.totalServerItems == 0) {
                        if ($('#emptyGridTip').length <= 0)
                            $('.ngCanvas').append('<div id="emptyGridTip" class="wrapper-md" style="text-align: center">'
                                + '<div class="alert alert-info ng-binding" style="color: #C3C6C8;background-color: #EFF3F5;border-color: #F2F6F7;"><h4>暂无数据</h4></div>'
                                + '</div>');
                    } else {
                        if ($('#emptyGridTip').length > 0) {
                            $('#emptyGridTip').remove();
                        }
                    }
                });
            }, 500)
        }
    }
}]);
app.directive('columnselect', ['$http', '$compile', 'appTools', function ($http, $compile, appTools) {
    return {
        restrict: 'EA',
        template: '<div><div id="columnFilterBtn" style=" width:20px; height: 20px;" ng-click="filtercolumnselect()"><i class="fa fa-filter"></i></div>'
        + '</div>',
        scope: {},
        controller: ['$scope', '$window', '$attrs', function ($scope, $window, $attrs) {
            $scope.$watch('filterplat', function (newV, oldV) {
                if (newV == oldV && oldV == undefined) {
                    return;
                }
                if (newV == '全部') {
                    newV = '';
                }

                $scope.$emit('filterplatChanged', newV);
            });
            $scope.selectChange = function (name) {
                $scope.showSelect = false;
                $scope.filterplat = name;
            };

        }],
        link: function (scope, elm, attrs, ctrl) {
            scope.showSelect = false;
            scope.getplatforms = function () {
                $http.get('/api/get_platforms').then(function (reply) {
                    var data = reply.data;
                    if (!appTools.checkResponse(data)) {
                        return;
                    } else {
                        data.body.splice(0, 0, {name: '全部'});
                        scope.plats = data.body;
                    }
                });
            };
            scope.getplatforms();
            scope.filtercolumnselect = function () {
                var e = event || window.event;
                var le = e.clientX - 400;
                var ri = e.clientY;
                var htmlCode = $compile('<div id="SelectPlatForm" ng-show="showSelect"  style="left:' + le + 'px;right:' + ri + 'px;width:200px; position:absolute;-moz-border-radius: 3px;-webkit-border-radius: 3px;border-radius: 3px;background-color: #eeeeee;border: 1px solid #eeeeee;z-index: 1;"><div style="margin-bottom: 0"  ng-repeat="plat in plats" class="list-group"><a class="list-group-item" ng-model="filterplat" ng-click="selectChange(plat.name)">{{plat.name}}</a></div></div>')(scope);
                if ($('#SelectPlatForm').length == 0)
                    $('.ngTopPanel').append(htmlCode);
                scope.showSelect = !scope.showSelect;

            };
        }
    }
}]);

app.controller('PushOrderCtrl', ['$scope', '$http', 'toaster', 'appTools', function ($scope, $http, toaster, appTools) {
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 25, 50, 100, 500, 1000],
        pageSize: 10,
        currentPage: 1
    };
    $scope.setPagingData = function (data, page, pageSize) {
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
            //按直播流请求数据
            if ($scope.streamfilter) {
                var ft = searchText.toLowerCase();
                var pt = ($scope.platfilter + "").toLowerCase();
                var st = $scope.streamfilter.split(' ')[0];
                var api = '/api/get_stream_orders/';
                switch ($scope.search_type) {
                    case '专辑':
                        api = '/api/get_album_orders/';
                        break;
                    case '单集':
                        api = '/api/get_video_orders/';
                        break;
                    case '直播':
                    default:
                        api = '/api/get_stream_orders/';
                        break;
                }
                $http.get(api + st).success(function (data) {
                    if (!appTools.checkResponse(data)) {
                        return;
                    }
                    var largeLoad = data.body;
                    data = largeLoad.filter(function (item) {
                        if (searchText && $scope.platfilter) {
                            return ((item.id + "").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1) && item.platformName.toLowerCase().indexOf(pt) != -1;
                        }
                        else if (searchText) {
                            return (item.id + "").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1;

                        } else if ($scope.platfilter) {
                            return item.platformName.toLowerCase().indexOf(pt) != -1;

                        } else {
                            return item;

                        }
                    });
                    $scope.setPagingData(data, page, pageSize);
                });
            }
            //请求全部数据
            else if (searchText || $scope.platfilter) {
                var ft = searchText.toLowerCase();
                var pt = ($scope.platfilter + "").toLowerCase();
                $http.get('/api/get_orders/').success(function (data) {
                    if (!appTools.checkResponse(data)) {
                        return;
                    }
                    var largeLoad = data.body;
                    data = largeLoad.filter(function (item) {
                        if (searchText && $scope.platfilter)
                            return ((item.id + "").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1) && item.platformName.toLowerCase().indexOf(pt) != -1;

                        else if (searchText) {
                            return (item.id + "").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1;

                        } else if ($scope.platfilter) {
                            return item.platformName.toLowerCase().indexOf(pt) != -1;

                        }
                    });
                    $scope.setPagingData(data, page, pageSize);
                });
            } else {
                $http.get('/api/get_orders').success(function (data) {
                    if (!appTools.checkResponse(data)) {
                        return;
                    }
                    var largeLoad = data.body;
                    $scope.setPagingData(largeLoad, page, pageSize);
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

    var orderStatus = ['已删除', '待上线', '已上线', '已下线', '已修改'];
    $scope.changeStatus = function (id, status, deliverType) {
        if (!id) {
            if ($scope.orderId) {
                id = $scope.orderId;
            } else {
                toaster.pop('error', '提示', '请选中一条数据进行删除');
                return;
            }
        }
        var curOrder = $scope.orderSelections[0];
        if (!status) {
            if (curOrder.state == 1 || curOrder.state == 3) {
                status = 2;
            } else {
                status = 3;
            }
        }
        if (!deliverType) {
            deliverType = curOrder.deliverType;
        }
        status = parseInt(status);
        var pass = false;
        if (curOrder.targetType == 'live' && deliverType == 'auto') {
            pass = confirm('该订单为自动投放订单,点击[立即上线/立即下线],该订单将转为手动投放订单,点击确定继续');
        } else {
            pass = true;
        }
        if (pass) {
            $http.get('/api/change_order_status/' + id + '/' + status).then(function (reply) {
                var data = reply.data;
                if (!appTools.checkResponse(data)) {
                    return;
                }
                toaster.pop("success", "提示", "状态已修改为[" + orderStatus[status] + "]");
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
            }, function (err) {
                toaster.pop("error", "提示", "删除失败");
            });
        }
    };
    $scope.orderSelections = [];

    $scope.gridOptions = {
        data: 'myData',
        rowTemplate: '',
        multiSelect: true,
        selectedItems: $scope.orderSelections,
        enableCellSelection: false,
        enableRowSelection: true,
        enableCellEdit: true,
        enableHighlighting: true,
        enablePinning: false,
        showFilter: false,
        showSelectionCheckbox: true,
        columnDefs: [{
            field: 'id',
            displayName: '序号',
            width: 45,
            pinnable: false,
            enableCellEdit: false,
            sortable: true
        }, {
            field: 'name',
            displayName: '名称',
            enableCellEdit: false,
            width: 220
        },
            {
                field: 'platformName',
                displayName: '平台',
                enableCellEdit: false,
                showFilter: true,
                width: 140
            },
            {
                field: 'targetType',
                displayName: '投放方式',
                enableCellEdit: false,
                width: 100,
                cellTemplate: '<div class="ngCellText"><span ng-if="row.getProperty(col.field) == \'vod\'" class="label bg-warning dker ng-scope" title="点播">点播</span><span ng-if="row.getProperty(col.field) == \'live\'" class="label bg-info dker" title="直播">直播</span>&nbsp;<span ng-if="row.getProperty(col.field) == \'live\'" class="label bg-light">{{row.getProperty(\'deliverType\')==\'manual\'?\'手动\':\'自动\'}}</span></div>'
            },
            {
                field: 'startTime',
                displayName: '开始时间',
                enableCellEdit: false,
                width: 140,
                cellTemplate: '<div class="ngCellText" title="{{row.getProperty(\'deliverType\')==\'manual\'?\'手动上线\':\'自动上线\'}}"><span class="label label-info" ng-if="row.getProperty(\'deliverType\')==\'manual\' && !row.getProperty(\'startTime\')">手动</span><span ng-if="row.getProperty(\'startTime\')">{{row.getProperty(col.field)}}</span></div>'
            }
            , {
                field: 'state',
                displayName: '状态',
                enableCellEdit: false,
                //sortable: false,
                pinnable: false,
                width: 80,
                cellTemplate: '<div class="ngCellText"><span ng-if="row.getProperty(col.field) ==1" class="label bg-warning" title="待上线">待上线</span>' +
                '<span ng-if="row.getProperty(col.field) ==2" class="label bg-success" title="已上线">已上线</span>' +
                '<span ng-if="row.getProperty(col.field) ==3" class="label bg-light" title="已完成">已下线</span>' +
                '</div>'
            }, {
                field: 'id',
                displayName: '操作',
                enableCellEdit: false,
                sortable: false,
                width: 200,
                pinnable: false,//TODO:上线下线函数接口待定
                cellTemplate: '<div class="ngCellText"><span ><a class="btn btn-default btn-xs" ui-sref="app.order.detail({id:row.entity[\'id\']})">查看/编辑</a></span></div>'
            }],
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };
    $scope.$on('filterplatChanged', function (event, item) {
        if (item == undefined) return;
        $scope.platfilter = item;
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    });
    $scope.$on('selectResultDone', function (event, item) {
        $scope.streamfilter = item.title;
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    });
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) {
            $scope.streamfilter = $('#selectedStream_value').val();// $scope.searchStr;
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    };

    $scope.$on('selectResultNone', function (event, value, results) {
        $scope.streamfilter = null;
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    });

    $scope.handleBatch = function (method) {
        if ($scope.orderSelections.length == 0) {
            toaster.pop('error', '提示', '请选择至少一条数据操作');
            return;
        }
        var ids = $scope.orderSelections.map(function (item) {
            return item.id;
        });
        switch (method) {
            case 'delete':
            case 'online':
            case 'offline':
                $http.post('/api/update_order_batch', {
                    method: method,
                    ids: ids.join(',')
                }).success(function (result) {
                    if (!appTools.checkResponse(result)) {
                        return;
                    }
                    toaster.pop('info', '提示', '操作成功,' + method);
                }).catch(function (err) {
                    toaster.pop('error', '提示', '操作失败,' + method);
                    console.log(err);
                });
                break;
            default:
                break;
        }
    }
}]);
