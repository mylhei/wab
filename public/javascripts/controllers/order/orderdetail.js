'use strict';

/* Controllers */

Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((
            "00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};


app.service('OrderService', ['$http', 'appTools', 'apiService', function($http, appTools, apiService) {
    // Form controller
    this.initMultiSelect = function($scope, $http) {
        var apiList = {
            'stream': {
                api: '/api/get_streams/',
                key: 'stream_list'
            }
        };
        $scope.lastKw = '';

        $scope.fSearchChange = function(obj, type) {
            if (obj.keyword.length < 3) {
                return;
            }
            if (obj.keyword == $scope.lastKw) return;
            $scope.lastKw = obj.keyword;

            var doRequest = function(keyName) {
                if (!apiList[keyName]) return;
                $http({
                    method: 'GET',
                    url: apiList[keyName].api + obj.keyword
                }).success(function(data, status, headers, config) {
                    if (data.header && data.header.code == 0) {
                        //setTimeout(function () {
                        $scope[apiList[keyName].key] = data.body;
                        //}, 100);


                    } else {
                        $scope[apiList[keyName].key] = [];
                    }
                }).error(function(data, status, headers, config) {
                    $scope[apiList[keyName].key] = [];
                });
            };
            doRequest(type)
        };

        $scope.fClose = function(type) {
            if (type == 'stream') {
                $scope.form.streams = [];
                for (var i in this.stream_output) {
                    $scope.form.streams.push(this.stream_output[i].name);
                }
            } else if (type == 'video') {
                $scope.form.videos = [];
                // for(var i in this.vid_output){
                // $scope.form.videos.push(this.vid_output[i].id);
                // }
                $scope.form.videos = this.vid_output;
            } else if (type == 'album') {
                $scope.form.albums = [];
                for (var i in this.aid_output) {
                    $scope.form.albums.push(this.aid_output[i].id);
                }
            }
        };
        $scope.selected = function(type) {
            if (type == 'albums') {
                if ($scope.form.videos && $scope.form.videos.length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else if (type == 'videos') {
                if ($scope.form.albums && $scope.form.albums.length > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    };

    this.doOrderCreativeDisplay = function($scope, $modal, $modalInstance, $log, toaster, $http, $state,
        appTools, isViewAdForm) {
        var me = this;
        // 不知道放着行不行?
        $scope.$on('trackingChanged', function(evt, value) {
            $scope.tracking = value;
        });
        // 保存
        $scope.savead = function() {
            me.resolveCreativeForm($scope);
            me.resolveTrackingForm($scope);

            //console.log($scope.form);
            //console.dir($scope.tracking.events);
            //console.dir($scope.tracking.impr);

            $http.post('/api/save_ads', {
                form: $scope.form,
                tracking: $scope.tracking
            }).then(function(reply) {
                var data = reply.data;
                if (!appTools.checkResponse(data)) {
                    return;
                }
                toaster.pop('success', '提示', '创建成功');
                $modalInstance.close(data.body);
            }, function(err) {
                console.log(err);
                toaster.pop('error', '提示', '获取数据失败\n' + err);
            });

        };

    };
    // the save func as addetail.js
    this.resolveTrackingForm = function($scope) {
        var events = $scope.tracking.events;
        if (events && events.length > 0) {
            events.forEach(function(n) {
                n.title = $('option[value$="' + n.component + '"]:selected:eq(0)').text();
            });
        }
    };
    // the save func as addetail.js
    this.resolveCreativeForm = function($scope) {
        var template = angular.fromJson($scope.creativeFormContent).widgetData;
        var json = {};
        if (!template) return;
        template.forEach(function(item) {
            switch (item.type) {
                case 'HiddenItem':
                case 'StringTextItem':
                    var val = $('#form_preview input[name="' + item.name + '"]').val();
                    json[item.name] = val;
                    break;
                case 'SelectItem':
                    var val = $('#form_preview select[name="' + item.name + '"]').val();
                    if (val.indexOf(':') > 0)
                        val = val.split(':')[1];
                    json[item.name] = val;
                    break;
                case 'StringTextList':
                    json[item.name] = [];
                    var inputs = $('#form_preview input[name="' + item.name + '"]');
                    for (var i = 0; i < inputs.length; ++i) {
                        var n = $(inputs[i]);
                        var mutilJson = {
                            data: n.val(),
                            name: n.attr('data-index'),
                            title: n.attr('data-title')
                        };
                        if (item.canExpose) {
                            mutilJson.impr_name = mutilJson.name + '-impr';
                        }
                        if (item.canClick) {
                            mutilJson.click_name = mutilJson.name + '-click';
                        }
                        json[item.name].push(mutilJson);
                    }
                    break;
                case 'CheckBoxList':
                    //if (!$scope.formContent) {
                    json[item.name] = [];
                    item.values.forEach(function(n) {
                        json[item.name].push({
                            data: Boolean($('#form_preview input[name="' + n.name +
                                '"]').prop('checked')),
                            name: n.name,
                            title: n.title
                        });
                    });
                    //} else {
                    //    json[item.name] = $scope.formContent[item.name];
                    //}
                    break;
                case 'Ali_Goods_Select_Item':
                    var ali_item_keys = ['goods_id', 'goods_title', 'goods_price_raw',
                        'goods_price_now', 'goods_trace_url', 'goods_details'
                    ];
                    ali_item_keys.forEach(function(n) {
                        var elem = $('#form_preview input[name="' + n + '"]');
                        // 有相同name的input值,数据归为数组
                        if (elem.length > 1) {
                            json[n] = [];
                            //挨个元素去遍历
                            for (var ii = 0; ii < elem.length; ii++) {
                                json[n].push({
                                    data: elem[ii].value,
                                    name: n + "-" + ii,
                                    title: '阿里商品-' + (ii + 1)
                                });
                            }
                        } else {
                            json[n] = elem.val();
                        }
                    });
                    break;
            }
        });
        $scope.form.form = angular.toJson(json);
    };

    this.getVideoAlbums = function($scope) {
        // video 结构改为 {id:xxx,parent_id:xxx}
        var videos = [];
        if ($scope.form.videos && $scope.form.videos.length > 0) {
            videos = $scope.form.videos.map(function(item) {
                return item.id;
            });
        }
        // 批量根据定向ID获取名称
        $http.get('/api/get_video_album_batch?aids=' + $scope.form.albums.join(',') + '&vids=' + videos
            .join(',')).success(function(data, status, headers, config) {
            if (!appTools.checkResponse(data)) {
                return;
            }
            if ($scope.aid_list) {
                $scope.aid_list.forEach(function(item) {
                    if (data.body.album[String(item.id)]) {
                        item.name = data.body.album[String(item.id)];
                    }
                });

            }

            if ($scope.vid_list) {
                $scope.vid_list.forEach(function(item) {
                    if (data.body.video[String(item.id)]) {
                        item.name = data.body.video[String(item.id)];
                    }
                });
            }

        }).error(function(err) {

        });
    };
    return this;
}]);

app.controller('OrderDetailCtrl', ['$scope', '$http', 'toaster', '$state', '$modal', '$log', '$rootScope',
    '$stateParams', 'appTools', 'OrderService', 'orderService', 'apiService', 'areaService',
    function($scope, $http, toaster, $state, $modal, $log, $rootScope, $stateParams, appTools, OrderService,
        orderService, apiService, areaService) {
        $scope.form = $scope.form || {};
        $scope.form.id = $stateParams.id;
        $scope.form.duration = 15;
        $scope.form.startTime = new Date(new Date().getTime() + 5 * 1000).Format("yyyy-MM-dd hh:mm");
        $scope.form.targetType = 'live';
        $scope.form.member = 0; //会员定向默认全部
        $scope.form.areas = [];
        $scope.form.area_type = 1;
        $scope.stream_list = [];
        $scope.aid_list = [];
        $scope.vid_list = [];
        $scope.isViewAdForm = false;
        $scope.mutiselectopt = {
            selectAll: "选择所有",
            selectNone: "取消选择",
            reset: "重置所有",
            search: "搜索",
            nothingSelected: "未选择"
        }

        //加载平台
        apiService.getPlatforms().then(function(platforms) {
            $scope.platform_list = platforms;
            if (!$scope.form.platform) {
                $scope.onPlatformChanged();
            }
        }).catch(function(err) {
            toaster.pop('error', '错误', '获取平台信息失败:' + err.message);
        });

        //获取订单信息
        orderService.getOrderById($scope.form.id).then(function(order) {

            //默认地域定向类型
            if (!order.area_type) {
                order.area_type = 1;
            }

            //默认会员-全部
            if (!order.member) {
                order.member = 0;
            }


            //这个地方，先走area-select指令的out，再走这里，所以，在area-select指令里，out为undefined
            //在area.select.directives.js中指令定义的地方，out使用 '=' ，将数据单向输出到这里的controller的 form.areas 对象
            //如果在area.select.directives.js中out使用 '@' ，则相当于双向绑定数据。
            $scope.form = order;

            delete $scope.form.targets;

            //设置地域定向
            if (typeof $scope.form.areas == 'string') {
                try {
                    $scope.form.areas = JSON.parse($scope.form.areas);
                } catch (err) {
                    $scope.form.areas = [];
                }
            }

            $scope.onPlatformChanged();
            for (var i in $scope.form.streams) {
                $scope.stream_list.push({
                    id: $scope.form.streams[i],
                    name: $scope.form.streams[i],
                    ticked: true
                });
            }
            for (var i in $scope.form.albums) {
                $scope.aid_list.push({
                    id: $scope.form.albums[i],
                    name: $scope.form.albums[i],
                    ticked: true
                });
            }
            for (var i in $scope.form.videos) {
                // video 结构改为 {id:xxx,parent_id:xxx}
                $scope.vid_list.push({
                    id: $scope.form.videos[i].id,
                    name: $scope.form.videos[i].id,
                    ticked: true
                });
            }


            OrderService.getVideoAlbums($scope, $http);
        }).catch(function(err) {
            toaster.pop('error', '提示', '获取订单信息失败,错误信息:' + err.message);
        });

        // 加载直播流
        //TODO 这个地方看一下,默认情况下,不允许一个订单从点播改为直播嘛?
        if (!$scope.form.id && (!$scope.stream_list || $scope.stream_list.length == 0)) {
            apiService.getStreams().then(function(streams) {
                $scope.stream_list = angular.copy(streams);
            }).catch(function(err) {
                $scope.stream_list = [];
                toaster.pop('error', '错误', '加载直播流出错,错误信息:' + err.message);
            });

        } else {
            $scope.stream_list = [];
        }
        $scope.onPlatformChanged = function() {
            if (!$scope.form.platform) return;
            apiService.getAdsByPlatform($scope.form.platform).then(function(ads) {
                $scope.ad_list = ads;
                if (Array.isArray($scope.ad_list)) {
                    for (var ai = 0; ai < $scope.ad_list.length; ai++) {
                        if ($scope.ad_list[ai].id == $scope.form.ad_id) {
                            $scope.ad_list[ai].ticked = true;
                        }
                    }
                }
            }).catch(function(err) {
                toaster.pop('error', '错误', '根据平台' + $scope.form.platform + '加载广告失败,错误信息:' + err);
            });

        };
        OrderService.initMultiSelect($scope, $http);
        $scope.save = function() {
            if ($scope.forma.$invalid) {
                toaster.pop('error', '提示', '请根据提示修改您填写的表单数据!');
                return;
            }
            if (Array.isArray($scope.form.ad_selected) && $scope.form.ad_selected.length > 0) {
                $scope.form.ad_id = [];
                $scope.form.ad_selected.forEach(function(ad) {
                    $scope.form.ad_id.push(ad.id);
                });
                //delete $scope.form.ad_selected;
            } else {
                return toaster.pop('error', '提示', '请选择广告!');
            }
            if ($scope.form.targetType == 'live') {
                if (!$scope.form.streams || $scope.form.streams.length == 0) {
                    toaster.pop('error', '提示', '请至少选择一个直播定向条件');
                    return;
                }
            } else if ($scope.form.targetType == 'vod') {
                $scope.form.videos = [];
                $scope.form.albums = [];
                if ($scope.vid_list && $scope.vid_list.length > 0) {
                    $scope.vid_list.forEach(function(vid) {
                        $scope.form.videos.push(vid);
                    });
                }
                if ($scope.aid_list && $scope.aid_list.length > 0) {
                    $scope.aid_list.forEach(function(aid) {
                        $scope.form.albums.push(aid);
                    });
                }
                OrderService.getVideoAlbums($scope);
                if ((!$scope.form.videos || $scope.form.videos.length == 0) && (!$scope.form.albums ||
                        $scope.form.albums.length == 0)) {
                    toaster.pop('error', '提示', '请至少选择一个点播定向条件');
                    return;
                }
            }
            if ($("#ad_select").val() == '?') {
                toaster.pop('error', '提示', '请选择一条广告进行投放');
                return;
            }
            orderService.saveOrder($scope.form).then(function(result) {
                toaster.pop('success', '成功', '修改成功');
                $state.go('app.order.list');
            }).catch(function(err) {
                toaster.pop('error', '错误', '修改失败:' + err);
            });

        };

        $scope.lastTime = $scope.form.startTime;

        //TODO 这个地方比较时间是做什么的?回头问问
        $scope.timeChanged = function() {
            if ($scope.lastTime.getDate() != $scope.form.startTime.getDate()) {

            }
            $scope.lastTime = $scope.form.startTime;
        };

        $scope.$watch('form.startTime', function(newVal, oldVal) {
            if (newVal) {
                if (newVal <= new Date().Format("yyyy-MM-dd hh:mm") && $scope.form.targetType == 'live') {
                    $scope.startTimeInValid = true;
                } else {
                    $scope.startTimeInValid = false;
                }
            }
        });

        /*
         $scope.refreshStream = function(key){
         if (!key || key.length < 2) return;
         $http({method: 'GET', url: '/api/get_streams/'+key}).success(function (data, status, headers, config) {
         if (data.header && data.header.code == 0) {
         $scope.stream_list = data.body;
         } else {
         alert('error');
         $rootScope.stream_list = [];
         }
         }).error(function (data, status, headers, config) {
         alert('error');
         $rootScope.stream_list = [];
         });
         };*/

        //新建广告/预览
        $scope.open = function(size, adid) {
            try {
                var formObj = angular.fromJson($scope.form);
            } catch (e) {
                return;
            }
            if (parseInt(adid)) {
                $scope.isViewAdForm = true;
            } else {
                $scope.isViewAdForm = false;
            }
            var modalInstance = $modal.open({
                templateUrl: 'order_adform.html',
                controller: 'ViewAdInstanceCtrl',
                size: size,
                resolve: {
                    formObj: function() {
                        var formObj = angular.fromJson($scope.form);
                        formObj.isViewAdForm = $scope.isViewAdForm;
                        return formObj;
                    }
                }
            });

            modalInstance.opened.then(function() {});
            modalInstance.result.then(function(selectedItem) {
                if (selectedItem)
                    $scope.ad_list.unshift(selectedItem);
            }, function() {});
        };


    }
]);


app.controller('OrderCreateCtrl', ['$scope', '$http', 'toaster', '$state', '$modal', '$log', '$rootScope', 'appTools',
    'OrderService', 'apiService', 'orderService', 'areaService',
    function($scope, $http, toaster, $state, $modal, $log, $rootScope, appTools, OrderService, apiService,
        orderService, areaService) {
        $scope.form = $scope.form || {};
        $scope.form.duration = 15;
        $scope.form.offset = 0;
        $scope.form.member = 0; //会员定向默认全部
        $scope.form.areas = [];
        $scope.form.area_type = 1;
        $scope.form.startTime = new Date(new Date().getTime() + 5 * 1000).Format("yyyy-MM-dd hh:mm:ss");
        //结束时间默认增加10分钟
        $scope.form.endTime = new Date(new Date().getTime() + 5 * 1000 + 10 * 60 * 1000).Format(
            "yyyy-MM-dd hh:mm:ss");

        apiService.getPlatforms().then(function(platforms) {
            $scope.platform_list = platforms;
            $scope.form.platform = $scope.platform_list[0].id;
            $scope.onPlatformChanged();
        }).catch(function(err) {
            toaster.pop('error', '错误', '加载平台信息出错,出错信息:' + err);
        });

        $scope.mutiselectopt = {
            selectAll: '选择所有',
            selectNone: '取消所有',
            reset: '重置',
            search: '直接拷贝pid或vid进行搜索，如使用name进行搜索，则速度会慢于id搜索，请耐心等待',
            nothingSelected: '未选中任何'
        }

        // 加载直播流
        if (!$scope.stream_list || $scope.stream_list.length == 0) {
            apiService.getStreams().then(function(streams) {
                $scope.stream_list = streams;
            }).catch(function(err) {
                toaster.pop('error', '错误', '加载直播流出错' + err.message);
            });

        }

        // //加载地域信息
        // areaService.getAreas().then(function(areas) {
        //     areas = areas.map(function(item) {
        //         if (typeof item.available == 'object') {
        //             item.available = item.available.data[0];
        //         }
        //         return item;
        //     });
        //     $scope.area = {};
        //     $scope.area.all = areas;
            
        // }).catch(function(err) {
        //     console.log(err);
        // });

        
        //将直播流id转换为直播流name
        $scope.getStreamNamesById = function() {
            if (!$scope.form.stream_id) {
                return toaster.pop('error', '错误', '视频直播流id不能为空');
            }
            $scope.form.streams = [];
            apiService.getStreamNamesById($scope.form.stream_id).then(function(result) {
                if (Array.isArray(result)) {
                    var rs = '';
                    result.forEach(function(item) {
                        $scope.form.streams.push(item.name);
                        rs = rs + item.name + '<br>'
                    });
                    toaster.pop('success', '成功', '<p>获取直播流名称成功：' + rs + '</p>');
                }
            }).catch(function(err) {
                console.log(err);
            });
        }

        OrderService.initMultiSelect($scope, $http);

        $scope.onPlatformChanged = function() {
            if (!$scope.form.platform) return;
            apiService.getAdsByPlatform($scope.form.platform).then(function(ads) {
                $scope.ad_list = ads;
                if ($scope.ad_list && $scope.ad_list[0])
                    $scope.form.ad_id = $scope.ad_list[0].id;
            }).catch(function(err) {
                toaster.pop('error', '错误', '加载广告出错:' + err.message);
            });

        };

        $scope.save = function() {
            if ($scope.forma.$invalid) {
                toaster.pop('error', '提示', '请根据提示修改您填写的表单数据!');
                return;
            }

            /*var hasZDX = false; //正定向
            var hasFDX = false; //反定向

            for (let area of $scope.form.areas) {
                if (area.orient_type == 0) {
                    hasFDX = true;
                } else if (area.orient_type == 1) {
                    hasZDX = true;
                }
            }

            if (hasFDX && !hasZDX) {
                return toaster.pop('warning', '提示', '反定向条件不能单独存在,请选择一个正定向条件');
            }*/

            //地域定向数据整理
            $scope.form.areas = $scope.form.areas.map(function(item) {
                return {
                    id: item.id,
                    name: item.name,
                    orient_type: item.orient_type,
                    parent_id: item.parent_id,
                    type: item.type,
                    country_id: item.country_id,
                    available: item.available
                }
            });

            if (Array.isArray($scope.form.ad_selected) && $scope.form.ad_selected.length > 0) {
                $scope.form.ad_id = [];
                $scope.form.ad_selected.forEach(function(ad) {
                    $scope.form.ad_id.push(ad.id);
                });
                // delete $scope.form.ad_selected;
            } else {
                return toaster.pop('error', '提示', '请选择广告!');
            }

            if ($scope.form.targetType == 'live') {
                if (!$scope.form.streams || $scope.form.streams.length == 0) {
                    toaster.pop('error', '提示', '请至少选择一个直播定向条件');
                    return;
                }
                //由于添加了 id转name这个功能，所以这里手动修改一下target_type的值
                if ($scope.form.target_type == 'id2name') {
                    $scope.form.target_type = 'live';
                }
            } else if ($scope.form.targetType == 'vod') {
                $scope.form.videos = [];
                $scope.form.albums = [];
                if ($scope.vid_list && $scope.vid_list.length > 0) {
                    $scope.vid_list.forEach(function(vid) {
                        $scope.form.videos.push(vid);
                    });
                }
                if ($scope.aid_list && $scope.aid_list.length > 0) {
                    $scope.aid_list.forEach(function(aid) {
                        $scope.form.albums.push(aid);
                    });
                }
                OrderService.getVideoAlbums($scope);
                if ((!$scope.form.videos || $scope.form.videos.length == 0) && (!$scope.form.albums ||
                        $scope.form.albums.length == 0)) {
                    toaster.pop('error', '提示', '请至少选择一个点播定向条件');
                    return;
                }
            }
            if ($("#ad_select").val() == '?') {
                toaster.pop('error', '提示', '请选择一条广告进行投放');
                return;
            }
            orderService.saveOrder($scope.form).then(function(result) {
                if (result) {
                    toaster.pop('success', '成功', '创建成功');
                    $state.go('app.order.list');
                }
            }).catch(function(err) {
                toaster.pop('error', '失败', '创建失败,错误信息:' + err.message);
            });

        };

        $scope.lastTime = $scope.form.startTime;

        $scope.timeChanged = function() {
            if ($scope.lastTime.getDate() != $scope.form.startTime.getDate()) {

            }
            $scope.lastTime = $scope.form.startTime;
        };
        $scope.$watch('form.startTime', function(newVal, oldVal) {
            if (newVal) {
                if (newVal <= new Date().Format("yyyy-MM-dd hh:mm:ss")) {
                    //$scope.form.startTime.$dirty = true;
                    $scope.startTimeInValid = true;
                } else {
                    $scope.startTimeInValid = false;
                }
            }
        });
        //新建广告/预览
        $scope.open = function(size, adid) {
            try {
                var formObj = angular.fromJson($scope.form);
            } catch (e) {
                return;
            }
            if (parseInt(adid)) {
                $scope.isViewAdForm = true;
            } else {
                $scope.isViewAdForm = false;
            }
            var modalInstance = $modal.open({
                templateUrl: 'order_adform.html',
                controller: 'ViewAdInstanceCtrl',
                size: size,
                resolve: {
                    formObj: function() {
                        var formObj = angular.fromJson($scope.form);
                        formObj.isViewAdForm = $scope.isViewAdForm;
                        return formObj;
                    }
                }
            });

            modalInstance.opened.then(function() {});

            modalInstance.result.then(function(selectedItem) {
                if (selectedItem && selectedItem.id) {
                    $scope.ad_list.push(selectedItem);
                    $scope.form.ad_id = selectedItem.id;
                }

            }, function() {});
        };

        $scope.changeStatus = function(id, status) {

        };
        $scope.removeItem = function(id) {

        };
    }
]);

/**
 * 弹出层
 */
app.controller('ViewAdInstanceCtrl', ['$http', '$scope', '$modal', '$log', 'toaster', '$modalInstance', '$state',
    'formObj', 'appTools', 'OrderService',
    function($http, $scope, $modal, $log, toaster, $modalInstance, $state, formObj, appTools, OrderService) {
        //获取平台列表
        $scope.form = $scope.form || {};
        $scope.form.id = formObj.ad_id;
        $scope.tracking = $scope.tracking || {};
        $scope.isViewAdForm = false;
        $http.get('/api/get_platforms').then(function(reply) {
            var data = reply.data;
            if (!appTools.checkResponse(data)) {
                return;
            } else {
                $scope.platform_list = data.body;
            }
            $scope.form.platform = formObj.platform;
            $scope.onPlatformChanged();
        });
        $scope.onPlatformChanged = function() {
            //加载模板类型
            $http.get('/api/get_creatives/' + $scope.form.platform).then(function(reply) {
                var data = reply.data;
                if (!appTools.checkResponse(data)) {
                    return;
                }
                $scope.createform_list = data.body;
                $scope.onCreativeChanged();
            });
        };
        $scope.onCreativeChanged = function() {
            for (var idx in $scope.createform_list) {
                var item = $scope.createform_list[idx];
                if ($scope.form.creative_id) {
                    if (item.id == $scope.form.creative_id) {
                        $scope.$broadcast('creativeFormChanged', item);
                        $scope.creativeFormContent = item.form;
                        $scope.showForms = true;
                        //                    $scope.formList = item.form;
                    }
                } else {
                    $scope.showForms = false;
                }

            }
        };
        //预览广告
        if (formObj.isViewAdForm) {
            $scope.isViewAdForm = true;
            $http.get('/api/get_ad/' + formObj.ad_id).then(function(reply) {
                var data = reply.data;
                if (!appTools.checkResponse(data)) {
                    return;
                }
                angular.copy(data.body[0], $scope.form);
                $scope.onCreativeChanged();
            }, function(err) {
                toaster.pop('error', '提示', '获取数据失败\n' + err);
            });

        } else {
            $scope.form = {};
        }

        $scope.close = function() {
            $modalInstance.close();
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
        OrderService.doOrderCreativeDisplay($scope, $modal, $modalInstance, $log, toaster, $http, $state,
            appTools, true);
    }
]);