/**
 * Created by leiyao on 16/4/8.
 */

app.directive('creativeForm', [function () {
    return {
        restrict: 'AE',
        replace: true,

        controller: ['$scope', '$window', '$attrs', 'appTools', '$http','voteService', function ($scope, $window, $attrs, appTools, $http,voteService) {
            $scope.formContent = $scope.formContent || {};

            var initCreativeFormData = function (event, item, fillData) {
                $scope.otherEvents = [];
                if (!$scope.formList || item) {
                    if (item) {
                        $scope.formList = angular.fromJson(item.form).widgetData;
                    }
                }
                if ($scope.formList) {
                    var hasAliGoods = false;
                    var hasVotes = false;
                    var hasLebuy = false;
                    $scope.formList.forEach(function (n) {
                        // 复选组,循环里面的元素,如果允许曝光\点击则push进去
                        if (n.type == 'CheckBoxList') {
                            n.values.forEach(function (cn, i) {
                                $scope.formContent[n.name] = $scope.formContent[n.name] || [];
                                if ($scope.formContent[n.name].length < n.values.length) {
                                    $scope.formContent[n.name].push({
                                        data: cn.checked,
                                        name: cn.name,
                                        title: cn.title
                                    });
                                }
                                if (cn.canExpose == true) {
                                    $scope.otherEvents.push({
                                        value: cn.name + '-impr',
                                        title: cn.title + ' 曝光'
                                    });
                                }
                                if (cn.canClick == true) {
                                    $scope.otherEvents.push({
                                        value: cn.name + '-click',
                                        title: cn.title + ' 点击'
                                    });
                                }
                            })
                        }
                        // 不是列表的,正常表单的曝光地址,要求所有列表类的都以List结尾
                        if (n.type.indexOf('List') < 0) {
                            if (n.canExpose == true) {
                                $scope.otherEvents.push({
                                    value: n.name + '-impr',
                                    title: n.title + ' 曝光'
                                });
                            }
                            if (n.canClick == true) {
                                $scope.otherEvents.push({
                                    value: n.name + '-click',
                                    title: n.title + ' 点击'
                                });
                            }
                        }
                        if (n.type == 'Ali_Goods_Select_Item') {
                            hasAliGoods = true;
                            $scope.otherEvents.push({
                                value: n.name + '-resp',
                                title: n.title + ' 购买'
                            });
                        }
                        if(n.type == 'VoteSelectItem'){
                            hasVotes = true;
                        }
                        if(n.type == 'Lebuy_Goods_Select_Item'){
                            hasLebuy = true;
                        }
                    });
                    if(hasVotes){
                        $scope.votes = {};
                        $scope.votes.selected = undefined;
                        voteService.getVoteList().then(function (response) {
                            $scope.votes = response.results;
                            //查看详情页面初始化已选择的投票
                            initVotes($scope.votes);
                        }).catch(function (err) {
                            console.log(err);
                        });
                        var initVotes = function (list) {
                            if(Array.isArray(list) && $scope.formContent.v_activityid){
                                list.forEach(function(vote){
                                    if(vote.v_activityid == $scope.formContent.v_activityid){
                                        vote.v_right_answer_des = [];
                                        var right_answer_ids = vote.v_right_answer.split(',');
                                        vote.v_options.forEach(function(v){
                                            if(right_answer_ids.indexOf(v.v_id) > -1){
                                                vote.v_right_answer_des.push(v.v_name);
                                            }
                                        });
                                        $scope.votes.selected = vote;
                                    }
                                });
                            }
                        }
                        $scope.$watch('votes.selected',function(newV,oldV){
                            if(newV){

                                //设置正确答案id到中文
                                newV.v_right_answer_des = [];
                                var right_answer_ids = newV.v_right_answer.split(',');
                                newV.v_options.forEach(function(v){
                                    if(right_answer_ids.indexOf(v.v_id) > -1){
                                        newV.v_right_answer_des.push(v.v_name);
                                        v.is_right_answer = 1;
                                    }
                                });
                                newV.v_right_answer_des = newV.v_right_answer_des.join(',');
                                //设置是否可以重复
                                if(newV.v_canRepeat == 1){
                                    newV.v_canRepeat_des = '是'
                                }else{
                                    newV.v_canRepeat_des = '否'
                                }

                                if(newV.v_isSingle == 1){
                                    newV.v_isSingle_des = '是';
                                }else{
                                    newV.v_isSingle_des = '否';
                                }

                                $scope.votes.selected = newV;
                            }
                        })
                    }
                    if(hasLebuy){
                        $scope.lebuy_goods = {};
                        $scope.lebuy_goods.selected = null;
                        $http.get('/lebuy?page=1&limit=100').then(function(results){
                            if(!appTools.checkResponse(results.data)){
                                return;

                            }
                            var list = results.data.body.results;
                            JSON.stringify(list,null,2);
                            initLebuyGoods(list);
                        }).catch(function(err){
                            console.log(err);
                        });
                        var initLebuyGoods = function(list){
                            $scope.lebuy_goods = list;
                            //如果是编辑//TODO
                            if($scope.formContent._id){
                                // $scope.lebuy_goods.forEach(function(n){
                                //     if(n.goods_id == $scope.formContent.goods_id){
                                //         $scope.lebuy_goods.selected = n;
                                //     }
                                // });
                                $http.get('/lebuy/' + $scope.formContent._id).then(function(results){
                                    if(!appTools.checkResponse(results.data)){
                                        return;
                                    }
                                    $scope.lebuy_goods.selected = results.data.body;
                                });
                            }
                        };
                        $scope.searchLeBuyGoods = function searchLeBuyGoods(searchkey) {
                            $http.get('/lebuy?page=1&limit=100&keyword='+searchkey).then(function(results){
                                if(!appTools.checkResponse(results.data)){
                                    return;
                                }
                                var list = results.data.body.results;
                                JSON.stringify(list,null,2);
                                initLebuyGoods(list);
                            }).catch(function(err){
                                console.log(err);
                            });
                        }
                    }
                    if (hasAliGoods) {
                        $scope.ali_data = {};
                        $scope.ali_data.selected = undefined;
                        $http.get('/goods?page=1&limit=100').then(function (res) {
                            if (!appTools.checkResponse(res.data)) {
                                return;
                            }
                            var g_list = res.data.body.results;
                            initAliGoods(g_list);
                        }, function (err) {
                            console.log(err);
                        });
                        var initAliGoods = function (list) {
                            //测试数据,下次要从api获取
                            $scope.ali_goods = list;
                            if ($scope.formContent.goods_id) {
                                $scope.ali_goods.forEach(function (n) {
                                    if (n.item_id == $scope.formContent.goods_id) {
                                        $scope.ali_data.selected = n;
                                        //目前只有图片可能更改,所以重置下图片数组
                                        $scope.ali_data.selected.pic_urls = [];
                                        $scope.formContent.goods_details.forEach(function(ali_pic){
                                            $scope.ali_data.selected.pic_urls.push(ali_pic.data);
                                        });
                                    }
                                });
                            }
                        };

                    }
                }
            };
            if ($attrs.allowChanged == "true") {
                $scope.otherEvents = [];
            } else {
                initCreativeFormData();
            }

            $scope.tracking = {};
            $scope.$watch('otherEvents', function (newVal, oldVal) {
                if (newVal != oldVal && newVal.length > 0) {
                    //$scope.tracking.otherEventsName = newVal[0].value;
                }
            });
            $scope.preview = function (url) {
                url && $window.open(url);
            };
            /**
             * 多输入框
             */
            app.controller('MultiTextboxCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
                $scope.boxCnt = 1;
                $parentScope = $scope.$parent;
                $scope.init = function (item) {
                    if ($scope.formContent[item.name] && $scope.formContent[item.name].length > 0) {
                        $scope.boxCnt = $scope.formContent[item.name].length;
                    } else {
                        if (typeof item == 'object') {
                            $scope.formContent[item.name] = [{data: '', title: item.title + "-1"}];
                        } else if (typeof item == 'string') {
                            $scope.formContent[item] = [{data: ''}];
                        }
                    }
                    for (var i = 0; i < $scope.boxCnt; i++) {
                        if (item.canExpose) {
                            $parentScope.otherEvents.push({
                                value: item.name + '-' + i + '-impr',
                                title: item.title + '-' + (i + 1) + ' 曝光'
                            });
                        }
                        if (item.canClick) {
                            $parentScope.otherEvents.push({
                                value: item.name + '-' + i + '-click',
                                title: item.title + '-' + (i + 1) + ' 点击'
                            });
                        }
                    }

                };
                $scope.addTextBox = function (item, obj) {
                    if (item.countLimit && $scope.boxCnt >= item.countLimit){
                        alert('该数据有条数限制,限制条数为:'+item.countLimit+'.\n去掉限制,请联系修改模板,去掉countLimit属性,或修改为0.');
                        return;
                    }
                    $scope.formContent[item.name].push({data: '', title: item.title + '-' + $scope.boxCnt});
                    $scope.boxCnt++;
                    if (item.canExpose) {
                        $parentScope.otherEvents.push({
                            value: item.name + '-' + ($scope.boxCnt - 1) + '-impr',
                            title: item.title + '-' + ($scope.boxCnt) + ' 曝光'
                        })
                    }
                    if (item.canClick) {
                        $parentScope.otherEvents.push({
                            value: item.name + '-' + ($scope.boxCnt - 1) + '-click',
                            title: item.title + '-' + ($scope.boxCnt) + ' 点击'
                        })
                    }

                };
                $scope.removeTextBox = function (item, obj, idx) {
                    $scope.formContent[item.name].splice(idx, 1);
                    $scope.boxCnt--;
                    for (var i = 0; i < $parentScope.otherEvents.length; i++) {
                        if (item.canExpose) {
                            if ($parentScope.otherEvents[i].value == item.name + '-' + $scope.boxCnt + '-impr') {
                                $parentScope.otherEvents.splice(i, 1);
                                --i;
                            }
                        }
                        if (item.canClick) {
                            if ($parentScope.otherEvents[i].value == item.name + '-' + $scope.boxCnt + '-click') {
                                $parentScope.otherEvents.splice(i, 1);
                                --i;
                            }
                        }
                    }
                };
            }]);

            /**
             * 多曝光
             */
            app.controller('MultiExposeCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
                $parentScope = $scope.$parent;
                $scope.addTextBox = function (name, obj) {
                    //$parentScope.otherEvents;
                    $scope.formTrackings[name].push({
                        url: ''
                    });
                };
                $scope.removeTextBox = function (name, obj, idx) {
                    $scope.formTrackings[name].splice(idx, 1);
                }
            }]);

            /**
             * 曝光form
             */
            app.controller('ImprFormCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
                //$parentScope = $scope.$parent.$parent;
                if ($scope.form && $scope.form.id) {
                    $http.get('/api/get_monitor/' + $scope.form.id).then(function (reply) {
                        var data = reply.data;
                        if (data && data.header.code == 0) {
                            $scope.formTrackings = $scope.formTrackings || {};
                            angular.copy(data.body, $scope.formTrackings);
                            //todo
                            for (var i = 0; i < $scope.formTrackings.impr.length; i++) {
                                var item = $scope.formTrackings.impr[i];
                                if (item.source == 1) {
                                    $scope.formTrackings.impr.splice(i, 1);
                                    i--;
                                }
                            }
                            /*for(var i = 0 ; i < $scope.formTrackings.events.length;i++){
                             var item = $scope.formTrackings.events[i];
                             if (item.source == 1 && item.url!=''){
                             $scope.formTrackings.events[i].splice(1,1);
                             }
                             }*/
                            if ($scope.formTrackings['impr'].length == 0) {
                                $scope.formTrackings['impr'] = [{url: ''}];
                            }
                            if ($scope.formTrackings['events'].length == 0) {
                                $scope.formTrackings['events'] = [{url: ''}];
                            }

                            $parentScope.tracking = $scope.formTrackings;

                        }
                    });
                } else {
                    $scope.formTrackings = {};
                    $scope.formTrackings['impr'] = [{url: ''}];
                    $scope.formTrackings['events'] = [{url: ''}];
                }
                $scope.$watch('formTrackings', function (newV, oldV) {
                    $scope.$emit('trackingChanged', newV);
                });
            }]);
            /**
             * 选择的创意模板发生变化的时候触发
             */
            $scope.$on('creativeFormChanged', function (event, item, fillData) {
                initCreativeFormData(event, item, fillData);
            });


            $scope.$watch('form.form', function (newV, oldV) {
                if (newV) {
                    $scope.formContent = angular.fromJson(newV);
                    //if (!$scope.form || !$scope.form.id){
                    //initCreativeFormData(null,$scope.formContent);
                    //}
                }
            });

            $scope.convertArr2Obj = function (name, values, texts) {
                var arr = [];
                values.forEach(function (n, i) {
                    arr.push({value: String(n), text: texts[i]});
                });
                return arr;
            };
            //$scope.showButtons = true;
        }],
        templateUrl: '/tpl/template/tmp_viewform.html',
        link: function (scope, element, attrs) {
            //隐藏原来模板上的button
            scope.showButtons = attrs.showButtons || false;
            scope.showTitle = attrs.showTitle || false;
            //允许重新选择数据
            scope.allowChanged = attrs.allowChanged || false;
            //scope.formList = attrs.formData;
            //scope.modelId = attrs.id || 0;
        }
    }
}]);
