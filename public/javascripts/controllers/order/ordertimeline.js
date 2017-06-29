'use strict';

/* Controllers */
// Form controller
function initMultiSelect($scope) {
    $scope.lastKw = '';
    $scope.fSearchChange = function (obj) {
        if (obj.keyword.length < 3) {
            return;
        }
        if (obj.keyword == $scope.lastKw) return;
        $scope.lastKw = obj.keyword;
        $http({
            method: 'GET',
            url: '/api/get_streams/' + obj.keyword
        }).success(function (data, status, headers, config) {
            if (data.header && data.header.code == 0) {
                //setTimeout(function () {
                $scope.stream_list = data.body;
                //}, 100);


            } else {
                $rootScope.stream_list = [];
            }
        }).error(function (data, status, headers, config) {
            $rootScope.stream_list = [];
        });
    };
    $scope.fClose = function () {
        $scope.form.streams = [];
        for (var i in this.stream_output) {
            $scope.form.streams.push(this.stream_list[i].id);
        }
    };
}

app.controller('OrderTimeLineCtrl', ['$scope', '$http', 'toaster', '$state', '$modal', '$log', '$rootScope', function ($scope, $http, toaster, $state, $modal, $log, $rootScope) {
    $scope.form = $scope.form || {};
    //加载平台
    $http.get('/api/get_platforms').then(function (reply) {
        var data = reply.data;
        if (data.header && data.header.code == 0) {
            $scope.platform_list = data.body;
            $scope.form.platform = $scope.platform_list[0].id;
            $scope.onPlatformChanged();
        }
    }, function (err) {

    });

    // 加载直播流
    if (!$scope.stream_list || $scope.stream_list.length == 0) {
        $http({method: 'GET', url: '/api/get_streams?limit=15'}).success(function (data, status, headers, config) {
            if (data.header && data.header.code == 0) {
                $scope.stream_list = data.body;
            } else {
                alert('error');
                $scope.stream_list = [];
            }
        }).error(function (data, status, headers, config) {
            alert('error');
            $scope.stream_list = [];
        });
    }
    initMultiSelect($scope);
    //加载广告
    $scope.onPlatformChanged = function () {
        $http.get('/api/get_ads/' + $scope.form.platform).success(function (data, status, headers, config) {
            if (data.header && data.header.code == 0) {
                $scope.ad_list = data.body;
                $scope.form.ad_id = $scope.ad_list[0].id;
            }
        }).error(function (err) {

        });
    };

    //加载广告列表
    $http.get('/api/get_orders').success(function (data) {
        console.log(data);
        var largeLoad = data.body;
        data = largeLoad.filter(function (item) {
            return (item.id + "").indexOf(ft) != -1 || item.name.toLowerCase().indexOf(ft) != -1;
            // return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
        });

    });

}]);