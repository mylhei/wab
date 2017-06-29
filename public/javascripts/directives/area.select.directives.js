'use strict'

var ka_citys = [
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156110000,
        "name": "北京市",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210100,
        "name": "沈阳市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156210200,
        "name": "大连市",
        "parent_id": 1156210000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156310000,
        "name": "上海市",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156320100,
        "name": "南京市",
        "parent_id": 1156320000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156330100,
        "name": "杭州市",
        "parent_id": 1156330000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156370200,
        "name": "青岛市",
        "parent_id": 1156370000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156420100,
        "name": "武汉市",
        "parent_id": 1156420000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440100,
        "name": "广州市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156440300,
        "name": "深圳市",
        "parent_id": 1156440000,
        "type": 2
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156500000,
        "name": "重庆市",
        "parent_id": 1156000000,
        "type": 1
    },
    {
        "available": 1,
        "country_id": 1156000000,
        "id": 1156510100,
        "name": "成都市",
        "parent_id": 1156510000,
        "type": 2
    }
];


angular.module('app').directive('areaSelect', [function() {
    return {
        restrict: 'AE',
        templateUrl: 'tpl/areaSelect.html',
        replace: true,
        scope: {
            area_type: '@area_type',
            out: '='
        },
        controller: ['$scope', '$http', 'toaster', '$modal', 'areaService','appTools',function($scope, $http, toaster, $modal,areaService,appTools) {
            $scope.area = {};
            $scope.area_type = $scope.area_type || "1";
            // $scope.ka_citys = ka_citys;
            // $scope.out = $scope.out;
            // $scope.out = $scope.out || [];
            $scope.ka_citys = areaService.getKaCitys();
            if($scope.out){
                if(typeof $scope.out == 'string'){
                    $scope.out = JSON.parse($scope.out);
                }
            }else{
                $scope.out = [];
            }
            $scope.area.all = areaService.getAreas();
            
            $scope.area.countrys = $scope.area.all.filter(function(item) {
                return item.type == 0;
            });
            $scope.area.provinces = $scope.area.all.filter(function(item) {
                return item.type == 1;
            });
            $scope.area.citys = $scope.area.all.filter(function(item) {
                return item.type == 2;
            });
            // if ($scope.areas) {
            //     var areas = JSON.parse($scope.areas)
            //     $scope.area.countrys = areas.map(function(item) {
            //         return item.type == 0
            //     })
            // }

            $scope.addKa = function () {
                return toaster.pop('error', '错误', '本功能还未和引擎联调,暂时禁止使用');
                if ($scope.area_type == null) {
                    return toaster.pop('error', '错误', '请选择地域定向类型');
                }
                var contains = function (area) {
                    for(var i=0;i<$scope.out.length;i++){
                        if($scope.out[i].id == area.id){
                            return true;
                        }
                    }
                }
                var replaceArea = function (area) {
                    for(var i=0;i<$scope.out.length;i++){
                        if($scope.out[i].id == area.id){
                            $scope.out[i] = area;
                        }
                    }
                }
                $scope.area.select_ka_city.forEach(function (item) {
                    item.orient_type = $scope.area_type;
                    if(!contains(item)){
                        // $scope.out = $scope.out.concat($scope.area.select_city);
                        $scope.out.push(item);
                    }else{
                        replaceArea(item);
                        return toaster.pop('warning', '提示', '已添加该地域');
                    }
                });
            }

            $scope.checkAreaResult = function(){
                var zid = $scope.out.filter(function(item){
                    return item.orient_type == "1";
                }).map(function(item){
                    return item.id;
                });;
                var fid = $scope.out.filter(function(item){
                    return item.orient_type == "0";
                }).map(function(item){
                    return item.id;
                });
                $http.get('/api/get_areas_result?zid='+zid.join(',')+'&fid='+fid.join(',')).then(function(reply){
                    var data = reply.data;
                    if (!appTools.checkResponse(data)) {
                        return;
                    }
                    var html = '<h5>地域定向结果:</h5><ul style="max-height:500px;overflow-y: scroll;list-style:square">';
                    var result = [];
                    result = data.body.map(function(item){
                        return "<li>"+item.name+"("+item.id+")"+"</li>";
                    });
                    if(result.length == 0){
                        html+= '<li>无结果</li>';
                    }else{
                        html+= result.join('');
                    }
                    html += '</ul>';
                    toaster.pop('success','提示',html);
                }).catch(function(err){
                    toaster.pop('error','获取地域出错',err);

                });
            };

            $scope.addArea = function() {
                return toaster.pop('error', '错误', '本功能还未和引擎联调,暂时禁止使用');
                if ($scope.area_type == null) {
                    return toaster.pop('error', '错误', '请选择地域定向类型');
                }
                var toAddArea = null;

                var replaceArea = function (area) {
                    for(var i=0;i<$scope.out.length;i++){
                        if($scope.out[i].id == area.id){
                            $scope.out[i] = area;
                        }
                    }
                }

                //添加地域定向条件
                if ($scope.area.select_city.length > 0) {
                    $scope.area.select_city[0].orient_type = $scope.area_type;
                    toAddArea = $scope.area.select_city[0];
                } else if ($scope.area.select_province.length > 0) {
                    $scope.area.select_province[0].orient_type = $scope.area_type;
                    toAddArea = $scope.area.select_province[0];
                } else if ($scope.area.select_country) {
                    $scope.area.select_country[0].orient_type = $scope.area_type;
                    toAddArea = $scope.area.select_country[0];
                }

                for (var i = 0; i < $scope.out.length; i++) {
                    if ($scope.out[i] && $scope.out[i].id == toAddArea.id) {
                        replaceArea(toAddArea);
                        return toaster.pop('warning', '提示', '已添加该地域');
                    }
                }

                $scope.out.push(toAddArea);
            }

            $scope.toggleArea = function(index) {
                $scope.out[index].want2remove = !$scope.out[index].want2remove;
            }

            $scope.removeAreas = function(index) {
                $scope.out.splice(index, 1);
            }
            $scope.removeSelected = function() {
                $scope.out = $scope.out.filter(function(item) {
                    return !item.want2remove;
                });
            }

            $scope.selectAllArea = function(){
                $scope.out = $scope.out.map(function(item){
                    item.want2remove = true;
                    return item;
                });
            }
            $scope.showAreas = function() {
                console.log($scope.out);
            }

            // $scope.$watch('areas', function(newValue, oldValue) {
            //     if (newValue) {
            //         $scope.area.all = JSON.parse(newValue);

            //         $scope.area.countrys = $scope.area.all.filter(function(item) {
            //             return item.type == 0;
            //         });
            //         $scope.area.provinces = $scope.area.all.filter(function(item) {
            //             return item.type == 1;
            //         });
            //         $scope.area.citys = $scope.area.all.filter(function(item) {
            //             return item.type == 2;
            //         });
            //     }
            // });
            $scope.$watch('area.select_country', function(newVal, oldVal) {
                if (newVal && newVal.length > 0) {
                    angular.copy($scope.area.all.filter(function(item) {
                        return item.parent_id == newVal[0].id && item.parent_id != item.id;
                    }), $scope.area.provinces);
                }
            });
            $scope.$watch('area.select_province', function(newVal, oldVal) {
                if (newVal && newVal.length > 0) {
                    angular.copy($scope.area.all.filter(function(item) {
                        return item.parent_id == newVal[0].id && item.parent_id != item.id;
                    }), $scope.area.citys);
                }
            });


        }],
        link: function(scope, element, attrs, controller) {
            scope.attrs = attrs
        }
    }
}])