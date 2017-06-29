'use strict';
angular.module('app').directive('searchSelect', [function() {
    return {
        restrict: 'AE',
        templateUrl: 'tpl/searchSelect.html',
        replace: true,
        scope: {
            url: '@',
            placeholder: '@',
            outModel: '='
        },
        controller: ["$scope", "$http", 'toaster', '$modal', function($scope, $http, toaster, $modal) {
            $scope.removeFromSelected = function($index) {
                $scope.outModel.splice($index, 1);
            }
            $scope.openModal = function() {
                var url = $scope.url;
                var key = $scope.key;
                if (!key) {
                    return toaster.pop('into', '提示', '请输入关键词');
                }
                if (!url) {
                    throw new Error('属性url不能为空');
                }
                $http.get(url + key).then(function(response) {
                    var body = response && response.data && response.data.body;
                    $scope.items = body;
                    var modalInstance = $modal.open({
                        // templateUrl: 'searchSelectModal.html',
                        templateUrl: 'searchSelectModal',
                        controller: function($scope, $modalInstance, items) {
                            $scope.items = items;
                            $scope.toggleSelect = function(id) {
                                for(var i=0;i<$scope.items.length;i++){
                                    if($scope.items[i].id == id){
                                        $scope.items[i].ticked = !$scope.items[i].ticked;
                                    }
                                }
                                // $scope.items[$index].ticked = !$scope
                                //     .items[$index].ticked;
                            }
                            $scope.ok = function ok() {
                                var selected = $scope.items.filter(
                                    function(item) {
                                        if (item.ticked) {
                                            return item;
                                        }
                                    });
                                $modalInstance.close(selected);
                            }
                            $scope.cancel = function cancel() {
                                $modalInstance.dismiss('cancel');
                            }
                        },
                        size: 'lg',
                        resolve: {
                            items: function() {
                                return $scope.items
                            }
                        }
                    });

                    modalInstance.result.then(function(selectedItem) {
                        console.log(JSON.stringify(selectedItem));
                        var contains = function (array,item) {
                            for(var i=0;i<array.length;i++){
                                if(array[i].id == item.id){
                                    return true;
                                }
                            }
                            return false;
                        }
                        if ($scope.outModel && $scope.outModel.length > 0) {
                            selectedItem.forEach(function (item) {
                                if(!contains($scope.outModel,item)){
                                    $scope.outModel.push(item);
                                }
                            });
                        } else {
                            $scope.outModel = selectedItem;
                        }
                    }, function() {
                        console.log('Modal dismissed at: ' + new Date());
                    });

                }, function(err) {
                    return toaster.pop('error', '错误', '请求' + (url + key) + '失败');
                });

            }
        }],
        link: function(scope, element, attrs, controller) {
            scope.attrs = attrs;
        }
    };
}]);
