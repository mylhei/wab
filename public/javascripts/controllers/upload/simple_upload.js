/**
 * Created by leiyao on 16/6/2.
 */

app.controller('FileUploadSimpleCtrl', ['$scope', 'FileUploader', '$http', 'appTools', 'toaster', function ($scope, FileUploader, $http, appTools, toaster) {
    var uploader = $scope.uploader = new FileUploader({
        url: '/upload'
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
        var item = addedFileItems[0];
        uploader.uploadAll();
    };
    uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        var ae = angular.element(document.querySelector($scope.curSelectInput.selector));
        if (response.header.code != 44 && !appTools.checkResponse(response)) {
            return;
        } else if (response.header.code == 44) {
            toaster.pop('success', '提示', '该文件已经存在,不需要再上传啦,CDN地址已经自动填入到表单中.<br/><img width="180" src="'+response.body.cdnUrl+'" />');
            $scope.curSelectInput.val(response.body.cdnUrl);
            ae.scope().formContent && (ae.scope().formContent[$scope.selector_name] = response.body.cdnUrl);
        }
        else {
            toaster.pop('success', '恭喜', '文件上传成功,CDN地址已经自动填入到表单中.<br/><img width="180" src="'+response.body.cdnUrl+'" />');
            $scope.curSelectInput.val(response.body.cdnUrl);
            ae.scope().formContent && (ae.scope().formContent[$scope.selector_name] = response.body.cdnUrl);
        }
        //$scope.curSelectInput.attr('tooltip',"<img src='"+response.body.cdnUrl+"' />");
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
    };

    $scope.select_file = function (data) {
        $scope.selector_name = data;
        $scope.curSelectInput = $("input[data-index='" + data + "']");
    };
    console.info('uploader', uploader);
}]);