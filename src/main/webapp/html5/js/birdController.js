'use strict';
var birdControllers = angular.module('birdControllers', []);
myControllers.controller('Maintrl', function ($scope, $stateParams, birdService) {
    console.log("Maintrl");
});
myControllers.controller('shareCtrl', function ($scope, birdService, $location, $stateParams) {
    console.log("shareCtrl");
    var beRedeemCount;
    birdService.getPromoCode($stateParams.customId).success(function (response) {
        $scope.redeemCode = response.data.redeemCode;
        beRedeemCount = response.data.beRedeemCount;
        $scope.bRed = response.data.beRedeemCount;
        $scope.rule = response.data.rule;
    }).error(function (data, status) {
        console.log("error");
    });

    $scope.receive = function (ruleId, redeemCount, $event) {
        if (beRedeemCount < redeemCount) {
            layer.open({
                content: '没有达到领取条件',
                btn: ['确认']
            });
        } else {
            var str = $stateParams.customId + ruleId;
            birdService.receiveCouponByCount($stateParams.customId, ruleId).success(function (response) {
                console.log(response);
                angular.element($event.target).parent().children().filter("img").attr('src', '../images/active/button1.png');
                angular.element($event.target).parent().children().filter("span").text("已领取");
                layer.open({
                    content: response.errorInfo,
                    btn: ['确认']
                });
            }).error(function (data, status) {
                console.log("error");
            })
        }
    };
});
//添加加油卡充值
myControllers.controller('gasCardCtrl', function ($scope, $stateParams, birdService) {
    console.log('添加加油卡');
})
//添加加油卡类型
myControllers.controller('addCarTypeCtrl', function ($scope, $stateParams, birdService) {
    console.log('添加加油卡类型');
})
//洗车
myControllers.controller('cleanCarCtrl', function ($scope, $stateParams, birdService) {
    console.log('洗车');
})
//登录
myControllers.controller('loginCtrl', function ($scope, $stateParams, birdService, $location,localStorageService,$timeout) {
    console.log("登录");
    $scope.userCode = $location.search();
    $scope.openId = {};
    $scope.returnType=$location.search().type;           //要返回的页面的路径

    //获取opendId
    birdService.getOpenId($scope.userCode.code).success(function (req) {
        $scope.openId = req.openId;
    }).error(function () {
    });
    $scope.login = function (phone, pwd) {
        if ($.helpTool().checkMobile(phone, pwd))
            birdService.login(phone, pwd, $scope.openId).success(function (req) {
                if (req.errorNum == "0") {

                    $scope.userWxpayOpenId = localStorageService.get('userWxpayOpenId');
                    $scope.userCustomerId = localStorageService.get('userCustomerId');
                    console.log("customerId:"+localStorageService.get('userCustomerId')+";opendId:"+$scope.userWxpayOpenId);
                    $timeout(function(){
                        $scope.$apply(function(){
                            localStorageService.set('userWxpayOpenId',req.customer.wxpayOpenid);
                            localStorageService.set('userCustomerId',req.customer.customerId);
                            $scope.userWxpayOpenId = localStorageService.get('userWxpayOpenId');
                            $scope.userCustomerId = localStorageService.get('userCustomerId');
                            if($scope.returnType !="boxiang"){
                                if($scope.returnType =="temporary"){
                                    //跳转到临停
                                    $scope.encodeuri = encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/templates/temporary.html");
                                    window.location.href = $scope.encodeuri;
                                }else{
                                    /*alert($scope.userCustomerId);*/
                                    //跳转到其他页面
                                    /*$scope.encodeuri = encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/"+$scope.returnType);*/
                                    $scope.encodeuri="/home/"+$scope.returnType;
                                    $location.path($scope.encodeuri);
                                }

                            }
                        })
                    },0);
                    /*if($scope.returnType !="boxiang"){
                        if($scope.returnType =="temporary"){
                            //跳转到临停
                            $scope.encodeuri = encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/templates/temporary.html");
                            window.location.href = $scope.encodeuri;
                        }else{
                            //跳转到其他页面
                            /!*$scope.encodeuri = encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/"+$scope.returnType);*!/
                            $scope.encodeuri="/home/"+$scope.returnType;
                            $location.path($scope.encodeuri);
                        }

                    }*/

                    /* console.log(req);
                     $.removeCookie('custmerId', { path: '/' });
                     $.cookie('custmerId',req.customer.customerId,{ expires: 30, path: '/' });
                     window.localStorage.removeItem("custmerId");
                     window.localStorage.setItem('custmerId', req.customer.customerId);*/
                    //获取openId
                    /*birdService.getOpenId($scope.userCode.code).success(function(req){
                     $.removeCookie('openId', { path: '/' });
                     $.cookie('openId',req.openId,{ expires: 30, path: '/' });
                     window.localStorage.removeItem("openId");
                     window.localStorage.setItem('openId', req.openId);
                     window.location.href="../templates/temporary.html";
                     }).error(function(){
                     $.helpTool().errorWarning('#error_show', {"desc": req.errorInfo});
                     })*/
                } else {
                    $.helpTool().errorWarning('#error_show', {"desc": req.errorInfo});
                }
            }).error(function (req) {
                $.helpTool().errorWarning('#error_show', {"desc": "服务器繁忙"});
            })
    }
    //验证手机号码
    $scope.checkPhone = function (phone) {
        if (!(/^1[3|4|5|7|8]\d{9}$/.test(phone))) {
            $.helpTool().errorWarning('#error_show', {"desc": '请输入正确手机号'});
            return false;
        } else {
            return true;
        }
    }
    $scope.zhuChe = function () {
        if($scope.returnType !="boxiang"){
            $scope.encodeuri = encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/register&type="+$scope.returnType);
            window.location.href = $scope.encodeuri;
        }else{
            $scope.encodeuri = encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/register");
             window.location.href = $scope.encodeuri;
        }

    }
})
//注册
myControllers.controller('registerCtrl', function ($scope, $stateParams, birdService, $location) {
    console.log("注册");
    //60秒倒计时
    var wait = 60;
    // var timeId;
    clearInterval(window.timeId);

    /*alert($location.search());
     alert($location.absUrl());*/


    var codeObj = $location.search();

    $scope.returnType=$location.search().type;                   //要返回页面的路径

    $scope.openId = {};
    //获取opendId
    birdService.getOpenId(codeObj.code).success(function (req) {
        /*alert("openId1:"+req.openId);*/
        $scope.openId = req.openId;
    }).error(function () {
    });

    /* var openId = localStorage.getItem("openId");*/
    /*var code = codeObj.code;
     if (openId == null || openId == "" || openId == undefined) {
     if (codeObj.code == null || codeObj.code == "") {
     var enUrl = encodeURIComponent("http://www.p-share.com/wx_share/html5/views/index.html%23/home/register");
     /!*window.location="http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl="+enUrl;*!/
     }
     $.ajax({
     type: 'post',
     url: 'http://p-share.cn/wx_share/wxpay/getOpenId?code=' + code,
     dataType: "json",
     success: function (msg) {
     openId = msg.openId;
     localStorage.setItem("openId", msg.openId);
     },
     error: function (res) {
     }
     })
     } else {
     window.location = "http://www.p-share.com/wx_share/html5/views/index.html#/home/register";
     }*/
    //注册提交
    $scope.register = function (phone, psw, phonecode) {
        if ($.helpTool().checkMobile(phone, psw)) {
            if (phonecode == "" || phonecode == undefined) {
                $.helpTool().errorWarning("", {"desc": "请输入验证码"});
                return false;
            }
            /* alert("openId:"+$scope.openId);*/
            birdService.register(phone, psw, phonecode, $scope.openId).success(function (req) {
                console.log(req);
                if (req.errorNum != '0') {
                    $.helpTool().errorWarning('#error_show', {"desc": req.errorInfo});
                } else {
                    if($scope.returnType !="boxiang"){
                        if($scope.returnType =="temporary"){
                            //跳转到临停
                            $scope.encodeuri = encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://www.p-share.com/wx_share/html5/templates/temporary.html");
                            window.location.href = $scope.encodeuri;
                        }else{
                            $scope.encodeuri = encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/"+$scope.returnType);
                            window.location.href = $scope.encodeuri;
                        }
                    }else{
                        $scope.encodeuri = encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://www.p-share.com/wx_share/html5/templates/temporary.html");
                        window.location.href = $scope.encodeuri;
                    }

                }
            }).error(function (req) {
                console.log("注册失败");
                $.helpTool().errorWarning('#error_show', {"desc": req.errorInfo});
            })
        }

    }


    //获取验证码
    $scope.getCode = function (phone) {
        if ($.helpTool().checkMobile(phone, "123456")) {
            $(".get_yanm").attr("disabled", true);
            birdService.getCode(phone).success(function (req) {
                if (req.errorNum != '0') {
                    $.helpTool().errorWarning('#error_show', {"desc": '获取验证码失败'});
                }
                window.timeId = setInterval(function () {
                    if (wait == 0) {
                        $(".get_yanm").attr("disabled", false);
                        $(".get_yanm").text("获取验证码").css("background-color", "#3AD5B8");
                        clearInterval(window.timeId);
                        wait = 60;
                    } else {
                        $(".get_yanm").attr("disabled", true);
                        $(".get_yanm").text("重新获取(" + wait + ")").css("background-color", "#CBC9C9");
                        wait--;
                    }
                }, 1000);
                console.log(timeId);
            }).error(function () {
                $(".get_yanm").attr("disabled", false);
                $.helpTool().errorWarning('#error_show', {"desc": '获取验证码失败'});
            })
        }
    }
})
//洗车订单记录
myControllers.controller('orderRecordCtrl', function ($scope, $stateParams, birdService) {
    console.log("洗车订单记录");
    // 10 表示未付款 11 已付款    1表示 分页的第一页
    //初始化调用显示未付款
    $scope.init = function (ele) {
        $(".washOrderformList").css("display", 'none');
        $("." + ele).css("display", "block");
        $('.comm_pay').removeClass('current');
        $(".noPay").addClass('current');
        birdService.getCarwashList("d49ae0bc976f4cb18833326dca3d62e3", "10", "1").success(function (req) {
            console.log(req);
            if (req.errorNum == "0") {
                $scope.carwashList = req.carwashList;
            }
            else {
                $.helpTool().errorWarning('', {"desc": req.errorInfo});
            }
        }).error(function () {
            $.helpTool().errorWarning('', {"desc": '服务器繁忙'});
        })
    }
    $scope.init('no_pay');
    //已付款
    $scope.donePrice = function (ele) {
        $(".washOrderformList").css("display", 'none');
        $("." + ele).css("display", "block");
        $('.comm_pay').removeClass('current');
        $(".pay").addClass('current');
        birdService.getCarwashList("d49ae0bc976f4cb18833326dca3d62e3", "11", "1").success(function (req) {
            console.log(req);
            if (req.errorNum == "0") {
                $scope.carwashListDone = req.carwashList;
            }
            else {
                $.helpTool().errorWarning('', {"desc": req.errorInfo});
            }
        }).error(function () {
            $.helpTool().errorWarning('', {"desc": '服务器繁忙'});
        })
    }
    //未付款
    $scope.noPrice = function (ele) {
        $scope.init(ele);
    }
    //取消洗车订单
    $scope.cancelOrder = function (orderId, orderType) {
        birdService.cancelCarwashList(orderId, orderType).success(function (req) {
            console.log(req);
            if (req.errorNum == "0") {
                location.reload();
            }
            else {
                $.helpTool().errorWarning('', {"desc": req.errorInfo});
            }
        }).error(function () {
            $.helpTool().errorWarning('', {"desc": '服务器繁忙'});
        })

    }
})
//租车
myControllers.controller('rentCarCtrl', function ($scope, $stateParams, birdService) {
    console.log("租车");
    $.helpTool().loading().open();

    birdService.rentCar().success(function (req) {
        $.helpTool().loading().close();
        console.log(req);
        if (req.errorNum == "0") {
            $scope.message = req.data.commonRent;
            $scope.timeRent = req.data.timeRent;
            console.log($scope.message);
//            $scope.carArr = req.data.carList;
//            console.log($scope.carList);

        } else {
            $.helpTool().errorWarning("", {"desc": req.errorInfo});
        }
    }).error(function () {
        $.helpTool().loading().close();
        $.helpTool().errorWarning("", {"desc": "服务器繁忙"})
    })

})
//代泊订单
myControllers.controller('replaceOrderCtrl', function ($scope,$state, birdService, $timeout,antService,$location,localStorageService) {
    $scope.openId = localStorageService.get('userWxpayOpenId');
    $scope.customerId = localStorageService.get('userCustomerId');

    /*$scope.openId="oF97MszFoQ_-9PSju-J-Ev0rgfkk";
    $scope.customerId="2016052000000681";*/

    console.log("customerId:"+localStorageService.get('userCustomerId')+";opendId:"+localStorageService.get('userWxpayOpenId'));
    console.log("代泊订单");
    $.helpTool().loading().open();
    $scope.userCode=$location.search().code;

    $scope.viewIndex = 0;                                //活动页默认为0
    $scope.viewIndexCarNumber = "";                      //活动页的车牌号
    $scope.plateList = "";                               //代泊车辆列表
    $scope.viewIndexActiveCar = "";                      //活动页车辆数据绑定
    $scope.orderId = "";                                 //订单的Id
    var carTimeout = false;
    $scope.date = "";                                    //当前时间
    $scope.orderBeginDate = "";                          //订单开始时间
    $scope.orderEndDate = "";                            //订单结束时间
    $scope.differDate = "";                              // 时间相差,停车时长
    $scope.overDate="";                                  //超出预约取车时长
    $scope.over="";                                      //超出时长是否为负数

    $scope.parkingImageStr = "";                         //字符串拼接车辆图片
    $scope.hasCarImg = false;                            //是否有车辆图片
    $scope.parkingImageArr = [];                         //数组存放车辆图片
    $scope.parkingImageArrFilter = [];                   //过滤掉空数据重新存放车辆图片


    //计算时间差
    $scope.dateDiffer = function (nowDate, importDate) {
        $scope.importDate = Date.parse(new Date(importDate.replace(/-/g, "/")));
        $scope.TDOA = nowDate.getTime() - $scope.importDate;
        //计算出相差的天数
        $scope.days = Math.floor($scope.TDOA / (24 * 3600 * 1000));
        /*console.log("相差的天数:"+$scope.days);*/
        //计算出小时数
        $scope.level1 = $scope.TDOA % (24 * 3600 * 1000);
        $scope.hours = Math.floor($scope.level1 / (3600 * 1000));
        /* console.log("相差的小时:"+$scope.hours);*/
        //计算相差的分钟数
        $scope.level2 = $scope.level1 % (3600 * 1000);
        $scope.minutes = Math.floor($scope.level2 / (60 * 1000));
        /*console.log("相差分钟数:"+$scope.minutes);*/
        //计算相差的秒数
        $scope.level3 = $scope.level2 % (60 * 1000);
        $scope.seconds = Math.round($scope.level3 / 1000);
        /* console.log("相差秒数:"+$scope.seconds);*/
        return $scope.days + ":" + $scope.hours + ":" + $scope.minutes + ":" + $scope.seconds
    };
    //判断超出预约时长是否为负数
    $scope.minusOver=function(dateStr){
        var dateArr=dateStr.split(":").pop();
        if(dateArr<=0){
            return false;
        }else{
            return true;
        }
    };

    //过滤空数组
    $scope.ArrFilt = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].length == 0) arr.splice(i, 1);
        }
        return arr;
    }
    //绑定车牌号列表
    $scope.getCarList = function () {
        birdService.getQueryParkerById($scope.customerId, '').success(function (req) {
            $.helpTool().loading().close();
            if (req.errorNum == "0") {
                if(req.parkerList.length!=0){
                    $scope.plateList = req.parkerList;
                    $scope.viewIndexActiveCar = req.parkerList[0];
                    $scope.viewIndexCarNumber = req.parkerList[0].carNumber;
                    $scope.orderId = req.parkerList[0].orderId;
                    $scope.date = new Date();
                    $scope.orderBeginDate = req.parkerList[0].orderBeginDate;
                    $scope.orderEndDate=req.parkerList[0].orderEndDate;
                    $scope.differDate = $scope.dateDiffer($scope.date, $scope.orderBeginDate);
                    console.log("1停车时长:" + $scope.differDate);

                    $scope.overDate=$scope.dateDiffer($scope.date,$scope.orderEndDate);
                    $scope.over=$scope.minusOver($scope.overDate);
                    console.log("1超出预约取车时长:"+$scope.overDate+";"+$scope.over);

                    $scope.parkingImageStr = req.parkerList[0].parkingImagePath + "," + req.parkerList[0].validateImagePath;
                    $scope.parkingImageArr = $scope.parkingImageStr.split(",");
                    $scope.parkingImageArrFilter = $scope.ArrFilt($scope.parkingImageArr);

                    if ($scope.parkingImageArrFilter[0].length == 0) {
                        $scope.hasCarImg = false;
                    } else {
                        $scope.hasCarImg = true;

                    }
                    console.log($scope.plateList);
                    console.log($scope.viewIndexActiveCar);
                    $timeout(function () {
                        $scope.mySwiper = new Swiper('.car_swiper', {
                            prevButton: '.swiper-button-prev',
                            nextButton: '.swiper-button-next',
                        });
                        var swiper = new Swiper('.img_swiper', {
                            pagination: '.img_swiper_paginatioin',
                            prevButton: '.img_swiper_prev',
                            nextButton: '.img_swiper_next',
                            slidesPerView: 3,
                            spaceBetween: 10,
                            slidesPerGroup: 1,
                        });
                        POP.pic('.pic_content',{item:'div.img-con',dataSrc:'load-src'});
                        //切换车牌号
                        $scope.mySwiper.on('slideChangeStart', function (index) {
                            $scope.$apply(function () {
                                /* $scope.plateList = req.parkerList;*/
                                $scope.viewIndex = index.activeIndex;
                                $scope.viewIndexCarNumber = $scope.plateList[$scope.viewIndex].carNumber;
                                $scope.customerId = $scope.plateList[$scope.viewIndex].customerId;
                                $scope.viewIndexActiveCar = $scope.plateList[$scope.viewIndex];
                                $scope.orderId = $scope.plateList[$scope.viewIndex].orderId;

                                $scope.date = new Date();
                                $scope.orderBeginDate = $scope.plateList[$scope.viewIndex].orderBeginDate;
                                $scope.differDate = $scope.dateDiffer($scope.date, $scope.orderBeginDate);
                                console.log("2停车时长:" + $scope.differDate);
                                $scope.orderEndDate=$scope.plateList[$scope.viewIndex].orderEndDate;
                                $scope.overDate=$scope.dateDiffer($scope.date,$scope.orderEndDate);
                                $scope.over=$scope.minusOver($scope.overDate);
                                console.log("2超出预约取车时长:"+$scope.overDate);


                                $scope.parkingImageStr = $scope.plateList[$scope.viewIndex].parkingImagePath + "," + $scope.plateList[$scope.viewIndex].validateImagePath;
                                $scope.parkingImageArr = $scope.parkingImageStr.split(",");
                                $scope.parkingImageArrFilter = $scope.ArrFilt($scope.parkingImageArr);
                                if ($scope.parkingImageArrFilter[0].length == 0) {
                                    $scope.hasCarImg = false;
                                } else {
                                    $scope.hasCarImg = true;
                                }
                                $timeout(function () {
                                    var swiper = new Swiper('.img_swiper', {
                                        pagination: '.img_swiper_paginatioin',
                                        prevButton: '.img_swiper_prev',
                                        nextButton: '.img_swiper_next',
                                        slidesPerView: 3,
                                        spaceBetween: 10,
                                        slidesPerGroup: 1,
                                    });
                                    POP.pic('.pic_content',{item:'div.img-con',dataSrc:'load-src'});
                                }, 0);

                                console.log($scope.viewIndexActiveCar);
                            });
                        });
                    }, 0);
                }else{
                    $timeout.cancel(carTimeout);
                    $timeout(function(){
                        $scope.$apply(function(){
                            $scope.viewIndex = 0;                                //活动页默认为0
                            $scope.viewIndexCarNumber = "";                      //活动页的车牌号
                            $scope.plateList = "";                               //代泊车辆列表
                            $scope.viewIndexActiveCar = "";                      //活动页车辆数据绑定
                            $scope.orderId = "";                                 //订单的Id
                            var carTimeout = false;
                            $scope.date = "";                                    //当前时间
                            $scope.orderBeginDate = "";                          //订单开始时间
                            $scope.orderEndDate = "";                            //订单结束时间
                            $scope.differDate = "";                              // 时间相差,停车时长
                            $scope.overDate="";                                  //超出预约取车时长
                            $scope.over="";                                      //超出时长是否为负数

                            $scope.parkingImageStr = "";                         //字符串拼接车辆图片
                            $scope.hasCarImg = false;                            //是否有车辆图片
                            $scope.parkingImageArr = [];                         //数组存放车辆图片
                            $scope.parkingImageArrFilter = [];                   //过滤掉空数据重新存放车辆图片
                        })
                    },0);
                   /* $state.reload();*/
                }
            } else {
                $.helpTool().errorWarning("", {"desc": req.errorInfo});
            }
        }).error(function () {
            $.helpTool().loading().close();
            $.helpTool().errorWarning("", {"desc": "服务器繁忙"})
        });
    };

    // 1秒钟刷新一次列表
    $scope.getMessage = function () {
        $timeout.cancel(carTimeout);
        $scope.$apply(function () {
            /*$scope.viewIndexCarNumber*/
            birdService.getQueryParkerById($scope.customerId,$scope.viewIndexCarNumber).success(function (req) {
                if(req.parkerList.length !=0){
                        $scope.viewIndexActiveCar = req.parkerList[0];
                        $scope.date = new Date();
                        $scope.orderBeginDate = req.parkerList[0].orderBeginDate;
                        $scope.differDate = $scope.dateDiffer($scope.date, $scope.orderBeginDate);
                        $scope.orderEndDate=req.parkerList[0].orderEndDate;
                        $scope.overDate=$scope.dateDiffer($scope.date,$scope.orderEndDate);
                        $scope.over=$scope.minusOver($scope.overDate);

                        $scope.parkingImageStr = req.parkerList[0].parkingImagePath + "," + req.parkerList[0].validateImagePath;
                        $scope.parkingImageArr = $scope.parkingImageStr.split(",");
                        $scope.parkingImageArrFilter = $scope.ArrFilt($scope.parkingImageArr);


                        if ($scope.parkingImageArrFilter[0].length == 0) {
                            $scope.hasCarImg = false;
                        } else {
                            $scope.hasCarImg = true;
                            /*POP.pic('.pic_content',{item:'div.img-con',dataSrc:'load-src'});*/
                        }
                        $timeout(function () {
                            var swiper = new Swiper('.img_swiper', {
                                pagination: '.img_swiper_paginatioin',
                                prevButton: '.img_swiper_prev',
                                nextButton: '.img_swiper_next',
                                slidesPerView: 3,
                                spaceBetween: 10,
                                slidesPerGroup: 1,
                            });
                        }, 3);
                        /* console.log("3超出预约取车时长:"+$scope.overDate);*/
                        /*console.log("3停车时长:"+$scope.differDate);*/
                        /*  console.log($scope.viewIndexActiveCar);*/
                        /* console.log($scope.orderEndDate);*/
                }else{
                    $scope.mySwiper = new Swiper('.car_swiper', {
                        prevButton: '.swiper-button-prev',
                        nextButton: '.swiper-button-next',
                    });
                    $scope.mySwiper.removeSlide($scope.viewIndex);
                    $scope.getCarList();
                }
            })
        })
        carTimeout = $timeout($scope.getMessage, 5000);
    }

    /*$scope.getCarList();
    carTimeout = $timeout($scope.getMessage, 1000);*/

    //获取openId
    /*birdService.getOpenId($scope.userCode).success(function(req){
        $scope.openId=req.openId;
        //获取customerId
        antService.getCustomerId(req.openId).success(function(req){
            if(req.errorNum =="0"){
                angular.element('.empty_page').css("display","none");
                $scope.customerId=req.customer.customerId;
                $scope.getCarList();
                carTimeout = $timeout($scope.getMessage, 1000);
            }else{
                $scope.encodeuri=encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/login");
                window.location.href =$scope.encodeuri;
            }
        })
    })*/


    if($scope.openId =="" || $scope.openId==null ||$scope.customerId=="" || $scope.customerId==null){
        $scope.encodeuri=encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/login&type=replaceOrder");
        window.location.href =$scope.encodeuri;
    }else{
        angular.element('.empty_page').css("display","none");
        $scope.getCarList();
        carTimeout = $timeout($scope.getMessage, 5000);
    }

    //取消代泊
    $scope.cancelReplace = function () {
        angular.element('.cancleOrder').showDialog().open({
            'dialogHead': '提示',
            'dialogDesc': '',
            'dialogHeadCorlor': '',
            'dialogEndTimeTxt': '',
            'dialogEndTimeValue': '',
            'preTxt': '',
            'PrePrice': '',
            'relate': '',
            'relateTel': '您是否要取消代泊',
            'status': "",
            'btn': ['取消', '确定'],
            'cancelCallBack': function () {
                angular.element(".dialog_box_content").remove();
            },
            'checkOrder': function () {
                birdService.getCancelOrder($scope.orderId).success(function (req) {
                    if (req.errorNum == "0") {
                        console.log(req);
                        angular.element(".dialog_box_content").remove();
                        $scope.mySwiper.removeSlide($scope.viewIndex);
                        $scope.getCarList();
                    } else {
                        $.helpTool().errorWarning("", {"desc": req.errorInfo});
                    }
                }).error(function () {
                    $.helpTool().errorWarning("", {"desc": "服务器繁忙"});
                })
            }
        })
    };
    //我要取车
    $scope.getCar=function(){
        birdService.gettingCar($scope.orderId).success(function(req){
            console.log(req);
            if(req.errorNum=="0"){
                //获取授权配置参数
                antService.getWxConfig().success(function(data){
                    wx.config({
                       /* debug: true, // 开启调试模式*/
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: ['chooseWXPay']
                    });
                    //授权成功
                    wx.ready(function(){
                        $.ajax({
                            url: "/wx_share/wxpay/towxPay",
                            type: "POST",
                            dataType: "json",
                            data : {
                                money:req.data.amountPaid,
                                body: "口袋停临停",
                                openId: $scope.openId,
                                orderNo:req.data.orderId,
                                notify_url:"http://www.p-share.com/share/payment/wechat/backpay_12"
                            },
                            success: function(data){
                                wx.chooseWXPay({
                                    timestamp: data.timeStamp,
                                    nonceStr: data.nonceStr,
                                    package: data.package,
                                    signType: 'MD5',
                                    paySign: data.sign,
                                    success: function (res) {
                                        /*PaySuccess();
                                        $.MsgBox.Alert("提醒", "支付成功");*/
                                        // 支付成功后的回调函数
                                        $location.path("/home/orderAssess").search({customerId: $scope.customerId,orderId:$scope.orderId});
                                        /*$scope.getCarList();
                                        carTimeout = $timeout($scope.getMessage, 1000);*/
                                    },
                                    fail: function() {
                                        /*$.MsgBox.Alert("提醒", "支付失败");*/
                                    }
                                });
                            },
                            complete: function() {
                               /* hideLoader();*/
                            },
                            error:function(){
                               /* alert(error);*/
                            }
                        });
                    });
                    //授权失败
                    wx.error(function() {
                    })
                })
            }else{
                $.helpTool().errorWarning("",{"desc":req.errorInfo});
            }
        }).error(function(){
            $.helpTool().errorWarning("",{"desc":"服务器繁忙"});
        });
    }
})

