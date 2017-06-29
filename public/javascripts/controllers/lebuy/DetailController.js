'use strict';

app.controller('DetailController', ['$scope', '$http','$q', '$stateParams', '$state','toaster','FileUploader' ,'appTools','lebuyService', function($scope, $http,$q,
    $stateParams,$state, toaster,FileUploader, appTools,lebuyService) {
    $scope.detail = function(id) {
        if (!id) {
            id = $stateParams.id;
        }
        lebuyService.queryById(id).then(function (result) {
            $scope.goods = result;
        }).catch(function (err) {
            toaster.pop('error',err.err,err.message);
        });
    }
    $scope.cancel = function(){
        $state.go('app.lebuy.list');
    }
    /**
     * 上传图片，FileUpload插件配置
     * **/
    var uploader = $scope.uploader = new FileUploader({
        url: '/upload'
    });
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };

    /**
     * 上传文件配置结束
     * **/
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [25, 50, 100],
        pageSize: 25,
        currentPage: 1
    };

}]);
