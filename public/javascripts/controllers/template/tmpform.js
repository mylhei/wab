'use strict';

/* Controllers */
// Form controller

/**
 * 弹出
 */
app.controller('ViewInstanceCtrl', ['$scope', '$modalInstance', 'formObj', function ($scope, $modalInstance, formObj) {
    $scope.title = formObj.creativeTemplateData.title;
    $scope.formList = formObj.widgetData;
    //
    //$scope.save = function () {
    //
    //};


    $scope.close = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

/**
 * 编辑\查看
 */
app.controller('ViewTmpCtrl',['$scope', '$modal', '$log', 'toaster', '$http', '$state', '$stateParams','appTools',function ($scope, $modal, $log, toaster, $http, $state,$stateParams,appTools) {
    $scope.form = {};
    $scope.form.id = $stateParams.id;
    $http.get('/api/get_creative/'+$scope.form.id).then(function(reply){
        var data = reply.data;
        if (!appTools.checkResponse(data)) {
            return;
        }
        angular.copy(data.body,$scope.form);
        /*$scope.title = $scope.form.name;
         $scope.formList = angular.toJson($scope.form.form).widgetData;
         */
        doCreativeDisplay($scope, $modal, $log, toaster, $http, $state,appTools)
    },function(err){
        toaster.pop('error', '提示', '获取数据失败\n'+err);
    });

    $http.get('/api/get_platforms').then(function (reply) {
        var data = reply.data;
        if (!appTools.checkResponse(data)) {
            $scope.platform_list = [{"id": 1, "name": "PC", "desc": ""}, {
                "id": 2,
                "name": "iPhone",
                "desc": ""
            }, {"id": 3, "name": "Android", "desc": ""}, {"id": 4, "name": "iPad", "desc": ""}, {
                "id": 5,
                "name": "TV",
                "desc": ""
            }];
        }else{
            $scope.platform_list = data.body;
        }

    });
}]);
/**
 * 保存创意页面
 */
app.controller('CreateTmpCtrl', ['$scope', '$modal', '$log', 'toaster', '$http', '$state','appTools', function ($scope, $modal, $log, toaster, $http, $state,appTools) {
    $scope.form = $scope.form || {};
    $scope.groups_dict = [{
        id:"1",
        name:"基线版团队"
    },{
        id:"2",
        name:"TV团队"
    },{
        id:"3",
        name:"投票组"
    }];
    $scope.form.groupId = "1";
    // 加载平台
    $http.get('/api/get_platforms').then(function (reply) {
        var data = reply.data;
        if (!appTools.checkResponse(data)) {
            return;
        }else{
            $scope.platform_list = data.body;
        }
        $scope.form.platform = $scope.platform_list[0].id;
    });

    var formData = {
        "creativeTemplateData": {"title": "通用焦点图创意模板"},
        "widgetData": [{
            "type": "StringTextItem",
            "name": "displayURL",
            "title": "小图地址",
            "description": "必填",
            "eg": "举例:http://xxx.baidu.com",
            "required": true
        }, {
            "type": "StringTextItem",
            "name": "background",
            "title": "大图地址",
            "description": "必填",
            "required": true,
            "pattern": "/^[0-9]*[1-9][0-9]*$/"
        }, {
            "type": "SelectItem",
            "name": "index",
            "title": "投放位置",
            "description": "第几帧",
            "required": true,
            values: [8, 9],
            texts: ["第九帧", "第十帧"]
        }
            , {"type": "StringTextItem", "name": "title", "title": "标题", "description": "非必填", "required": false}
            , {"type": "StringTextItem", "name": "time", "title": "副标题", "description": "非必填", "required": false}
            , {"type": "StringTextItem", "name": "desc", "title": "简介", "description": "非必填", "required": false}
            , {"type": "StringTextList", "name": "xxx", title: "图片列表", description: "多个请点击右侧加号", "required": true}
        ]
    };
    //test data
    //$scope.form.name = "PC端边看边买项目-普通模板";
    //$scope.form.description = "desc";
    //$scope.form.form = angular.toJson(formData);
    $scope.formIsJson = function () {
        // 测试输入内容是否为json
        try {
            var json = angular.fromJson($scope.form.form);
            if (angular.isObject(json)) {
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    };
    doCreativeDisplay($scope, $modal, $log, toaster, $http, $state,appTools);
}]);

function doCreativeDisplay($scope, $modal, $log, toaster, $http, $state,appTools){
    // 保存
    $scope.save = function () {
        try {
            var formObj = angular.fromJson($scope.form.form);
            if (!formObj.creativeTemplateData || !formObj.creativeTemplateData.title || !formObj.widgetData || formObj.widgetData.length == 0) {
                throw new Error('title 或 widgetData 为必填项');
            }
            //var  key = ['goods_id', 'goods_title','goods_price_raw','goods_price_now', 'goods_trace_url', 'goods_details'];
        } catch (e) {
            toaster.pop('error', '提示', '输入的动态表单格式不正确     ' + e.message);
            return;
        }
        $http.post('/api/save_creative', $scope.form).then(function (reply) {
            var data = reply.data;
            if (!appTools.checkResponse(data)) {
                return;
            }
            if (data.body.affectedRows > 0) {
                var data = reply.data;
                if (data && data.header.code == 0) {
                    toaster.pop('success', '提示', '创建成功');
                        $state.go('app.creative.list');
                }
            }
        }, function (err) {
            toaster.pop('error', '提示', '输入的动态表单格式不正确');
        });
    };

    $scope.open = function (size) {
        try {
            var formObj = angular.fromJson($scope.form.form);
            if (!formObj.creativeTemplateData || !formObj.creativeTemplateData.title || !formObj.widgetData || formObj.widgetData.length == 0) {
                throw new Error('title 或 widgetData 为必填项');
            }
        } catch (e) {

            toaster.pop('error', '提示', '输入的动态表单格式不正确     ' + e.message);
            return;
        }

        var modalInstance = $modal.open({
            template: '<div class="col-sm-10">'+
                    '<div class="panel panel-default">'+
                    '<div class="panel-body">' +
                    '<creative-form show-title="true" show-buttons="true"></creative-form>'+
                    '</div></div></div>',
            controller: 'ViewInstanceCtrl',
            size: size,
            resolve: {
                formObj: function () {
                    var formObj = angular.fromJson($scope.form.form);
                    return formObj;
                }
            }
        });

        modalInstance.opened.then(function () {
            $log.info('opend');
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            $log.info('确认预览');
        }, function () {
            $log.info('取消预览');
        });
    };
}
