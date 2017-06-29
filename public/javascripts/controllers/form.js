'use strict';

/* Controllers */

  // Form controller
app.controller('FormDemoCtrl', ['$scope', function($scope) {
    $scope.notBlackListed = function(value) {
      var blacklist = ['bad@domain.com','verybad@domain.com'];
      return blacklist.indexOf(value) === -1;
    }

    $scope.val = 15;
    var updateModel = function(val){
      $scope.$apply(function(){
        $scope.val = val;
      });
    };
    angular.element("#slider").on('slideStop', function(data){
      updateModel(data.value);
    });

    $scope.select2Number = [
      {text:'First',  value:'One'},
      {text:'Second', value:'Two'},
      {text:'Third',  value:'Three'}
    ];

    $scope.list_of_string = ['tag1', 'tag2']
    $scope.select2Options = {
        'multiple': true,
        'simple_tags': true,
        'tags': ['tag1', 'tag2', 'tag3', 'tag4']  // Can be empty list.
    };

    angular.element("#LinkInput").bind('click', function (event) {
      event.stopPropagation();
    });

  }]);
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
//    $scope.items = items;
//    $scope.selected = {
//        item: $scope.items[0]
//    };

    $scope.ok = function () {
        $modalInstance.close();
//        console.log(3);
//        console.log($scope.selected.item);
    };

    $scope.cancel = function () {
//        console.log(4);
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('ModalDemoCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
//    $scope.items = ['item1', 'item2', 'item3'];
//    console.log($scope.items);
    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                   return [];
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            console.log(1);
            console.log($scope.selected);
        }, function () {
            $log.info('取消预览');
        });
    };
}]);