//代泊订单评价
myControllers.controller('orderAssessCtrl',function ($scope,birdService,$location,$state,localStorageService) {
    console.log('代泊订单评价');
    /*$scope.customerId="1212121212112";
    $scope.orderId="1212122222";*/

    /*$scope.customerId=$location.search().customerId;*/
    $scope.orderId =$location.search().orderId;

    $scope.customerId = localStorageService.get('userCustomerId');

    $scope.submitAssess=function (radioContent,content) {
        //因为html界面中单选按钮在没有被手动点击时  获取到的数据是 undefined  发送服务器的数据必须为 1，2,3
        var check = "1";
        //评论内容默认为"",如果有数据则赋值
        var string = "tap";
        if(radioContent != undefined)
        {
            check = radioContent
        }
        if(content==undefined){
            content="";
        }
        birdService.orderAssess( $scope.customerId,$scope.orderId,"1",check,content).success(function (req) {
            console.log(req);
            if (req.errorNum == "0") {
                $state.go('home.replaceOrder');
                //成功对话框提示
               /* angular.element('.cancleOrder').showDialog().open({
                    'dialogHead': '提示',
                    'dialogDesc': '',
                    'dialogHeadCorlor': '',
                    'dialogEndTimeTxt': '',
                    'dialogEndTimeValue': '',
                    'preTxt': '',
                    'PrePrice': '',
                    'relate': '',
                    'relateTel': '评价成功，是否查看订单',
                    'status': "",
                    'btn': ['取消', '确定'],
                    'cancelCallBack': function () {
                        angular.element(".dialog_box_content").remove();
                        $scope.encodeuri=encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/replaceOrder");
                        window.location.href =$scope.encodeuri;
                    },
                    'checkOrder': function () {
                        angular.element(".dialog_box_content").remove();
                        $scope.encodeuri=encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/replaceOrder");
                        window.location.href =$scope.encodeuri;
                    }
                })*/
            } else {
                //失败对话框
                $.helpTool().errorWarning("", {"desc": req.errorInfo});
            }
        })
    }
})


