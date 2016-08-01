
/**
 * 路由配置及加载代码
 */
"use strict";
var path={
    build:'../build/javascript',   //gulp 编译之后的路径
   /* build:'../js'                  //原始路径*/

};
app.config(["$stateProvider","$urlRouterProvider",routeFn]);
function routeFn($stateProvider,$urlRouterProvider){
    $urlRouterProvider.when('','/home');
    $stateProvider
        .state('home',{
            url:'/home',
            templateUrl:'index.html',
            controller:'Maintrl',
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("home_Res").then(
                        function(){
                            return $ocLazyLoad.load(""+path.build+"/controllers/indexController.js");
                        }
                    )
                }]
            }
        })
        //车管家
        .state('home.carButler',{
            url:'/carButler',
            views:{
                'homeCont':{
                    templateUrl:"../templates/carButler.html",
                    controller:'carButlerCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("carButler_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/carButlerController.js',
                                ''+path.build+'/services/carButlerService.js'
                            ]);
                        }
                    )
                }]
            }
        })
        //违章查询
        .state('home.illegalQuery',{
            url:'/illegaQuery',
            views:{
                'homeCont':{
                    templateUrl:'../templates/illegaQuery.html',
                    controller:'illegaQueryCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("illegaQuery_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/illegaQueryController.js',
                                ''+path.build+'/services/illegaQueryService.js'
                            ]);
                        }
                    )
                }]
            }
        })
        //违章列表页面
        .state('home.illegaDetail',{
            url:'/illegaDetail',
            views:{
                'homeCont':{
                    templateUrl:'../templates/illegaDetail.html',
                    controller:'illegaDetailCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("illegaDetail_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/illegaDetailController.js'
                            ]);
                        }
                    )
                }]
            }
        })
        //违章详情页面
        .state('home.illegaInfor',{
            url:'/illegaInfor/:date/:area/:act/:code/:fen/:money/:handled',
            views:{
                'homeCont':{
                    templateUrl:'../templates/illegaInfor.html',
                    controller:'illegaInforCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("illegaInfor_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/illegaInforController.js'
                            ]);
                        }
                    )
                }]
            }
        })
        //添加加油卡充值
        .state('home.gasCard',{
            url:'/gasCard',
            views:{
                'homeCont':{
                    templateUrl:'../templates/gasCard.html',
                    controller:'gasCardCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("gasCard_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/gasCardController.js'
                            ]);
                        }
                    )
                }]
            }
        })
        //添加加油卡类型
        .state('home.addCarType',{
            url:'/addCarType',
            views:{
                'homeCont':{
                    templateUrl:'../templates/addCarType.html',
                    controller:'addCarTypeCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("addCarType_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/addCarTypeController.js'
                            ]);
                        }
                    )
                }]
            }
        })
        //登录
       /* .state('home.login',{
            url:'/login',
            views:{
                'homeCont':{
                    templateUrl:'../templates/login.html',
                    controller:'loginCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("login_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/loginController.js',
                                ''+path.build+'/services/loginService.js'
                            ]);
                        }
                    )
                }]
            }
        })*/
        //免密登录 -验证码登录
        .state('home.login',{
            url:'/login',
            views:{
                'homeCont':{
                    templateUrl:'../templates/login.html',
                    controller:'loginFreeCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("login_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/loginController.js',
                                ''+path.build+'/services/loginService.js',
                                ''+path.build+'/services/registerService.js'
                            ]);
                        }
                    )
                }]
            }
        })
        //注册
        .state('home.register',{
            url:'/register',
            views:{
                'homeCont':{
                    templateUrl:'../templates/register.html',
                    controller:'registerCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("register_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/registerController.js',
                                ''+path.build+'/services/registerService.js'
                            ]);
                        }
                    )
                }]
            }
        })
        //洗车
        .state('home.cleanCar',{
            url:'/cleanCar',
            views:{
                'homeCont':{
                    templateUrl:'../templates/cleanCar.html',
                    controller:'cleanCarCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("cleanCar_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/cleanCarController.js',
                                ''+path.build+'/services/cleanCarService.js'
                            ]);
                        }
                    )
                }]
            }
        })
        //洗车订单记录
        .state('home.orderRecord',{
            url:'/orderRecord',
            views:{
                'homeCont':{
                    templateUrl:'../templates/orderRecord.html',
                    controller:'orderRecordCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("orderRecord_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/orderRecordController.js',
                                ''+path.build+'/services/orderRecordService.js'
                            ]);
                        }
                    )
                }]
            }
        })
        //租车
        .state('home.rentCar',{
            url:'/rentCar',
            views:{
                'homeCont':{
                    templateUrl:'../templates/rentCar.html',
                    controller:'rentCarCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("rentCar_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/rentCarController.js',
                                ''+path.build+'/services/rentCarService.js'
                            ]);
                        }
                    )
                }]
            }
        })
        //代泊
        .state('home.replaceStop',{
            url:'/replaceStop',
            views:{
                'homeCont':{
                    templateUrl:'../templates/replaceStop.html',
                    controller: 'replaceStopCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("replaceStop_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/replaceStopController.js',
                                ''+path.build+'/services/replaceStopService.js'
                            ]);
                        }
                    )
                }]
            }
        })
        //代泊订单
        .state('home.replaceOrder',{
            url:'/replaceOrder',
            views:{
                'homeCont':{
                    templateUrl:'../templates/replaceOrder.html',
                    controller:'replaceOrderCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("replaceOrder_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/replaceOrderController.js?V=1.0.7',
                                ''+path.build+'/services/replaceOrderService.js?V=1.0.7'
                            ]);
                        }
                    )
                }]
            }
        })
        //代泊订单评价
        .state('home.orderAssess',{
            url:'/orderAssess',
            views:{
                'homeCont':{
                    templateUrl:'../templates/orderAssess.html',
                    controller:'orderAssessCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("orderAssess_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/orderAssessController.js',
                                ''+path.build+'/services/orderAssessService.js'
                            ]);
                        }
                    )
                }]
            }
        })
        //首页报表——移动端
        .state('home.chart',{
            url:'/chart',
            views:{
                'homeCont':{
                    templateUrl:'../templates/chart.html',
                    controller:'chartCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("chart_Res").then(
                        function (){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/chartController.js?V=1.0.1',
                                ''+path.build+'/services/chartService.js'
                            ])
                        }
                    )
                }]
            }
        })
        //项目统计--移动端
        .state('home.proChart',{
            url:'/proChart',
            views:{
                'homeCont':{
                    templateUrl:'../templates/proChart.html',
                    controller:'proChartCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("proChart_Res").then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/proChartController.js?V=1.0.7',
                                ''+path.build+'/services/proChartService.js?V=1.0.7'
                            ])
                        }
                    )
                }]
            }
        })
        //报表--PC端
        .state('home.report',{
            url:'/report',
            views:{
                'homeCont':{
                    templateUrl:'../templates/report.html',
                    controller:'reportCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("report_Res").then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/reportController.js?V=1.0.1',
                                ''+path.build+'/services/chartService.js'
                            ])
                        }
                    )
                }]
            }
        })
        //活动 --1
        .state('home.actOne',{
            url:'/actOne',
            views:{
                'homeCont':{
                    templateUrl:'../templates/actOne.html',
                    controller:'actOneCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("actOne_Res").then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/actOneController.js',
                                ''+path.build+'/services/activeService.js'
                            ])
                        }
                    )
                    /*return $ocLazyLoad.load([
                        ''+path.build+'/controllers/actOneController.js'
                    ])*/
                }]
            }
        })
        //活动 --2
        .state('home.actTwo',{
            url:'/actTwo',
            views:{
                'homeCont':{
                    templateUrl:'../templates/actTwo.html',
                    controller:'actTwoCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("actTwo_Res").then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/actTwoController.js',
                            ])
                        }
                    )
                }]
            }
        })
        //活动 --5
        .state('home.actFive',{
            url:'/actFive',
            views:{
                'homeCont':{
                    templateUrl:'../templates/actFive.html',
                    controller:'actFiveCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("actFive_Res").then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/actFiveController.js',
                            ])
                        }
                    )
                }]
            }
        })
        //活动 --3
        .state('home.actThree',{
            url:'/actThree',
            views:{
                'homeCont':{
                    templateUrl:'../templates/actThree.html',
                    controller:'actThreeCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("actThree_Res").then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/actThreeController.js',
                            ])
                        }
                    )
                }]
            }
        })
        //活动 --4
        .state('home.actFour',{
            url:'/actFour',
            views:{
                'homeCont':{
                    templateUrl:'../templates/actFour.html',
                    controller:'actFourCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("actFour_Res").then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/actFourController.js',
                            ])
                        }
                    )
                }]
            }
        })
        //活动 --7
        .state('home.actSeven',{
            url:'/actSeven',
            views:{
                'homeCont':{
                    templateUrl:'../templates/actSeven.html',
                    controller:'actSevenCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("actSeven_Res").then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/actSevenController.js',
                            ])
                        }
                    )
                }]
            }
        })
        //活动 --8
        .state('home.actEight',{
            url:'/actEight',
            views:{
                'homeCont':{
                    templateUrl:'../templates/actEight.html',
                    controller:'actEightCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("actEight_Res").then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/actEightController.js',
                            ])
                        }
                    )
                }]
            }
        })
        //活动 --6
        .state('home.actSix',{
            url:'/actSix',
            views:{
                'homeCont':{
                    templateUrl:'../templates/actSix.html',
                    controller:'actSixCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("actSix_Res").then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/actSixController.js',
                            ])
                        }
                    )
                }]
            }
        })
        //测试清楚缓存页面
        .state('home.test',{
            url:'/test',
            views:{
                'homeCont':{
                    templateUrl:'../templates/test.html',
                    controller:'testCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        ''+path.build+'/controllers/testController.js',
                    ])
                }]
            }

        })


        //访客受邀
        .state('home.invit',{
            url:'/invit',
            views:{
                'homeCont':{
                    templateUrl:'../templates/invit.html',
                    controller:'invitCtrl'
                }
            },
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load('invit_Res').then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/invitController.js',
                                ''+path.build+'/services/invitService.js',
                            ])
                        }
                    )
                }]
            }
        })
        //访客凭证
        .state('home.invitCred',{
            url:'/invitCred',
            views:{
                'homeCont':{
                    templateUrl:'../templates/invitCred.html',
                    controller:'invitCredCtrl'
                }
            },
            resolve:{
                deps:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load('invitCred_Res').then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/invitCredController.js',
                                ''+path.build+'/services/invitCredService.js',
                            ])
                        }
                    )
                }]
            }
        })

        //停车缴费
        .state('home.parkPay',{
            url:'/parkPay',
            views:{
                'homeCont':{
                    templateUrl:'../templates/parkPay.html',
                    controller:'parkPayCtrl'
                }
            },
            resolve:{
                deps:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load('parkPay_Res').then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/parkPayController.js',
                                ''+path.build+'/services/parkPayService.js',
                            ])
                        }
                    )
                }]
            }
        })

        //支付成功
        .state('home.paySuccess',{
            url:'/paySuccess',
            views:{
                'homeCont':{
                    templateUrl:'../templates/paySuccess.html',
                    controller:'paySuccessCtrl'
                }
            },
            resolve:{
                deps:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load('paySuccess_Res').then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/paySuccessController.js',
                                ''+path.build+'/services/paySuccessService.js',
                            ])
                        }
                    )
                }]
            }
        })
        //支付凭证
        .state('home.payOrder',{
            url:'/payOrder',
            views:{
                'homeCont':{
                    templateUrl:'../templates/payOrder.html',
                    controller:'payOrderCtrl'
                }
            },
            resolve:{
                deps:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load('payOrder_Res').then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/payOrderController.js',
                                ''+path.build+'/services/paySuccessService.js',
                            ])
                        }
                    )
                }]
            }
        })
        //支付协议
        .state('home.payAgree',{
            url:'/payAgree',
            views:{
                'homeCont':{
                    templateUrl:'../templates/payAgree.html',
                    controller:'payAgreeCtrl'
                }
            },
            resolve:{
                deps:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load('payAgree_Res').then(
                        function(){
                            return $ocLazyLoad.load([
                                ''+path.build+'/controllers/payAgreeController.js',
                            ])
                        }
                    )
                }]
            }
        })
        //用户协议
        .state('home.useAgree',{
            url:'/useAgree',
            views:{
                'homeCont':{
                    templateUrl:'../templates/useAgree.html',
                    controller:'useAgreeCtrl'
                }
            },
            resolve:{
                deps:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        ''+path.build+'/controllers/useAgreeController.js',
                    ])
                }]
            }
        })

}

