'use strict';

/* Controllers */

Date.prototype.Format = function (fmt) { //author: meizz
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
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

app.service('OrderService',['$http','appTools','apiService',function($http,appTools,apiService){
    // Form controller
    this.initMultiSelect = function($scope, $http) {
        var apiList = {
            'stream':{
                api:'/api/get_streams/',
                key:'stream_list'
            },

            'album':{
                api:'/api/get_albums/',
                key:'aid_list'
            },
            'video':{
                api:'/api/get_videos/',
                key:'vid_list'
            }
        };
        $scope.lastKw = '';

        $scope.fSearchChange = function (obj,type) {
            if (obj.keyword.length < 3) {
                return;
            }
            if (obj.keyword == $scope.lastKw) return;
            $scope.lastKw = obj.keyword;

            var doRequest = function(keyName){
                if (!apiList[keyName])return;
                $http({
                    method: 'GET',
                    url: apiList[keyName].api + obj.keyword
                }).success(function (data, status, headers, config) {
                    if (data.header && data.header.code == 0) {
                        //setTimeout(function () {
                        $scope[apiList[keyName].key] = data.body;
                        //}, 100);


                    } else {
                        $scope[apiList[keyName].key] = [];
                    }
                }).error(function (data, status, headers, config) {
                    $scope[apiList[keyName].key] = [];
                });
            };
            doRequest(type)
        };
        $scope.fClose = function (type) {
            if (type == 'stream') {
                $scope.form.streams = [];
                for (var i in this.stream_output) {
                    $scope.form.streams.push(this.stream_output[i].name);
                }
            }else if (type == 'video'){
                $scope.form.videos = [];
                for(var i in this.vid_output){
                    $scope.form.videos.push(this.vid_output[i].id);
                }
            }else if (type == 'album'){
                $scope.form.albums = [];
                for(var i in this.aid_output){
                    $scope.form.albums.push(this.aid_output[i].id);
                }
            }
        };
    };

    this.doOrderCreativeDisplay = function($scope, $modal, $modalInstance, $log, toaster, $http, $state, appTools, isViewAdForm) {
        var me = this;
        // 不知道放着行不行?
        $scope.$on('trackingChanged', function (evt, value) {
            $scope.tracking = value;
        });
        // 保存
        $scope.savead = function () {
            me.resolveCreativeForm($scope);
            me.resolveTrackingForm($scope);

            //console.log($scope.form);
            //console.dir($scope.tracking.events);
            //console.dir($scope.tracking.impr);
            orderService.saveOrder().then(function (result) {
                toaster.pop('success','成功','创建成功');
                $modalInstance.close(result);
            }).catch(function (err) {
                toaster.pop('error','错误','失败');
            });
            // $http.post('/api/save_ads', {form: $scope.form, tracking: $scope.tracking}).then(function (reply) {
            //     var data = reply.data;
            //     if (!appTools.checkResponse(data)) {
            //         return;
            //     }
            //     toaster.pop('success', '提示', '创建成功');
            //     $modalInstance.close(data.body);
            // }, function (err) {
            //     console.log(err);
            //     toaster.pop('error', '提示', '获取数据失败\n' + err);
            // });

        };

    };
// the save func as addetail.js
    this.resolveTrackingForm = function($scope) {
        var events = $scope.tracking.events;
        if (events && events.length > 0) {
            events.forEach(function (n) {
                n.title = $('option[value$="' + n.component + '"]:selected:eq(0)').text();
            });
        }
    };
// the save func as addetail.js
    this.resolveCreativeForm = function($scope) {
        var template = angular.fromJson($scope.creativeFormContent).widgetData;
        var json = {};
        if (!template) return;
        template.forEach(function (item) {
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
                        item.values.forEach(function (n) {
                            json[item.name].push({
                                data: Boolean($('#form_preview input[name="' + n.name + '"]').prop('checked')),
                                name: n.name,
                                title: n.title
                            });
                        });
                    //} else {
                    //    json[item.name] = $scope.formContent[item.name];
                    //}
                    break;
                case 'Ali_Goods_Select_Item':
                    var ali_item_keys = ['ali_item_id', 'ali_item_prom_price', 'ali_item_trace_url', 'ali_item_pic_url'];
                    ali_item_keys.forEach(function (n) {
                        var elem = $('#form_preview input[name="' + n + '"]');
                        // 有相同name的input值,数据归为数组
                        if (elem.length > 1) {
                            json[n] = [];
                            //挨个元素去遍历
                            for (var ii = 0; ii < elem.length; ii++) {
                                json[n].push(elem[ii].value);
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

    this.getVideoAlbums = function($scope){
        var aids = $scope.form.albums;
        var vids = $scope.form.videos.map(function (item) {
            return item.id;
        });
        apiService.get_video_album_batch(aids,vids).then(function (result) {
            $scope.aid_list.forEach(function (item) {
                if(result.album[String(item.id)]){
                    item.name = result.album[String(item.id)];
                }
            });
            $scope.vid_list.forEach(function (item) {
                if(result.video[String(item.id)]){
                    item.name = result.video[String(item.id)];
                }
            });
        }).catch(function (err) {
            alert('错误：'+err.message);
        });

    };
    return this;
}]);
app.controller('OrderCopyCtrl', ['$scope', '$http', 'toaster', '$state', '$modal', '$log', '$rootScope', '$stateParams','appTools', 'OrderService','orderService','apiService',function ($scope, $http, toaster, $state, $modal, $log, $rootScope, $stateParams,appTools,OrderService,orderService,apiService) {
    $scope.form = $scope.form || {};
    $scope.form.id = $stateParams.id;
    $scope.form.duration = 15;
    $scope.form.startTime = new Date(new Date().getTime() + 5 * 1000).Format("yyyy-MM-dd hh:mm");
    $scope.form.targetType = 'live';
    $scope.stream_list = [];
    $scope.aid_list = [];
    $scope.vid_list = [];
    $scope.isViewAdForm = false;
    //加载平台
    apiService.getPlatforms().then(function (platforms) {
        $scope.platform_list = platforms;
        if(!$scope.form.platform){
            $scope.onPlatformChanged();
        }
    }).catch(function (err) {
        toaster.pop('error','错误','加载平台失败:'+err.message);
    });


    orderService.getOrderById($scope.form.id).then(function (order) {
        $scope.form = order;
        $scope.form.name += '-copy';
        $scope.form.isCopy = 1;
        $scope.form.copyFrom = order.id;
        delete $scope.form.id;
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
            $scope.stream_list.push({id: $scope.form.streams[i], name: $scope.form.streams[i], ticked: true});
        }
        for (var i in $scope.form.albums) {
            $scope.aid_list.push({id: $scope.form.albums[i], name: $scope.form.albums[i], ticked: true});
        }
        for (var i in $scope.form.videos) {
            //注意视频列表返回的结构
            $scope.vid_list.push({id: $scope.form.videos[i].id, name: $scope.form.videos[i].id, ticked: true});
        }

        OrderService.getVideoAlbums($scope,$http);
    }).catch(function (err) {
        toaster.pop('error','错误','根据id'+$scope.form.id+'查询订单失败：'+err.message);
    });

    // 加载直播流
    if (!$scope.form.id && (!$scope.stream_list || $scope.stream_list.length == 0)) {
        apiService.getStreams().then(function onSuccess(streams) {
            $scope.stream_list = angular.copy(streams);
        }).catch(function onError(err) {
            $scope.stream_list = [];
            toaster.pop('error','错误','加载直播流失败：'+err.message);
        });
    } else {
        $scope.stream_list = [];
    }
    $scope.onPlatformChanged = function () {
        apiService.getAdsByPlatform($scope.form.platform).then(function onSuccess(ads) {
            $scope.ad_list = ads;
            if ($scope.ad_list && $scope.ad_list[0] && !$scope.form.ad_id) {
                $scope.form.ad_id = $scope.ad_list[0].id;
            }
        }).catch(function onError(err) {
            toaster.pop('error','错误','根据平台加载广告失败：'+err.message);
        });

    };

    OrderService.initMultiSelect($scope, $http);
    $scope.save = function () {
        if ($scope.forma.$invalid){
            toaster.pop('error', '提示', '请根据提示修改您填写的表单数据!');
            return;
        }
        if ($scope.form.targetType == 'live') {
            if (!$scope.form.streams || $scope.form.streams.length == 0) {
                toaster.pop('error', '提示', '请至少选择一个直播定向条件');
                return;
            }
        }else if ($scope.form.targetType == 'vod'){
            if ((!$scope.form.videos || $scope.form.videos.length == 0) && (!$scope.form.albums || $scope.form.albums.length == 0)){
                toaster.pop('error', '提示', '请至少选择一个点播定向条件');
                return;
            }
        }
        if ($("#ad_select").val() == '?') {
            toaster.pop('error', '提示', '请选择一条广告进行投放');
            return;
        }

        //数据格式修正
        $scope.form.videos = $scope.form.videos && $scope.form.videos.map(function(item){
            if(typeof item == 'string' || typeof item == 'number'){
                return {
                    id:item
                };
            }else if(typeof item == 'object'){
                return item
            }
        });
        $scope.form.albums = $scope.form.albums && $scope.form.albums.map(function(item){
            if(typeof item == 'string'){
                return {
                    id:item
                };
            }else if(typeof item == 'object'){
                return item
            }
        });


        orderService.saveOrder($scope.form).then(function (result) {
            toaster.pop('success','成功','保存成功');
            $state.go('app.order.list');
        }).catch(function (err) {
            toaster.pop('error','错误','修改失败:'+err.message);
        });

    };

    $scope.lastTime = $scope.form.startTime;

    $scope.timeChanged = function () {
        if ($scope.lastTime.getDate() != $scope.form.startTime.getDate()) {

        }
        $scope.lastTime = $scope.form.startTime;
    };

    $scope.$watch('form.startTime',function(newVal,oldVal){
        if(newVal){
            if (newVal <= new Date().Format("yyyy-MM-dd hh:mm") && $scope.form.targetType == 'live') {
                $scope.startTimeInValid = true;
            }else{
                $scope.startTimeInValid = false;
            }
        }
    });

    //新建广告/预览
    $scope.open = function (size, adid) {
        try {
            var formObj = angular.fromJson($scope.form);
        } catch (e) {
            return;
        }
        if(parseInt(adid)) {
            $scope.isViewAdForm = true;
        }else{
            $scope.isViewAdForm = false;
        }
        var modalInstance = $modal.open({
            templateUrl: 'order_adform.html',
            controller: 'ViewAdInstanceCtrl',
            size: size,
            resolve: {
                formObj: function () {
                    var formObj = angular.fromJson($scope.form);
                    formObj.isViewAdForm = $scope.isViewAdForm;
                    return formObj;
                }
            }
        });

        modalInstance.opened.then(function () {
        });
        modalInstance.result.then(function (selectedItem) {
            if (selectedItem)
                $scope.ad_list.unshift(selectedItem);
        }, function () {
        });
    };


}]);


/**
 * 弹出层
 */
app.controller('ViewAdInstanceCtrl', ['$http', '$scope', '$modal', '$log', 'toaster', '$modalInstance', '$state', 'formObj','appTools','OrderService', function ($http, $scope, $modal, $log, toaster, $modalInstance, $state, formObj,appTools,OrderService) {
    //获取平台列表
    $scope.form = $scope.form || {};
    $scope.form.id = formObj.ad_id;
    $scope.tracking = $scope.tracking || {};
    $scope.isViewAdForm = false;
    apiService.getPlatforms().then(function (platforms) {
        $scope.platform_list = platforms;
        $scope.form.platform = formObj.platform;
        $scope.onPlatformChanged();
    }).catch(function (err) {
        toaster.pop('error','错误','获取平台列表出错：'+err.message);
    });

    $scope.onPlatformChanged = function () {
        //加载模板类型
        apiService.getCreatives($scope.form.platform).then(function (creatives) {
            $scope.createform_list = creatives;
            $scope.onCreativeChanged();
        }).catch(function (err) {
            toaster.pop('error','错误','获取模板出错：'+err.message);
        });

    };
    $scope.onCreativeChanged = function () {
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
    if(formObj.isViewAdForm){
        $scope.isViewAdForm = true;

        apiService.getAd(formObj.ad_id).then(function (ad) {
            angular.copy(order,$scope.form);
            $scope.onCreativeChanged();
        }).catch(function (err) {
            toaster.pop('error', '提示', '获取数据失败\n' + err);
        });

    }else{
        $scope.form = {};
    }

    $scope.close = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    OrderService.doOrderCreativeDisplay($scope, $modal, $modalInstance, $log, toaster, $http, $state, appTools, true);
}]);
