'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$localStorage', '$window', '$rootScope', '$http',
        function ($scope, $localStorage, $window, $rootScope, $http) {
            // add 'ie' classes to html
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

            $scope.showNavigatorCompatibility = false;
            var isFirefox = navigator.userAgent.toUpperCase().indexOf("Firefox") !== -1;
            var isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
            if (!isFirefox && !isChrome) {
                $scope.showNavigatorCompatibility = true;
            }
            $scope.closeNavigatorCompatibility = function(item){
                $scope.showNavigatorCompatibility = false;
            };


            if (typeof $window.curUser !== 'undefined' && $window.curUser) {
                $rootScope.user = $window.curUser;
            }

            // config
            $scope.app = {
                name: '边看边买操作平台',
                version: '1.3.3',
                // for chart colors
                color: {
                    primary: '#7266ba',
                    info: '#23b7e5',
                    success: '#27c24c',
                    warning: '#fad733',
                    danger: '#f05050',
                    light: '#e8eff0',
                    dark: '#3a3f51',
                    black: '#1c2b36'
                },
                settings: {
                    themeID: 1,
                    navbarHeaderColor: 'bg-black',
                    navbarCollapseColor: 'bg-white-only',
                    asideColor: 'bg-black',
                    headerFixed: true,
                    asideFixed: false,
                    asideFolded: false,
                    asideDock: false,
                    container: false
                }
            };

            // save settings to local storage
            if (angular.isDefined($localStorage.settings)) {
                $scope.app.settings = $localStorage.settings;
            } else {
                $localStorage.settings = $scope.app.settings;
            }
            $scope.$watch('app.settings', function () {
                if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                    // aside dock and fixed must set the header fixed.
                    $scope.app.settings.headerFixed = true;
                }
                // save to local storage
                $localStorage.settings = $scope.app.settings;
            }, true);

            function isSmartDevice($window) {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }

            $scope.logout = function () {
                $http.get('/users/logout').then(function (response) {
                    $rootScope.$emit("userIntercepted", "logout", response);
                }, function () {
                    $rootScope.$emit("userIntercepted", "logout", response);

                });
            };

        }]);