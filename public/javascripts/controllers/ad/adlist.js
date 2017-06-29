function combineSelfTracking(n) {
    return 'http://ark.letv.com/lt?mid=' + n.id + '&comid=' + n.component + '&source=1';
}

app.controller('AdListCtrl', ['$scope', '$http', '$sanitize', '$compile', 'toaster', 'appTools', '$state', function ($scope, $http, $sanitize, $compile, toaster, appTools, $state) {
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.relateOrderCnt = 0;
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
            if (searchText || $scope.platfilter) {
                var ft = searchText.toLowerCase();
                var pt = ($scope.platfilter + "").toLowerCase();
                $http.get('/api/get_ads').success(function (data) {
                    var largeLoad = data.body;
                    if (!appTools.checkResponse(data)) {
                        return;
                    }
                    data = largeLoad.filter(function (item) {
                        if (searchText && $scope.platfilter)
                            return ((item.id + "").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1) && item.platformName.toLowerCase().indexOf(pt) != -1;

                        else if (searchText) {
                            return (item.id + "").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1;

                        } else if ($scope.platfilter) {
                            return item.platformName.toLowerCase().indexOf(pt) != -1;

                        }
                        // return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data, page, pageSize);
                });
            } else {
                $http.get('/api/get_ads').success(function (data) {
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

    $scope.removeItem = function (id) {
        if ($scope.adid) {
            id = $scope.adid;
        } else {
            toaster.pop('error', '提示', '请选中一条数据进行删除');
            return;
        }
        if (!confirm("确定删除此条ID为" + id + "的广告？")) {
            return;
        }
        $http.get('/api/del_ad/' + id).then(function (reply) {
            var data = reply.data;
            if (!appTools.checkResponse(data)) {
                return;
            }
            toaster.pop("success", "提示", "广告删除成功");
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }, function (err) {
            toaster.pop("error", "提示", "广告删除失败");
        });

    };

    /**
     * 批量下线
     * @param id
     */
    $scope.offlineOrderBatch = function (id) {
        if ($scope.adid) {
            id = $scope.adid;
        } else {
            toaster.pop('error', '提示', '请选中一条数据进行操作');
            return;
        }
        if (!confirm("确定下线所有关联ID为" + id + "的订单数据？")) {
            return;
        }

        $http.get('/api/change_order_status_by_adid/' + id).success(function (data, stasus, header) {
            if (!appTools.checkResponse(data)) {
                return;
            }
            var list = data.body;
            var arr = [];
            if (list instanceof Array) {
                angular.forEach(list, function (item) {
                    arr.push('ID:' + item.id + ',名称:' + item.name);
                });
            }
            toaster.pop("success", "提示", "广告暂停成功" + (arr.length > 0 ? '<br/>涉及的订单有:<br/>' + arr.join('<br/>') : ''));
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }).error(function (err) {
            toaster.pop('error', '提示', '接口调用失败.');
        });
    };
    $scope.restoreOrder = function (id) {
        if ($scope.adid) {
            id = $scope.adid;
        } else {
            toaster.pop('error', '提示', '请选中一条数据进行操作');
            return;
        }
        if (!confirm("确定恢复ID为" + id + "的广告数据？\n恢复后,关联的订单需要手动上线.")) {
            return;
        }

        $http.get('/api/change_order_status_by_adid/' + id + '/true').success(function (data, stasus, header) {
            if (!appTools.checkResponse(data)) {
                return;
            }
            toaster.pop("success", "提示", "广告恢复成功");
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }).error(function (err) {
            toaster.pop('error', '提示', '接口调用失败.');
        });
    };
    $scope.viewOrders = function (id) {
        if ($scope.adid) {
            id = $scope.adid;
        } else {
            toaster.pop('error', '提示', '请选中一条数据进行操作');
            return;
        }

        $http.get('/api/get_orders_by_adid/' + id).success(function (data, status, header) {
            if (!appTools.checkResponse(data)) {
                return;
            }
            var list = data.body,
                arr = [],
                order_state = ['已删除', '待上线', '已上线', '已下线'];
            angular.forEach(list, function (item) {
                arr.push('<a href="/#/app/order/detail?id=' + item.id + '">ID:' + item.id + ',名称:' + item.name + ',状态:' + order_state[parseInt(item.state)] + '</a>');
            });
            toaster.pop("success", "提示", "获取关联订单如下:" + (arr.length > 0 ? '<br/>' + arr.join('<br/>') : '无关联订单'));
        });
    };

    $scope.copyAd = function () {
        if ($scope.adid) {
            id = $scope.adid;
        } else {
            toaster.pop('error', '提示', '请选中一条数据进行操作');
            return;
        }

        $http.get('/api/copy_ad/' + id).success(function (data) {
            if (!appTools.checkResponse(data)) {
                return;
            } else {
                toaster.pop("success", "提示", "复制广告成功,新的广告ID为:" + data.body.insertId + "<br/><a href='/#/app/ad/detail?id=" + data.body.insertId + "'>点此进入编辑</a>");
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                //$state.go('app.ad.detail', {id: data.body.insertId});
            }
        }).error(function (err) {
            toaster.pop('error', '提示', '复制广告失败<br/>' + e);
        });
    };
    $scope.adSelections = [];
    $scope.$watch('adSelections[0]', function (newVal, oldVal) {
        if (!newVal)
            return;
        var adid = angular.fromJson(newVal).id;
        $http.get('/api/get_orders_by_adid/' + adid + '/2').success(function (data, status, header) {
            if (!appTools.checkResponse(data)) {
                return;
            }
            $scope.relateOrderCnt = data.body.length;
        });
        //获取直播流
        $http.get('/api/get_monitor/' + adid).then(function (reply) {
            var data = reply.data;
            $scope.ad_impr = '';//曝光
            $scope.ad_clickUrl = '';//点击
            $scope.ad_eventsGroup = '';
            if (!appTools.checkResponse(data)) {
                return;
            }
            if (data.body.impr) {
                data.body.impr.forEach(function (n, i) {
                    if (n.source == 1) {
                        $scope.ad_impr += '<li>' + n.typename + ":" + combineSelfTracking(n) + "</li>";
                    }
                    else {
                        $scope.ad_impr += '<li>' + n.typename + ":" + n.url + "</li>";
                    }
                });
            }
            if (data.body.clickUrl) {
                var n = data.body.clickUrl;
                $scope.ad_clickUrl = n.url;
            }
            if (data.body.eventsGroup) {
                for (var key in data.body.eventsGroup) {
                    var groupName = key;
                    var clickArray = data.body.eventsGroup[groupName];
                    if (clickArray) {
                        clickArray.forEach(function (n, i) {
                            if (n.source == 1) {
                                $scope.ad_eventsGroup += '<li>' + n.typename + ":" + combineSelfTracking(n) + "</li>";
                            }
                            else {
                                $scope.ad_eventsGroup += '<li>' + n.typename + ":" + n.url + "</li>";
                            }
                        });
                    }
                }

            }

        }, function (err) {
            toaster.pop("error", "提示", "获取数据失败");
        });
        $scope.adid = adid;
        $scope.seeMoreLog(5, adid);

    });
    /**
     * 更多日志
     * @param limit
     * @param orderid
     */
    $scope.seeMoreLog = function (limit, orderid) {
        limit = limit || 500;
        orderid = orderid || $scope.orderId;
        if (!orderid) return;
        $http.get('/api/get_log/ad/' + orderid + '/' + limit).then(function (reply) {
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
        selectedItems: $scope.adSelections,
        enableCellSelection: false,
        enableRowSelection: true,
        enableCellEdit: true,
        enableHighlighting: true,
        enablePinning: false,
        showFilter: false,
        showColumnMenu: false,
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
            enableCellEdit: false,
            cellTemplate: '<div class="ngCellText"><a class="link -external-link" ui-sref="app.ad.detail({id:row.entity[\'id\']})">{{row.entity[\'name\']}}</a></div>'
        }, {
            field: 'platformName',
            displayName: '平台',
            enableCellEdit: false,
            showFilter: true,
            sortable: true,
            width: 220
        }, {
            field: 'state',
            displayName: '状态',
            enableCellEdit: false,
            width: 80,
            cellTemplate: '<div class="ngCellText"><span ng-if="row.getProperty(col.field) == 1" class="label bg-info ng-scope" title="正常">正常</span><span ng-if="row.getProperty(col.field) == 2" class="label bg-light ng-scope" title="暂停">暂停</span><span ng-if="row.getProperty(col.field) == 3" class="label bg-warning ng-scope" title="已恢复">已恢复</span></div>'
        }, {
            field: 'creativeName',
            displayName: '创意',
            enableCellEdit: false,
            width: 180,
            cellTemplate: '<div class="ngCellText">{{row.entity[\'cid\']}}:{{row.entity[\'creativeName\']}}</div>'
        }, {
            field: 'orderId',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            cellTemplate: '<a><a class="btn btn-sm" ui-sref="app.ad.detail({id:row.entity[\'id\']})">查看/编辑</a><a title="查看原广告" ng-if="row.entity[\'isCopy\']" ui-sref="app.ad.detail({id:row.entity[\'copyFrom\']})"><i class="fa fa-copyright"></i></a></div>'
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


app.controller('PushAdCtrl', ['$scope', '$http', '$sanitize', '$compile', 'toaster', 'appTools', '$state', function ($scope, $http, $sanitize, $compile, toaster, appTools, $state) {
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.relateOrderCnt = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 25, 50, 500],
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
            if (searchText || $scope.platfilter) {
                var ft = searchText.toLowerCase();
                var pt = ($scope.platfilter + "").toLowerCase();
                $http.get('/api/get_ads').success(function (data) {
                    var largeLoad = data.body;
                    if (!appTools.checkResponse(data)) {
                        return;
                    }
                    data = largeLoad.filter(function (item) {
                        if (searchText && $scope.platfilter)
                            return ((item.id + "").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1) && item.platformName.toLowerCase().indexOf(pt) != -1;

                        else if (searchText) {
                            return (item.id + "").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1;

                        } else if ($scope.platfilter) {
                            return item.platformName.toLowerCase().indexOf(pt) != -1;

                        }
                        // return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data, page, pageSize);
                });
            } else {
                $http.get('/api/get_ads').success(function (data) {
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

    $scope.adSelections = [];

    $scope.gridOptions = {
        data: 'myData',
        rowTemplate: '',
        multiSelect: true,
        showSelectionCheckbox: true,
        selectedItems: $scope.adSelections,
        enableCellSelection: false,
        enableRowSelection: true,
        enableCellEdit: true,
        enableHighlighting: true,
        enablePinning: false,
        showFilter: false,
        showColumnMenu: false,
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
            enableCellEdit: false,
            cellTemplate: '<div class="ngCellText">{{row.entity[\'name\']}}</div>'
        }, {
            field: 'platformName',
            displayName: '平台',
            enableCellEdit: false,
            showFilter: true,
            sortable: true,
            width: 220
        }, {
            field: 'state',
            displayName: '状态',
            enableCellEdit: false,
            width: 80,
            cellTemplate: '<div class="ngCellText"><span ng-if="row.getProperty(col.field) == 1" class="label bg-info ng-scope" title="正常">正常</span><span ng-if="row.getProperty(col.field) == 2" class="label bg-light ng-scope" title="暂停">暂停</span><span ng-if="row.getProperty(col.field) == 3" class="label bg-warning ng-scope" title="已恢复">已恢复</span></div>'
        }, {
            field: 'creativeName',
            displayName: '创意',
            enableCellEdit: false,
            width: 180,
            cellTemplate: '<div class="ngCellText">{{row.entity[\'cid\']}}:{{row.entity[\'creativeName\']}}</div>'
        }, {
            field: 'orderId',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            cellTemplate: '<a><a class="btn btn-sm" ui-sref="app.ad.detail({id:row.entity[\'id\']})">查看/编辑</a><a title="查看原广告" ng-if="row.entity[\'isCopy\']" ui-sref="app.ad.detail({id:row.entity[\'copyFrom\']})"><i class="fa fa-copyright"></i></a></div>'
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

    $scope.handleBatch = function (method) {
        if ($scope.adSelections.length == 0) {
            toaster.pop('error', '提示', '请选择至少一条数据操作');
            return;
        }
        var ids = $scope.adSelections.map(function (item) {
            return item.id;
        });
        switch (method) {
            case 'delete':
            case 'online':
            case 'offline':
            case 'pause':
                $http.post('/api/update_ad_batch', {
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
