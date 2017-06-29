'use strict';

app.controller('VoteDetailController', ['$scope', '$http','$q','$state', '$stateParams', 'toaster','FileUploader' ,'appTools','voteService', function($scope, $http,$q,
    $state,$stateParams, toaster,FileUploader, appTools,voteService) {
    $scope.form = {
        v_options :[],
        v_right_answer:[]
    };

    $scope.getVote = function(){
        var v_activityid = $stateParams.v_activityid;
        voteService.getVote(v_activityid).then(function(data){
            $scope.form = data;
        }).catch(function(err){
            alert(err.message);
        });
    }

    $scope.save_activity = function(){
        var vote = $scope.form;
        var right_option = vote.v_options.filter(function(item){
            return item.is_right_answer >>> 0 != 0;
        });
        if(right_option.length){
            vote.v_right_answer = right_option.map(function(item){
                return item.v_id;
            }).join();
        }else{
            vote.v_right_answer  = null;
        }
        voteService.updateVote(vote).then(function (data) {
            if(data.error !==0 ){
                return toaster.pop('error','更新失败','error:'+data.error + ',msg:'+data.msg);
            }
            $state.go('app.vote.list');
        }).catch(function (err) {
            console.log('----------error-----------');
            console.log(err);
        });
    }

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

    $scope.edit_v_option = function($index){
        if($index >= 0 && $index < $scope.form.v_options.length){
            var v_option = $scope.form.v_options[$index];
            if(!v_option){
                return toaster.pop('error','异常','异常，选项下标不能为空，请刷新页面重试');
            }
            $scope.v_option = v_option;
            $('#file_modal').modal('show');
        }
    }

    var getOptionForm = function () {
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
        return {
            is_right_answer:is_right_answer,
            v_icon : v_icon,
            v_imgurl : v_imgurl,
            v_name : v_name,
            v_count:0
        }
    }

    //当模态框关闭时，清空$scope.v_option
    $('#file_modal').on('hidden.bs.modal', function (e) {
        $scope.v_option = null;
    })

    $scope.$watch('form.v_isSingle',function(newValue,oldValue,scope){
        //如果是单选
        var rc = 0;     //统计已有的正确答案的个数
        if(newValue >>> 0 === 1 ){
            $scope.form.v_options.forEach(function (option) {
                if(option.is_right_answer >>> 0){
                    rc ++;
                }
            });
            if(rc > 1){
                toaster.pop('error','提示','已有正确答案个数大于1，请修改正确答案后再确认是否单选');
                $scope.form.v_isSingle = '0';
            }
        }
    });

    $scope.unset_right_answer = function ($index) {
        $scope.form.v_options[$index].is_right_answer = 0;
    }

    $scope.set_right_answer = function set_right_answer($index) {
        if($index >= 0 && $index < $scope.form.v_options.length){
            var v_option = $scope.form.v_options[$index];
            if(!v_option){
                return toaster.pop('error','异常','异常，选项下标不能为空，请刷新页面重试');
            }
            //判断是否是单选
            if($scope.form.v_isSingle >>> 0 == 1){
                //单选,只能有一个正确答案
                //遍历所有选项，看是否已经选择正确答案，如果没有，赋值，如果有，提示更新
                for(let i=0;i<$scope.form.v_options.length;i++){
                    if($scope.form.v_options[i].is_right_answer == 1){
                        //已有正确答案，提示是否更新
                        if(confirm('只允许单选，已有正确答案【'+$scope.form.v_options[i].v_name+'】,是否将正确答案替换为【'+v_option.v_name+'】')){
                            //替换
                            v_option.is_right_answer = 1;
                            $scope.form.v_options[i].is_right_answer = 0;
                            toaster.pop('info','提示','单选，已设置正确答案【'+v_option.v_name+'】');
                        }
                        break;
                    }else if(i == $scope.form.v_options.length - 1){
                        //如果没有选择，直接赋值
                        v_option.is_right_answer = 1;
                    }

                }
            }else{
                //多选，可以有多个正确答案
                v_option.is_right_answer = 1;
            }
        }
    }

    //保存选项，更新或添加，根据是否有v_id去判断
    //如果是更新，直接将选项数据调用更新选项接口
    //如果是添加，将选项数据，以及投票活动信息拼装成完整对象，调用addVote接口
    $scope.save_v_option = function () {

        var optionForm = getOptionForm();
        var option2up = $scope.v_option;
        // option2up.is_right_answer = optionForm.is_right_answer;
        option2up.v_icon = optionForm.v_icon;
        option2up.v_imgurl = optionForm.v_imgurl;
        option2up.v_name = optionForm.v_name;

        //设置v_activity_id
        option2up.v_activityid = $scope.form.v_activityid;

        if(!optionForm.v_name && !optionForm.v_imgurl){
            return toaster.pop('error','错误','投票选项名称或投票选项图片至少有一项');
        }

        //更新
        if(option2up.v_id){
            voteService.update_option(option2up).then(function (response) {
                if(response.error == 0){
                    return toaster.pop('success','成功','修改成功');
                }else{
                    return toaster.pop('error','失败',JSON.stringify(response));
                }
            }).catch(function (err) {
                return toaster.pop('error','错误',err.message);
            });
        }
        //新添加
        else{
            $scope.form.v_options.push(optionForm);
            voteService.add_option($scope.form).then(function (data) {
                //添加成功后，将返回的v_id赋值给最后一个新添加的元素
                $scope.form.v_options[$scope.form.v_options.length - 1].v_id = data.data[0].v_id;
                toaster.pop('success','成功','添加成功');
            }).catch(function (err) {
                toaster.pop('error','错误',err);
            });
        }


        document.getElementById('modal_form').reset();
        $('#file_modal').modal('hide');
    }


    //保存
    $scope.save = function(){
        //如果v_isSingle没有值，则说明用户没点选，直接选默认的 1
        if(!$scope.form.v_isSingle){
            $scope.form.v_isSingle = 1;
        }
        if(!$scope.form.v_canRepeat){
            $scope.form.v_canRepeat = 1;
        }
        if(!$scope.form.v_optimize){
            $scope.form.v_optimize = 0;
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

    //删除投票选项
    $scope.remove = function($index){
        if($index >= 0 && $index < $scope.form.v_options.length){
            var v_option = $scope.form.v_options[$index];
            if(!v_option){
                return toaster.pop('error','异常','异常，选项下标不能为空，请刷新页面重试');
            }
            var v_id = v_option.v_id;
            //如果是正确答案，重置v_right_answer
            if(v_option.is_right_answer){
                var _index = $scope.form.v_right_answer.indexOf(v_option.v_id);
                $scope.form.v_right_answer.splice(_index,1);
            }
            if(confirm('确定要删除【'+v_option.v_name+'】？')){
                voteService.removeOption(v_option.v_id).then(function(result){
                    $scope.form.v_options.splice($index,1);
                    toaster.pop('success','success','删除成功');
                }).catch(function(err){
                    return toaster.pop('error','Error',err.message);
                });
            }
        }
    }

}]);
