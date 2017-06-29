'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state', '$rootScope', '$stateParams', function ($scope, $http, $state, $rootScope, $stateParams) {
    $scope.user = {};
    $scope.user.email = localStorage.username;
    $scope.authError = null;
    $scope.login = function () {
        $scope.authError = null;
        // Try to login
        $http.post('users/signin', {email: $scope.user.email, password: $scope.user.password})
            .then(function (response) {
                if (!response.data || response.data.id < 1) {
                    $scope.authError = '用户名或密码不正确';
                } else {
                    localStorage && (localStorage.username = $scope.user.email);
                    $rootScope.user = response.data;
                    $state.go('app.dashboard');
                    //appTools.socket_connect();
                }
            }, function (x) {
                $scope.authError = 'Server Error';
            });
    };
}])
;

app.controller('ChangePwdFormController', ['$scope', '$http', '$state', '$rootScope', '$stateParams', function ($scope, $http, $state, $rootScope, $stateParams) {
    $scope.changePassword = function () {
        var user = $scope.user;
        if (user.newPassword != user.repeatPassword) {
            alert('两次密码输入不一致');
            return;
        }
        if (!user.rawPassword) {
            alert('旧密码输入错误');
            return;
        }
        $http.post('users/changePassword', user).then(function (data) {
            var d = data.data;
            if (d.header.code == 0) {
                $scope.logout();
            } else {
                alert('修改失败\n' + d.body);
            }
        }, function (err) {
            alert('服务器错误');
        });
    }
}]);