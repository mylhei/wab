'use strict';

app.controller('VoteCreateController', ['$scope', '$http','$q','$state', '$stateParams', '$modal','toaster','FileUploader' ,'appTools','voteService', function($scope, $http,$q,
    $state,$stateParams, $modal,toaster,FileUploader, appTools,voteService) {
    $scope.form = {
        v_options :[]
    };

    //打开模态框
    $scope.open_file_upload_modal = function () {
        $('#file_modal').modal('show');
    }

    //关闭模态框
    $scope.close_file_upload_modal = function () {

        var v_imgurl_element = document.getElementById('v_imgurl');
        var v_iconurl_element = document.getElementById('v_icon');
        var v_name_element = document.getElementById('v_name');
        var is_right_answer_element = document.getElementsByName('is_right_answer');
        var v_imgurl = v_imgurl_element && v_imgurl_element.value;
        var v_icon = v_iconurl_element && v_iconurl_element.value;
        var v_name = v_name_element && v_name_element.value;
        var is_right_answer = 0;

        for(var i=0;i<is_right_answer_element.length;i++){
            if(is_right_answer_element[i].checked){
                is_right_answer = is_right_answer_element[i].value;
            }
        }
        if(!v_name ){
            return toaster.pop('error','参数错误','投票选项名称不能为空');
        }

        //如果v_isSingle没有值，或已选择1，则要判断正确答案
        if(is_right_answer == 1){
            if($scope.form.v_isSingle == undefined || $scope.form.v_isSingle>>>0 == 1){
                var right_answer_filter = $scope.form.v_options.filter(function(item){
                    return item.is_right_answer==1
                });
                if(right_answer_filter.length > 0){
                    return toaster.pop('error','错误','单选投票，已有正确答案：【'+right_answer_filter[0].v_name+'】,请确认');
                }
            }
        }
        
        
        //隐藏模态框,并清空表单
        $('#file_modal').modal('hide');
        document.getElementById('modal_form').reset();
        var v_option = {
            v_name:v_name,
            v_icon:v_icon,
            v_imgurl:v_imgurl,
            is_right_answer:is_right_answer,
            v_count:0
        }
        
        $scope.form.v_options.push(v_option);


    }

    //删除投票选项
    $scope.remove_v_option = function($index){
        if($index >= 0 && $index < $scope.form.v_options.length){
            $scope.form.v_options.splice($index,1);
        }
    }


    //保存
    $scope.save = function(){
        //如果v_isSingle没有值，则说明用户没点选，直接选默认的 1
        if(!$scope.form.v_options || $scope.form.v_options.length <= 0){
            return toaster.pop('error','错误','投票选项不能为空');
        }
        if(!$scope.form.v_isSingle){
            $scope.form.v_isSingle = '1';
        }
        if(!$scope.form.v_canRepeat){
            $scope.form.v_canRepeat = '1';
        }
        if(!$scope.form.v_optimize){
            $scope.form.v_optimize = '0';
        }
        $http.post('/votes',$scope.form).then(function(response){
            console.log(response);
            var data = response.data;
            if (!appTools.checkResponse(data)) {
                return;
            }
            $state.go('app.vote.list');
        },function(error){
            console.log(error);
        });
    }


    // /**
    //  * 上传图片，FileUpload插件配置
    //  * **/

    // var uploader = $scope.uploader = new FileUploader({
    //     url: '/upload'
    // });
    // uploader.filters.push({
    //     name: 'customFilter',
    //     fn: function (item /*{File|FileLikeObject}*/, options) {
    //         return this.queue.length < 10;
    //     }
    // });
    // // CALLBACKS
    // uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
    //     console.info('onWhenAddingFileFailed', item, filter, options);
    // };

}]);
