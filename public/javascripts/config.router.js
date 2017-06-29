/**
 * Config
 * for the router
 **/
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams', '$location',
            function($rootScope, $state, $stateParams, $location) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                var defaultRoutePage = {
                    "app.creative": "app.creative.list"
                };
                //用户状态变化
                $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                    if (toState.name.indexOf('access') >= 0) return; // 如果是进入登录界面则允许
                    console.log(toState.name);
                    // 如果用户不存在
                    if (!$rootScope.user || !$rootScope.user.id) {
                        event.preventDefault(); // 取消默认跳转行为
                        var data = {};
                        if (toState.name.indexOf('access') < 0) {
                            data = {
                                from: toState.name,
                                w: 'notLogin'
                            };
                        }
                        $state.go("access.signin", data); //跳转到登录界面
                    } else {
                        // if (toState.name == "app.dashboard"){
                        //     $state.go("app.order");
                        // }
                    }
                    if (defaultRoutePage[toState.name]) {
                        //$state.go(defaultRoutePage[toState.name]);
                        event.preventDefault();
                    }
                });

                $rootScope.$on('userIntercepted', function(errorType) {
                    $rootScope.user = null;
                    var data = {};
                    if ($state.current.name.indexOf('access') < 0) {
                        data = {
                            from: $state.current.name,
                            w: errorType
                        };
                    } else {
                        $state.go("access.signin", data);
                    }
                    location.reload();
                    // $state.go("access.signin", data);
                });

                $rootScope.userPermission = function(weight) {
                    if ($rootScope.user) {
                        if ($rootScope.user.permission == -1) {
                            return true;
                        }
                        if (($rootScope.user.permission & weight) == weight)
                            return true;
                    }
                    return false;
                }
            }
        ]
    )
    .config(
        ['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {

                $urlRouterProvider
                    .otherwise('/app/dashboard');
                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'tpl/app.html',
                        controller: ['socketTools', function(socket, $scope) {
                            //socket.connect();
                        }],
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster']);
                                }
                            ]
                        }
                    })
                    .state('app.dashboard', {
                        url: '/dashboard',
                        controller: ["$rootScope", "$state", function($rootScope, $state) {
                                if ($rootScope.user) {
                                    if ($rootScope.user.permission == -1 || ($rootScope.user.permission & 1) ==
                                        1) {
                                        $state.go('app.creative.list');
                                    } else if (($rootScope.user.permission & 2) == 2) {
                                        $state.go('app.order.list');
                                    }
                                } else {
                                    $state.go('access.signin');
                                }
                            }]
                            // templateUrl: 'tpl/app_dashboard_v1.html'
                    })
                    .state('access', {
                        url: '/access',
                        template: '<div ui-view class="fade-in-right-big smooth"></div>'
                    })
                    .state('access.signin', {
                        url: '/signin',
                        templateUrl: 'tpl/page_signin.html',
                        controller: 'SigninFormController',
                        resolve: {
                            deps: ['uiLoad',
                                function(uiLoad) {
                                    return uiLoad.load(['javascripts/controllers/signin.js']);
                                }
                            ]
                        }
                    })
                    .state('access.signup', {
                        url: '/signup',
                        templateUrl: 'tpl/page_signup.html',
                        controller: 'SignupFormController',
                        resolve: {
                            deps: ['uiLoad',
                                function(uiLoad) {
                                    return uiLoad.load(['javascripts/controllers/signup.js']);
                                }
                            ]
                        }
                    })
                    .state('access.changepwd', {
                        url: '/changepwd',
                        templateUrl: 'tpl/page_forgotpwd.html',
                        controller: 'ChangePwdFormController',
                        resolve: {
                            deps: ['uiLoad',
                                function(uiLoad) {
                                    return uiLoad.load(['javascripts/controllers/signin.js']);
                                }
                            ]
                        }
                    })
                    .state('access.signout', {
                        url: '/signout',
                        controller: 'signoutCtrl'
                    })
                    .state('access.404', {
                        url: '/404',
                        templateUrl: 'tpl/page_404.html'
                    })
                    //订单
                    .state('app.order', { //订单项
                        url: '/order',
                        template: '<div class="fade-in-right-big smooth"><ul style="margin-bottom: 0" class="breadcrumb bg-white b-a">' +
                            '<li><a href="/"><i class="fa fa-home"></i> Home</a></li>' +
                            '<li class="active"><a>订单管理</a></li>' +
                            '</ul></div><div class="" ui-view=""></div>',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['javascripts/services/area.service.js','javascripts/directives/area.select.directives.js']);
                                }
                            ]
                        }
                    })
                    .state('app.order.list', {
                        url: '/list',
                        controller: 'OrderListCtrl',
                        templateUrl: 'tpl/order/order_list.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load([
                                                'javascripts/controllers/order/orderlist.js',
                                                'javascripts/services/orderService.js'
                                            ]);
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.order.push', {
                        url: '/push',
                        templateUrl: 'tpl/order/order_push.html',
                        controller: 'PushOrderCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load([
                                                'javascripts/controllers/order/orderlist.js'
                                            ]);
                                        });
                                }
                            ]
                        }
                    })
                    .state('app.order.detail', {
                        url: '/detail?:id',
                        templateUrl: 'tpl/order/order_create.html',
                        controller: 'OrderDetailCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(function() {
                                        return $ocLazyLoad.load([
                                            'javascripts/controllers/template/creative-form.js',
                                            'javascripts/controllers/order/orderdetail.js',
                                            'javascripts/services/voteService.js',
                                            'javascripts/controllers/upload/simple_upload.js',
                                            'javascripts/services/apiService.js',
                                            'javascripts/services/orderService.js',
                                            'javascripts/directives/search-select.directives.js'
                                        ]);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.order.copy', {
                        url: '/copy?:id',
                        templateUrl: 'tpl/order/order_copy.html',
                        controller: 'OrderCopyCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(function() {
                                        return $ocLazyLoad.load([
                                            'javascripts/controllers/template/creative-form.js',
                                            'javascripts/controllers/order/ordercopy.js',
                                            'javascripts/controllers/upload/simple_upload.js',
                                            'javascripts/services/apiService.js',
                                            'javascripts/services/orderService.js',
                                            'javascripts/directives/search-select.directives.js'
                                        ]);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.order.create', {
                        url: '/create',
                        templateUrl: 'tpl/order/order_create.html',
                        controller: 'OrderCreateCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(function() {
                                        return $ocLazyLoad.load(
                                            ['javascripts/controllers/template/creative-form.js',
                                                'javascripts/controllers/order/orderdetail.js',
                                                'javascripts/services/voteService.js',
                                                'javascripts/controllers/upload/simple_upload.js',
                                                'javascripts/services/apiService.js',
                                                'javascripts/services/orderService.js',
                                                'javascripts/directives/search-select.directives.js'
                                            ]);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.order.visual_create', {
                        url: '/visual_create',
                        templateUrl: 'tpl/order/visual_order_create.html',
                        controller: 'OrderVisualCreateCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(function() {
                                        return $ocLazyLoad.load(
                                            [
                                                'javascripts/directives/area.select.directives.js',
                                                'javascripts/services/voteService.js',
                                                'vendor/libs/swfobject.js',
                                                'vendor/libs/drapTw.js',
                                                'vendor/libs/maskAll.js',
                                                //'javascripts/controllers/order/videoService.js',
                                                'javascripts/controllers/template/creative-form.js',
                                                'javascripts/controllers/order/visual_order_create.js',
                                                'javascripts/controllers/upload/simple_upload.js',
                                                'javascripts/directives/point-timeline.directives.js'
                                            ]);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.order.visual_detail', {
                        url: '/visual_detail?:id',
                        templateUrl: 'tpl/order/visual_order_detail.html',
                        controller: 'OrderVisualDetailCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(function() {
                                        return $ocLazyLoad.load(
                                            [
                                                'javascripts/directives/area.select.directives.js',
                                                'vendor/libs/swfobject.js',
                                                'vendor/libs/drapTw.js',
                                                'vendor/libs/maskAll.js',
                                                //'javascripts/controllers/order/videoService.js',
                                                'javascripts/controllers/template/creative-form.js',
                                                'javascripts/controllers/order/visual_order_detail.js',
                                                'javascripts/services/orderService.js',
                                                'javascripts/controllers/upload/simple_upload.js'
                                            ]);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.order.auto_create', {
                        url: '/auto_create',
                        templateUrl: 'tpl/order/auto_order_create.html',
                        controller: 'OrderAutoCreateCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(function() {
                                        return $ocLazyLoad.load(
                                            [
                                                'javascripts/directives/area.select.directives.js',
                                                'vendor/libs/swfobject.js',
                                                'vendor/libs/drapTw.js',
                                                'vendor/libs/maskAll.js',
                                                //'javascripts/controllers/order/videoService.js',
                                                'javascripts/controllers/template/creative-form.js',
                                                'javascripts/controllers/order/auto_order_create.js',
                                                'javascripts/services/voteService.js',
                                                'javascripts/controllers/upload/simple_upload.js',
                                                'javascripts/directives/point-timeline.directives.js',
                                                'javascripts/services/adPositionService.js'
                                            ]);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.order.auto_detail', {
                        url: '/auto_detail?:id',
                        templateUrl: 'tpl/order/auto_order_detail.html',
                        controller: 'OrderAutoDetailCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(function() {
                                        return $ocLazyLoad.load(
                                            [
                                                'javascripts/directives/area.select.directives.js',
                                                'vendor/libs/swfobject.js',
                                                'vendor/libs/drapTw.js',
                                                'vendor/libs/maskAll.js',
                                                //'javascripts/controllers/order/videoService.js',
                                                'javascripts/controllers/template/creative-form.js',
                                                'javascripts/controllers/order/auto_order_detail.js',
                                                'javascripts/services/orderService.js',
                                                'javascripts/controllers/upload/simple_upload.js',
                                                'javascripts/directives/point-timeline.directives.js',
                                                'javascripts/services/adPositionService.js'
                                            ]);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.order.timeline', {
                        url: '/timeline',
                        templateUrl: 'tpl/order/order_timeline.html',
                        controller: 'OrderTimeLineCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(function() {
                                        return $ocLazyLoad.load(
                                            ['javascripts/controllers/order/ordertimeline.js']);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.order.draft', {
                        url: '/draft',
                        templateUrl: 'tpl/order/order_detail.html',
                        resolve: {
                            deps: ['uiLoad',
                                function(uiLoad) {
                                    return uiLoad.load(['javascripts/controllers/order/orderdetail.js']);
                                }
                            ]
                        }
                    })
                    //商品管理
                    .state('app.goods', { //订单项
                        url: '/goods',
                        template: '<div class="fade-in-right-big smooth"><ul style="margin-bottom: 0" class="breadcrumb bg-white b-a">' +
                            '<li><a href="/"><i class="fa fa-home"></i> Home</a></li>' +
                            '<li class="active"><a>商品管理</a></li>' +
                            '</ul></div><div class="" ui-view=""></div>',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid', 'angularFileUpload']).then(function() {
                                        return $ocLazyLoad.load(
                                            ['javascripts/controllers/goods/GoodsController.js',
                                                'javascripts/services/goodsService.js'
                                            ]);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.goods.detail', {
                        url: '/detail?:id',
                        templateUrl: 'tpl/goods/goods_form.html',
                        controller: 'GoodsController',
                    })
                    .state('app.goods.create', {
                        url: '/create',
                        templateUrl: 'tpl/goods/goods_create.html',
                        controller: 'GoodsController',
                        // resolve: {
                        //   deps: ['$ocLazyLoad',
                        //     function($ocLazyLoad) {
                        //       return $ocLazyLoad.load(['ui.select', 'angularFileUpload']).then(function() {
                        //         return $ocLazyLoad.load(
                        //           ['javascripts/controllers/template/goods-form.js',
                        //             'javascripts/controllers/order/goodsdetail.js',
                        //             'javascripts/controllers/upload/simple_upload.js'
                        //           ]);
                        //       });
                        //     }
                        //   ]
                        // }
                    })
                    //商品
                    .state('app.goods.list', {
                        url: '/list',
                        templateUrl: 'tpl/goods/goods_list.html',
                        controller: 'GoodsController',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid', 'toaster']).then(
                                        function() {}
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.lebuy',{
                        url: '/lebuy',
                        template: '<div class="fade-in-right-big smooth"><ul style="margin-bottom: 0" class="breadcrumb bg-white b-a">' +
                            '<li><a href="/"><i class="fa fa-home"></i> Home</a></li>' +
                            '<li class="active"><a>商品管理</a></li>' +
                            '</ul></div><div class="" ui-view=""></div>',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid', 'angularFileUpload']).then(function() {
                                        return $ocLazyLoad.load(
                                            ['javascripts/controllers/lebuy/ListController.js',
                                                'javascripts/services/lebuyService.js'
                                            ]);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.lebuy.list',{
                        url:'/list',
                        templateUrl:'tpl/lebuy/list.html',
                        controller:'ListController',
                        resolve:{
                            deps:['$ocLazyLoad',function($ocLazyLoad){
                                return $ocLazyLoad.load(['ngGrid','toaster']).then(function(){});
                            }]
                        }
                    })
                    .state('app.lebuy.detail',{
                        url:'/detail/:id',
                        templateUrl:'tpl/lebuy/detail.html',
                        controller:'DetailController',
                        resolve:{
                            deps:['$ocLazyLoad',function($ocLazyLoad){
                                return $ocLazyLoad.load(['toaster']).then(function(){
                                    return $ocLazyLoad.load(
                                            ['javascripts/controllers/lebuy/DetailController.js',
                                                'javascripts/services/lebuyService.js'
                                            ]);
                                });
                            }]
                        }
                    })
                    //投票管理
                    .state('app.vote',{
                        url:'/vote',
                        template:'<div class="fade-in-right-big smooth"><ul style="margin-bottom: 0" class="breadcrumb bg-white b-a">' +
                            '<li><a href="/"><i class="fa fa-home"></i> Home</a></li>' +
                            '<li class="active"><a>投票管理</a></li>' +
                            '</ul></div><div class="" ui-view=""></div>'
                    })
                    .state('app.vote.create',{
                        url:'/create',
                        controller:'VoteCreateController',
                        templateUrl:'tpl/vote/vote_form.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid', 'toaster','ui.select', 'angularFileUpload']).then(
                                        function() {
                                            return $ocLazyLoad.load(['javascripts/controllers/vote/vote_create.js',
                                            'javascripts/services/voteService.js',
                                            'javascripts/controllers/upload/simple_upload.js'
                                            ]);
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.vote.detail',{
                        url:'/detail/:v_activityid',
                        controller:'VoteDetailController',
                        templateUrl:'tpl/vote/vote_detail.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid', 'toaster','ui.select', 'angularFileUpload']).then(
                                        function() {
                                            return $ocLazyLoad.load(['javascripts/controllers/vote/vote_detail.js',
                                            'javascripts/services/voteService.js',
                                            'javascripts/controllers/upload/simple_upload.js'
                                            ]);
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.vote.list',{
                        url:'/list',
                        templateUrl:'tpl/vote/vote_list.html',
                        controller:'VoteListController',
                        resolve:{
                            deps:['$ocLazyLoad',function($ocLazyLoad){
                                return $ocLazyLoad.load(['ngGrid', 'toaster']).then(function(){
                                    return $ocLazyLoad.load([
                                    'javascripts/controllers/vote/vote_list.js',
                                    'javascripts/services/voteService.js'
                                    ]);
                                })
                                
                            }]
                        }
                    })
                    .state('app.adp',{
                        url:'/adp',
                        template:'<div class="fade-in-right-big smooth"><ul style="margin-bottom: 0" class="breadcrumb bg-white b-a">' +
                            '<li><a href="/"><i class="fa fa-home"></i> Home</a></li>' +
                            '<li class="active"><a>广告位管理</a></li>' +
                            '</ul></div><div class="" ui-view=""></div>'
                    }).state('app.adp.list',{
                        url:'/list',
                        controller:'adpListController',
                        templateUrl:'tpl/adp/adp_list.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid', 'toaster']).then(
                                        function() {
                                            return $ocLazyLoad.load(['javascripts/controllers/adp/adplist.js',
                                                'javascripts/services/adPositionService.js']);
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.adp.detail',{
                        url:'/detail/:pid',
                        controller:'adpDetailController',
                        templateUrl:'tpl/adp/adp_detail.html',
                        resolve:{
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid', 'toaster']).then(
                                        function() {
                                            return $ocLazyLoad.load(['javascripts/controllers/adp/adpdetail.js',
                                                'javascripts/services/adPositionService.js']);
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    //广告管理
                    .state('app.ad', { //订单项
                        url: '/ad',
                        template: '<div class="fade-in-right-big smooth"><ul style="margin-bottom: 0" class="breadcrumb bg-white b-a">' +
                            '<li><a href="/"><i class="fa fa-home"></i> Home</a></li>' +
                            '<li class="active"><a>活动管理</a></li>' +
                            '</ul></div><div class="" ui-view=""></div>'
                    })
                    .state('app.ad.list', {
                        url: '/list',
                        templateUrl: 'tpl/ad/ad_list.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid', 'toaster']).then(
                                        function() {
                                            return $ocLazyLoad.load('javascripts/controllers/ad/adlist.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.ad.push', {
                        url: '/push',
                        templateUrl: 'tpl/ad/ad_push.html',
                        controller: 'PushAdCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid', 'toaster']).then(
                                        function() {
                                            return $ocLazyLoad.load('javascripts/controllers/ad/adlist.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.ad.detail', {
                        url: '/detail?:id',
                        templateUrl: 'tpl/ad/ad_detail.html',
                        controller: 'DetailAdCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster', 'angularFileUpload', 'ui.select']).then(
                                        function() {
                                            return $ocLazyLoad.load([
                                                'javascripts/services/voteService.js',
                                                'javascripts/controllers/template/creative-form.js',
                                                'javascripts/controllers/ad/addetail.js',
                                                'javascripts/controllers/upload/simple_upload.js',
                                                'javascripts/services/apiService.js'
                                            ]);
                                        });
                                }
                            ]
                        }
                    })
                    .state('app.ad.create', {
                        url: '/create',
                        templateUrl: 'tpl/ad/ad_create.html',
                        controller: 'CreateAdCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster', 'angularFileUpload', 'ui.select']).then(
                                        function() {
                                            return $ocLazyLoad.load([
                                                'javascripts/services/voteService.js',
                                                'javascripts/controllers/template/creative-form.js',
                                                'javascripts/controllers/ad/addetail.js',
                                                'javascripts/controllers/upload/simple_upload.js'
                                            ]);
                                        });
                                }
                            ]
                        }
                    })
                    //创意模板
                    .state('app.creative', {
                        url: '/creative',
                        template: '<div class="fade-in-right-big smooth"><ul style="margin-bottom: 0" class="breadcrumb bg-white b-a">' +
                            '<li><a href="/"><i class="fa fa-home"></i> Home</a></li>' +
                            '<li class="active"><a>创意模板管理</a></li>' +
                            '</ul></div><div class="" ui-view=""></div>'
                    })
                    .state('app.creative.list', { //订单项
                        url: '/list',
                        templateUrl: 'tpl/template/tmp_list.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid', 'toaster']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                'javascripts/controllers/template/tmplist.js');
                                        }
                                    );
                                }
                            ]
                        }

                    })
                    .state('app.creative.create', {
                        url: '/create',
                        templateUrl: 'tpl/template/tmp_form.html',
                        controller: 'CreateTmpCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load('toaster').then(function() {
                                        return $ocLazyLoad.load([
                                            'angularFileUpload',
                                            'javascripts/services/voteService.js',
                                            'javascripts/controllers/upload/simple_upload.js',
                                            'javascripts/controllers/template/creative-form.js',
                                            'javascripts/controllers/template/tmpform.js'
                                        ]);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.creative.view', {
                        url: '/view?:id',
                        templateUrl: 'tpl/template/tmp_view.html',
                        controller: 'ViewTmpCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load('toaster').then(function() {
                                        return $ocLazyLoad.load([
                                            'javascripts/controllers/template/creative-form.js',
                                            'javascripts/controllers/template/tmpform.js',
                                            'javascripts/services/voteService.js'
                                        ]);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.report', {
                        url: '/report',
                        templateUrl: 'tpl/report/index.html'
                    })
                    .state('app.upload', {
                        url: '/upload',
                        templateUrl: 'tpl/upload/upload.html',
                        controller: 'FileUploadCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function(ocLazyLoad) {
                                    return ocLazyLoad.load(['toaster', 'angularFileUpload']).then(function() {
                                        return ocLazyLoad.load(
                                            'javascripts/controllers/upload/upload.js');
                                    });
                                }
                            ]
                        }
                    })
            }
        ]
    ).factory('UserInterceptor', ["$q", "$rootScope", function($q, $rootScope) {
        return {
            request: function(config) {
                if ($rootScope.user && $rootScope.user.id) {
                    //console.log(config.headers["TOKEN"]);
                    if (config.headers["TOKEN"]) {
                        $rootScope.user = config.headers["TOKEN"];
                    } else {
                        config.headers["TOKEN"] = $rootScope.user;
                    }
                }
                return config;
            },
            responseError: function(response) {
                var data = response.data;
                console.log(data);
                return;
                switch (data["errorCode"]) {
                    case 404:
                        //$rootScope.$emit("userIntercepted","notfound",response);
                        break;
                    case 401:
                        $rootScope.$emit("userIntercepted", "notLogin", response);
                        break;
                    case 500:
                        $rootScope.$emit("userIntercepted", "sessionOut", response);
                        break;
                    case undefined:
                        break;
                    default:
                        console.log("errorCode=" + data["errorCode"]);
                        $rootScope.$emit("userIntercepted", "unknown", response);

                        break;
                }
                return $q.reject(response);
            }
        };
    }]);
