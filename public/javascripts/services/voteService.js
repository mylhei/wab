app.service('voteService',['$http','$q','appTools','conf',function ($http,$q,appTools,conf) {
    this.getVoteTemplateList = function(){
        return $q(function(resolve,reject){
            $http.get('/api/get_creatives').then(function success(response){
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return;
                }
                resolve(data.body);
            },function fail(err){
                reject(err);
            });
        });
    };

    //获取投票列表
    this.getVoteList = function(){
        return $q(function(resolve,reject){
            $http.get('/votes').then(function(response){
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return
                }
                resolve(data.body);
            });
        });
    }

    //根据活动id获取投票活动
    this.getVote = function(v_activityid){
        return $q(function(resolve,reject){
            $http.get('/votes/'+v_activityid).then(function(response){
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return
                }
                resolve(data.body);
            },function(err){
                reject(err);
            });
        });
    }

    //更新投拼活动信息，不包括投票选项
    this.updateVote = function updateVote(vote) {
        return $q(function(resolve,reject){
            if(!vote){
                return reject('参数错误，vote对象不能为空');
            }
            var v_activityid = vote.v_activityid;
            if(!v_activityid){
                return reject('活动的v_activityid不能为空');
            }
            $http.put('/votes/'+v_activityid,vote).then(function(response){
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return
                }
                resolve(data.body);
            },function (err) {
                reject(err);
            })
        });
    }

    this.add_option = function add_option(vote) {
        return $q(function (resolve,reject) {
            if(!vote){
                return reject('参数错误，vote对象不能为空');
            }
            
            var vote2send = {};
            angular.copy(vote,vote2send);
            vote2send.v_options = vote2send.v_options.filter(function (item) {
                return !item.v_id
            });
            $http.post('/votes/option',vote2send).then(function (response) {
                var data = response && response.data;
                if(!appTools.checkResponse(data)){
                    return
                }
                if(data){
                    if(data.body.error === 0){
                        resolve(data.body);
                    }else{
                        reject(data.body.msg);
                    }
                }else{
                    reject('服务器错误');
                }
            },function (err) {
                reject(err);
            });
        });
    }

    this.update_option = function save_option(option) {
        return $q(function (resolve,reject) {
            if(!option){
                return reject('参数错误，option不能为空');
            }
            $http.put('/votes/option/' + option.v_id,option).then(function (response) {
                var data  = response.data;
                if(!appTools.checkResponse(data)){
                    return
                }
                resolve(data.body);
            },function (err) {
                reject(err);
            });
        });
    }

    this.removeOption = function(v_id){
        return $q(function(resolve,reject){
            if(!v_id){
                return reject('参数错误，v_id不能为空');
            }
            $http.delete('/votes/option/'+v_id).then(function(response){
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return
                }
                resolve(data.body);
            },function(err){
                reject(err);
            })
        });
    }

}]);
