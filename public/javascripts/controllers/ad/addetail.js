'use strict';

app.service('AdService', ['$modal', '$log', 'toaster', '$http', '$state', 'appTools', function ($modal, $log, toaster, $http, $state, appTools) {
    this.doAdDisplay = function ($scope) {
        var me = this;
        // 不知道放着行不行?
        $scope.$on('trackingChanged', function (evt, value) {
            $scope.tracking = value;
        });
        // 保存
        $scope.save = function () {
            if (!$scope.creativeFormContent) {
                toaster.pop('error', '提示', '请选择模板类型');
                return;
            }
            me.resolveCreativeForm($scope);
            me.resolveTrackingForm($scope);
            console.log($scope.form.form);
            $http.post('/api/save_ads', {form: $scope.form, trackings: $scope.tracking}).then(function (reply) {
                var data = reply.data;
                if (!appTools.checkResponse(data)) {
                    return;
                }
                toaster.pop('success', '提示', '创建成功');
                $state.go('app.ad.list');
            }, function (err) {
                console.log(err);
                toaster.pop('error', '提示', '获取数据失败\n' + err);
            });
        };

    };

    this.resolveTrackingForm = function ($scope) {
        var events = $scope.tracking.events;
        if (events && events.length > 0) {
            events.forEach(function (n) {
                n.title = $('option[value$="' + n.component + '"]:selected:eq(0)').text();
            });
        }
        //$('option[value$="buycart-click"]:selected').text()
        //var trackings = [];
        //console.log($scope.tracking.events);
        //console.log($scope.tracking.impr);

        //$scope.tracking.EventTracking = trackings;
    };
    this.resolveCreativeForm = function ($scope) {
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
                        val = val.split(':').splice(1).join(':');
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
                    var ali_item_keys = ['goods_id', 'goods_title', 'goods_price_raw', 'goods_price_now', 'goods_trace_url', 'goods_details'];
                    ali_item_keys.forEach(function (n) {
                        var elem = $('#form_preview input[name="' + n + '"]');
                        // 有相同name的input值,数据归为数组
                        if (elem.length > 1) {
                            json[n] = [];
                            //挨个元素去遍历
                            for (var ii = 0; ii < elem.length; ii++) {
                                json[n].push({
                                    data: elem[ii].value,
                                    name: n + "-" + ii,
                                    title: '阿里商品-' + (ii+1)
                                });
                            }
                        } else {
                            json[n] = elem.val();
                        }
                    });
                    break;
                case 'VoteSelectItem' :
                    // var votes_item_keys = ['v_activityid','v_title'];
                    // votes_item_keys.forEach(key=>{
                    //     var vote_e = document.getElementById('vote.'+key);
                    //     json[key] = vote_e.value;
                    // });
                    var vote_json_value = document.getElementById('vote_json').value;
                    json = JSON.parse(vote_json_value);
                    break;
                case 'Lebuy_Goods_Select_Item':
                    var item_keys = ['goods_id','goods_details','goods_price_now','goods_price_raw','goods_details','product_id','_id','product_type','category_id','have_mmsid'];
                    item_keys.forEach(function(key){
                        var element = $('#form_preview input[name="'+key+'"]');
                        if(element.length > 1){
                            json[key] = [];
                            for(var i=0;i<element.length;i++){
                                json[key].push({
                                    data:element[i].value,
                                    name:key + '-' + i,
                                    title:'大屏商品 - ' + (i + 1)
                                });
                            }
                        }else{
                            json[key] = element.val();
                        }
                    });

            }
        });
        $scope.form.form = angular.toJson(json);
    }
}]);
/* Controllers */
/**
 * 编辑\查看
 */
app.controller('DetailAdCtrl', ['$scope', '$modal', '$log', 'toaster', '$http', '$state', '$stateParams', 'appTools', 'AdService','apiService', function ($scope, $modal, $log, toaster, $http, $state, $stateParams, appTools, AdService,apiService) {
    $scope.form = {};
    $scope.form.id = $stateParams.id;
    $scope.createform = 1;

    apiService.getAd($scope.form.id).then(function (ad) {
        angular.copy(ad,$scope.form);
        $scope.onPlatformChanged();
    }).catch(function (err) {
        toaster.pop('error','提示','根据id'+$scope.form.id+'获取广告失败：'+err.message);
    });


    //获取平台列表
    apiService.getPlatforms().then(function (platform) {
        $scope.platform_list = platform;
    }).catch(function (err) {
        toaster.pop('error','错误','获取平台列表失败：'+err.message);
    });
    // $http.get('/api/get_platforms').then(function (reply) {
    //     var data = reply.data;
    //     if (!appTools.checkResponse(data)) {
    //         return;
    //     } else {
    //         $scope.platform_list = data.body;
    //     }
    // });
    $scope.onPlatformChanged = function () {
        //加载模板类型
        $scope.form.platform = $scope.form.platform ? $scope.form.platform : '';
        $http.get('/api/get_creatives/' + $scope.form.platform).then(function (reply) {
            var data = reply.data;
            if (!appTools.checkResponse(data)) {
                return;
            }
            $scope.createform_list = data.body;
            $scope.onCreativeChanged();
        });
    };
    $scope.onCreativeChanged = function () {
        for (var idx in $scope.createform_list) {
            var item = $scope.createform_list[idx];
            if ($scope.form.creative_id) {
                if (item.id == $scope.form.creative_id) {
                    $scope.$emit('creativeFormChanged', item);
                    $scope.creativeFormContent = item.form;
                    $scope.showForms = true;
                }
            } else {
                $scope.showForms = false;
            }

        }
    };
    AdService.doAdDisplay($scope);
}]);
/**
 * 保存创意页面
 */
app.controller('CreateAdCtrl', ['$scope', '$modal', '$log', 'toaster', '$http', '$state', 'appTools', 'AdService', function ($scope, $modal, $log, toaster, $http, $state, appTools, AdService) {
    /*$scope.$on("$destroy", function() {
     alert(1);
     //清除配置,不然scroll会重复请求
     })*/
    $scope.form = $scope.form || {};
    $scope.tracking = $scope.tracking || {};
    $scope.createform = 1;
    // 加载平台
    $http.get('/api/get_platforms').then(function (reply) {
        var data = reply.data;
        if (!appTools.checkResponse(data)) {
            return;
        } else {
            $scope.platform_list = data.body;
        }
        $scope.form.platform = $scope.platform_list[0].id;
        $scope.onPlatformChanged();
    });
    $scope.onPlatformChanged = function () {
        //加载模板类型
        $http.get('/api/get_creatives/' + $scope.form.platform).then(function (reply) {
            var data = reply.data;
            if (!appTools.checkResponse(data)) {
                return;
            }
            $scope.createform_list = data.body;
            //$scope.form.creative_id = $scope.createform_list[0].id;
            $scope.onCreativeChanged();
        });
    };
    $scope.onCreativeChanged = function () {
        for (var idx in $scope.createform_list) {
            var item = $scope.createform_list[idx];
            if ($scope.form.creative_id) {
                if (item.id == $scope.form.creative_id) {
                    $scope.$emit('creativeFormChanged', item);
                    $scope.creativeFormContent = item.form;
                    $scope.showForms = true;
                    //$scope.formList = item.form;
                }
            } else {
                $scope.showForms = false;
            }

        }
    };

    AdService.doAdDisplay($scope);
}]);

