// config

var app =  
angular.module('app')
  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide','$locationProvider',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide , $locationProvider) {
        
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;
        // $locationProvider.html5Mode(true);
    }
  ]).config(function($httpProvider){
    $httpProvider.interceptors.push('UserInterceptor');
});

//angular.injector(['angularjs-datetime-picker']);
