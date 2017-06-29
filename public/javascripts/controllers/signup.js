'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.signup = function() {
      $scope.authError = null;
      // Try to create
        $http.post('users/signup', {
            email: $scope.user.email,
            password: $scope.user.password,
            permission: $scope.user.radioModel
        })
      .then(function(response) {
        if ( !response.data ) {
          $scope.authError = response;
        }else{
          $state.go('access.signin');
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
  }])
 ;