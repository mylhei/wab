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
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};


app.service('OrderService', ['$http', 'appTools',
    function($http, appTools) {
        // Form controller
        this.initMultiSelect = function($scope, $http) {
            var apiList = {
                'stream': {
                    api: '/api/get_streams/',
                    key: 'stream_list'
                },
                'album': {
                    api: '/api/get_albums/',
                    key: 'aid_list'
                },
                'video': {
                    api: '/api/get_videos/',
                    key: 'vid_list'
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
                    $scope.form.videos = this.vid_output;
                    console.log($scope.form);
                } else if (type == 'album') {
                    $scope.form.albums = [];
                    for (var i in this.aid_output) {
                        $scope.form.albums.push(this.aid_output[i].id);
                    }
                }
            };
        };

        this.doOrderCreativeDisplay = function($scope, $modal, $modalInstance, $log, toaster, $http, $state, appTools, isViewAdForm) {
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
                        ali_item_keys.forEach(function(n) {
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

        this.getVideoAlbums = function($scope) {
            var vids = $scope.form.videos.map(function (item) {
                return item.id;
            });
            $http.get('/api/get_video_album_batch?aids=' + $scope.form.albums.join(',') + '&vids=' + vids.join(',')).success(function(data, status, headers, config) {
                if (!appTools.checkResponse(data)) {
                    return;
                }
                $scope.aid_list.forEach(function(item) {
                    if (data.body.album[String(item.id)]) {
                        item.name = data.body.album[String(item.id)];
                    }
                });

                $scope.vid_list.forEach(function(item) {
                    if (data.body.video[String(item.id)]) {
                        item.name = data.body.video[String(item.id)];
                    }
                });
            }).error(function(err) {

            });
        };
        return this;
    }
]);

app.controller('OrderVisualDetailCtrl', ['$scope', '$http', 'toaster', '$state', '$modal', '$log', '$rootScope', '$stateParams', 'appTools', 'OrderService','orderService','areaService',
    function($scope, $http, toaster, $state, $modal, $log, $rootScope, $stateParams, appTools, OrderService,orderService,areaService) {
        $scope.form = $scope.form || {};
        $scope.form.id = $stateParams.id;
        $scope.form.duration = 15;
        $scope.form.areas  = [];
        $scope.form.startTime = new Date(new Date().getTime() + 5 * 1000).Format("yyyy-MM-dd hh:mm");
        $scope.form.targetType = 'live';
        $scope.stream_list = [];
        $scope.aid_list = [];
        $scope.vid_list = [];
        $scope.isViewAdForm = false;

        //初始化视频播放器
        var initVideo = function (vid,pid) {
            console.log('初始化视频'+vid);
            var swfVersionStr = "11.1.0";
            var xiSwfUrlStr = "vendor/libs/playerProductInstall.swf";
            var flashvars = {
                "cid": "11",
                "vid": vid,
                "callbackJs": call,
                "showJumpAd": 0,
                "ark": 100,
                "typeFrom": "test",
                "pccsUrl": "pccs_mainv5_20160607.xml",
                "testAdData": "overlay_vpp.xml?",
                "showdock": "0"

            };

            var params = {
                "wmode": "Opaque"
            }; // window Opaque transparent
            params.quality = "high";
            params.bgcolor = "#000000";
            params.allowscriptaccess = "always";
            params.allowfullscreen = "true";
            var attributes = {
                id:'Player',
                name:'Player',
                align:'middle'
            };

            swfobject.embedSWF(
                "http://player.letvcdn.com/lc06_p/201705/08/18/34/LetvPlayer.swf?newlist=1&showdock=0", "flashContent",
                "970", "480",
                swfVersionStr, xiSwfUrlStr,
                flashvars, params, attributes);


            function call(type, obj) {
                switch (type) {
                    case "PLAYER_VIDEO_COMPLETE":
                        return {
                            "status": "playerContinue",
                            "vu": "cbb576bd5d",
                            "uu": "3a9d21720d"
                        };
                        if (obj["continuePlay"] == false) {
                            return {
                                "status": "recommend",
                                "nextvid": null
                            };
                        }
                        if (obj["hadNextData"] == false) {
                            return {
                                "status": "recommend",
                                "nextvid": null
                            };
                        }
                        break;
                    case "PLAYER_PLAY_NEXT":
                        return {
                            "status": "playerContinue"
                        };
                        break;
                    case "playerInit":
                        break;
                    case "PLAYER_VIDEO_PAUSE"://视频暂停事件
                        var  ae = angular.element(document.getElementById('forma'));
                        var scope = ae.scope();
                        var ofs = document.getElementById('Player').getVideoTime();
                        if(ofs){
                            scope.form.offset = ofs;
                        }
                        scope.$apply();
                        break;
                    case "videoStart":
                        try {
                            var player1 = document.getElementById("Player");
                            var settings1 = player1.getVideoSetting();
                            mask.init({
                                'id': 'Player',
                                'settings': settings1,
                                'buttonHeight': 40,
                                'clickfun': function (data) {
                                    var ae = angular.element(document.getElementById('forma'));
                                    var scope = ae.scope();
                                    scope.form.coordinate = {};
                                    scope.form.coordinate.x = data.leftPercentage;
                                    scope.form.coordinate.y = data.topPercentage;
                                    scope.$apply();
                                },
                                'maskClickfun': function () {
                                    var player = document.getElementById("Player");
                                    player.pauseVideo();
                                }
                            });
                        } catch (e) {
                            console.log(e);
                        }
                        var ae = angular.element(document.getElementById('forma'));
                        var scope  = ae.scope();
                        var offset = scope.form.offset;api
                        player1.seekTo(Number(offset));
                        player1.pauseVideo();
                        var xp = Number(scope.form.coordinate.x)/100;
                        var yp = Number(scope.form.coordinate.y)/100;
                        mask.creatDrag(xp,yp);
                        break;
                }
                return null;
            }

        }
        $scope.play = function () {
            var vid = $scope.form.videos && $scope.form.videos[0];
            if(!vid){
                return toaster.pop('error','提示','请选择一个视频进行播放');
            }
            var player = document.getElementById('Player');
            if(!player){
                initVideo(vid.id);


            }
            if(player && player.startUp){
                console.log('播放视频'+vid.id);
                // player.playNewId(vid.id);
                player.seekTo($scope.form.offset >>> 0);
            }

            //清除已打的点和数据
            var dragsaold= document.getElementById("dragsa");
            if(dragsaold){
                dragsaold.parentNode.removeChild(dragsaold);
            }
            //$scope.form.coordinate = {};
        }



        //加载平台
        $http.get('/api/get_platforms').then(function(reply) {
            var data = reply.data;
            if (!appTools.checkResponse(data)) {
                return;
            }
            $scope.platform_list = data.body;
            if (!$scope.form.platform) {
                //$scope.form.platform = $scope.platform_list[0].id;
                $scope.onPlatformChanged();
            }
        }, function(err) {
            toaster.pop('error','错误','加载平台信息失败,错误信息:'+err.message);
        });

        orderService.getOrderById($scope.form.id).then(function (order) {
            $scope.form = order;
            delete $scope.form.targets;

            //设置地域定向
            if(typeof $scope.form.areas == 'string'){
                try{
                    $scope.form.areas = JSON.parse($scope.form.areas);
                }catch(err){
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
                $scope.vid_list.push({
                    id: $scope.form.videos[i].id,
                    name: $scope.form.videos[i].id,
                    ticked: true
                });
            }
            if (!$scope.vid_list[0].id){
                toaster.pop('error', '提示', '参数错误,无定向的单集ID!');
                return;
            }
            $scope.play( $scope.vid_list[0].id);
            OrderService.getVideoAlbums($scope, $http);
            // initVideo($scope.form.videos[0].id);
        }).catch(function (err) {
            toaster.pop('error','提示','获取订单信息失败,错误信息:'+err.message);
        });

        // 加载直播流
        if (!$scope.form.id && (!$scope.stream_list || $scope.stream_list.length == 0)) {
            $http({
                method: 'GET',
                url: '/api/get_streams/?limit=10'
            }).success(function(data, status, headers, config) {
                if (data.header && data.header.code == 0) {
                    //setTimeout(function () {

                    $scope.stream_list = angular.copy(data.body);
                    //}, 100);


                } else {
                    alert('error');
                    $scope.stream_list = [];
                }
            }).error(function(data, status, headers, config) {
                alert('error');
                $scope.stream_list = [];
            });
        } else {
            $scope.stream_list = [];
        }
        $scope.onPlatformChanged = function() {
            if (!$scope.form.platform) return;
            $http.get('/api/get_ads/' + $scope.form.platform).success(function(data, status, headers, config) {
                if (!appTools.checkResponse(data)) {
                    return;
                }
                $scope.ad_list = data.body;
                if ($scope.ad_list && $scope.ad_list[0] && !$scope.form.ad_id) {
                    $scope.form.ad_id = $scope.ad_list[0].id;
                }
            }).error(function(err) {

            });
        };

        OrderService.initMultiSelect($scope, $http);
        $scope.save = function() {
            if ($scope.forma.$invalid) {
                toaster.pop('error', '提示', '请根据提示修改您填写的表单数据!');
                return;
            }
            if ($scope.form.targetType == 'live') {
                if (!$scope.form.streams || $scope.form.streams.length == 0) {
                    toaster.pop('error', '提示', '请至少选择一个直播定向条件');
                    return;
                }
            } else if ($scope.form.targetType == 'vod') {
                if ((!$scope.form.videos || $scope.form.videos.length == 0) && (!$scope.form.albums || $scope.form.albums.length == 0)) {
                    toaster.pop('error', '提示', '请至少选择一个点播定向条件');
                    return;
                }
            }
            if ($("#ad_select").val() == '?') {
                toaster.pop('error', '提示', '请选择一条广告进行投放');
                return;
            }
            orderService.saveOrder($scope.form).then(function (result) {
                toaster.pop('success','成功','保存成功');
                $state.go('app.order.list');
            }).catch(function (err) {
                toaster.pop('err','错误','保存失败:'+err.message);
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
                if (newVal <= new Date().Format("yyyy-MM-dd hh:mm") && $scope.form.targetType == 'live') {
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
                if (selectedItem)
                    $scope.ad_list.unshift(selectedItem);
            }, function() {});
        };


    }
]);

/**
 * 弹出层
 */
app.controller('ViewAdInstanceCtrl', ['$http', '$scope', '$modal', '$log', 'toaster', '$modalInstance', '$state', 'formObj', 'appTools', 'OrderService',
    function($http, $scope, $modal, $log, toaster, $modalInstance, $state, formObj, appTools, OrderService) {
        //获取平台列表
        $scope.form = $scope.form || {};
        $scope.form.id = formObj.ad_id;
        $scope.form.areas = [];
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
            if (!$scope.form.platform) return;
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
        OrderService.doOrderCreativeDisplay($scope, $modal, $modalInstance, $log, toaster, $http, $state, appTools, true);
    }
]);
