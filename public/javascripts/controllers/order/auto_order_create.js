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
            $http.get('/api/get_video_album_batch?aids=' + $scope.form.albums.join(',') + '&vids=' + $scope.form.videos.join(',')).success(function(data, status, headers, config) {
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


app.controller('OrderAutoCreateCtrl', ['$scope', '$http', 'toaster', '$state', '$modal', '$log', '$rootScope', 'appTools', 'OrderService','adPositionService',
    function($scope, $http, toaster, $state, $modal, $log, $rootScope, appTools, OrderService,adPositionService) {
        $scope.i = 0;
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
                "http://player.letvcdn.com/lc05_p/201705/09/11/08/LetvPlayer.swf?newlist=1&showdock=0", "flashContent",
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
                        }
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
                            scope.form.offset = Math.round(ofs);
                        }
                        scope.$apply();
                        break;
                    case "videoStart":
                        var player1 = document.getElementById("Player");
                        var settings1 = player1.getVideoSetting();
                        var ae = angular.element(document.getElementById('forma'));
                        var scope  = ae.scope();
                        scope.video_time = settings1.duration || 900;
                        scope.showTimeLine = true;
                        scope.$apply();
                        mask.init({
                            'id': 'Player',
                            'settings': settings1,
                            'buttonHeight': 40,
                            'clickfun': function(data) {
                                var ae = angular.element(document.getElementById('forma'));
                                var scope  = ae.scope();
                                scope.form.coordinate = {};
                                scope.form.coordinate.x = data.leftPercentage;
                                scope.form.coordinate.y = data.topPercentage;
                                scope.$apply();
                            },
                            'maskClickfun': function() {
                                var player = document.getElementById("Player");
                                player.pauseVideo();
                            }
                        });
                        break;
                }
                return null;
            }
        }


        //监听已选择的广告位
        var adPositionWatch = $scope.$watch('selectedAdPosition',function(newValue,oldValue,scope){
            if(newValue){
                $scope.form.offset = (newValue.start_time / 1000).toFixed(2);
                $scope.form.duration = (newValue.duration_time_format).toFixed(2);
                if(newValue.common_pos_p){
                    $scope.form.coordinate.y = (newValue.common_pos_p.y * 100).toFixed(2);
                    $scope.form.coordinate.x = (newValue.common_pos_p.x * 100).toFixed(2);
                }else{
                    $scope.form.coordinate.y = (newValue.info_list[0].y * 100).toFixed(2);
                    $scope.form.coordinate.x = (newValue.info_list[0].x * 100).toFixed(2);
                }
            }
        });

        $scope.play = function () {
            var vid = $scope.form.videos && $scope.form.videos[0];
            if(!vid){
                return toaster.pop('error','提示','请选择一个视频进行播放');
            }
            //后台接口请求智能打点广告位信息
            var tag = $scope.tag;
            adPositionService.queryAdPositions(vid.id,tag).then(function(adps){
                $scope.ad_positions = adps;
                $scope.ad_positions.tags = adps && adps.tag_list.map(function(t){
                    return t.tag;
                });
            }).catch(function(err){
                $scope.ad_positions = null;
                console.log(err);
                toaster.pop('error','错误',error);
            });
            var player = document.getElementById('Player');
            if(!player){
                initVideo(vid.id);
            }
            if(player && player.startUp){
                console.log('播放视频'+vid.id);
                player.playNewId(vid.id);
            }

            //清除已打的点和数据
            var dragsaold= document.getElementById("dragsa");
            if(dragsaold){
                dragsaold.parentNode.removeChild(dragsaold);
            }
            $scope.form.coordinate = {};
        }

        $scope.form = $scope.form || {};
        $scope.form.duration = 15;
        $scope.form.offset = 0;
        $scope.form.startTime = new Date(new Date().getTime() + 5 * 1000).Format("yyyy-MM-dd hh:mm:ss");
        //结束时间默认增加10分钟
        $scope.form.endTime = new Date(new Date().getTime() + 5 * 1000 + 10 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss");
        $http.get('/api/get_platforms').then(function(reply) {
            var data = reply.data;
            if (!appTools.checkResponse(data)) {
                return;
            }
            $scope.platform_list = data.body;
            $scope.form.platform = $scope.platform_list[0].id;
            $scope.onPlatformChanged();
        }, function(err) {

        });

        //加载单集视频列表
        if (!$scope.vid_list || $scope.vid_list.length == 0) {
            $http({
                method: 'GET',
                url: '/api/get_videos?limit=15'
            }).success(function(data, status, headers, config) {
                if (data.header && data.header.code == 0) {
                    $scope.vid_list = data.body;
                } else {
                    alert('error');
                    $scope.vid_list = [];
                }
            }).error(function(data, status, headers, config) {
                alert('error');
                $scope.vid_list = [];
            });
        }
        OrderService.initMultiSelect($scope, $http);

        $scope.onPlatformChanged = function() {
            if (!$scope.form.platform) return;
            $http.get('/api/get_ads/' + $scope.form.platform).success(function(data, status, headers, config) {
                if (!appTools.checkResponse(data)) {
                    return;
                }
                $scope.ad_list = data.body;
                if ($scope.ad_list && $scope.ad_list[0])
                    $scope.form.ad_id = $scope.ad_list[0].id;
            }).error(function(err) {

            });
        };

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
                if($scope.form.orderType >>> 0 === 2){
                    //校验坐标
                    if(!$scope.form.coordinate.x || !$scope.form.coordinate.y){
                        toaster.pop('error','提示','请确认已打点，获取到打点坐标')
                        return
                    }
                    // $scope.form.coordinate = JSON.stringify($scope.form.coordinate);
                }

            }
            if ($("#ad_select").val() == '?') {
                toaster.pop('error', '提示', '请选择一条广告进行投放');
                return;
            }

            //将orderType设置为1
            $scope.form.orderType = 2;

            $http.post('/api/save_order', $scope.form).success(function(data, status, headers) {
                if (!appTools.checkResponse(data)) {
                    return;
                }
                toaster.pop('success', '提示', '创建成功!');
                $state.reload();
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
app.controller('ViewAdInstanceCtrl', ['$http', '$scope', '$modal', '$log', 'toaster', '$modalInstance', '$state', 'formObj', 'appTools', 'OrderService',
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
