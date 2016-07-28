/**
 * Created by Administrator on 2016/4/13.
 */
'use strict';
var myControllers = angular.module('antControllers', []);
myControllers.controller('Maintrl', function ($scope, $stateParams) {
    console.log("Maintrl");
});
//红包邀请
myControllers.controller('redPacketCtrl', function ($scope, antService, $location, $stateParams) {
    console.log("redPacketCtrl");
    antService.getPromoCode($stateParams.customId).success(function (req) {
        $scope.code = req.data;
    }).error(function (data, status) {
        console.log("error");
    });
});
//车管家
myControllers.controller('carButlerCtrl', function ($scope,$timeout,$stateParams, antService, $location) {
    console.log("车管家");
    $.helpTool().loading().open();
    $scope.imgLink = {};
    $scope.parkingId={};   //附近停车场的Id
    //获取轮播图片
    antService.getCarButlerImage().success(function (req) {
        $scope.imgArr = req.eventPageList;
        $timeout(function(){
             $scope.swiper = new Swiper('.swiper-container', {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplay: 2500,
                autoplayDisableOnInteraction: false,
                spaceBetween: 30
            });
        },0)
    }).error(function () {
        console.log("Error");
    });
    //获取菜单列表
    antService.getMenu().success(function (req) {
        /*$.helpTool().loading().close();*/
        //console.log(req)
        if (req.errorNum == "0") {
            $scope.menuArr = req.srvList;
           
        } else {
            $.helpTool().errorWarning("", {"desc": req.errorInfo});
        }
    }).error(function () {
       /* $.helpTool().loading().close();*/
        $.helpTool().errorWarning("", {"desc": "服务器繁忙"})
    });
    /**
     * 获取附近的停车场
     *根据经纬度在去获取菜单数据
     */
    var map, geolocation;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('mapcontainer', {
        resizeEnable: true
    });
    map.plugin('AMap.Geolocation', function () {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });
    //解析定位结果
    function onComplete(data) {
        //获取周边停车场
        antService.getNearPark(data.position.lng, data.position.lat).success(function (req) {
            $.helpTool().loading().close();
            console.log(req);
            if (req.errorNum == '0') {
                $scope.parkingId=req.parkingList[0].parking_id;
            } else {
                $.helpTool().errorWarning('', {"desc": req.errorInfo});
            }
        }).error(function (req) {
            $.helpTool().loading().close();
            $.helpTool().errorWarning('', {"desc": "服务繁忙"});
        })
    }
    //解析定位错误信息
    function onError(data) {
        $.helpTool().loading().close();
        $.helpTool().errorWarning('', {"desc": '定位失败'});
    }
    //菜单跳转
    $scope.selectMenu = function (srvId) {
        switch (srvId) {
            case 1:
                // 全国违章查询
                $location.path('/home/illegaQuery');
                break;
            case 2:
                //加油卡充值
                $location.path('/home/gasCard');
                break;
            case 3:
                //洗车
                $location.path('/home/cleanCar');
                break;
            case 4:
                //汽车内里清洁
                $scope.instructe($scope.parkingId,srvId);
                break;
            case 5:
                //汽车打蜡啦啦啦
                $scope.instructe($scope.parkingId,srvId);
                break;
            case 6:
                //新服务
                $.helpTool().errorWarning("",{"desc":"敬请期待"})
                break;
            case 7:
                //租车
                $location.path('/home/rentCar');
                break;
            case 8:
                //充电
                $scope.instructe($scope.parkingId,srvId);
                break;
            case 9:
                break;
            case -1:
                break;
            default :
                break;
        }

    }
    //弹出服务简介
    $scope.instructe = function (parkingId,srvId) {
        antService.getServeInfo($scope.parkingId,srvId).success(function(req){
            if(req.errorNum =="0"){
                console.log(req);
                $.helpTool().instructe(req.srvInfo);
            }else if(req.errorNum =="1"){
                $.helpTool().errorWarning("",{"desc":"当前停车场服务暂未开通，敬请期待..."});
            }else{
                $.helpTool().errorWarning("",{"desc":req.errorInfo});
            }
        }).error(function(){
            $.helpTool().errorWarning("",{"desc":"服务器繁忙"});
        });
    }

});
//找车位
myControllers.controller('mapCtrl', function ($scope, $stateParams, antService) {
    console.log("找车位");

});
//违章查询
myControllers.controller('illegaQueryCtrl', function ($scope, $stateParams, antService, $rootScope) {
    console.log('违章查询');
    var area = new LArea();
    area.init({
        'trigger': '#address',
        'valueTo': '#addressValue',
        'keys': {
            id: 'province_code',
            name: 'province',
        },
        'type': 1,
        'data': LAreaData
    });
    area.value = [1, 13, 2];
    $scope.illegaSelect = function (hphm, engineno, classno) {
        var city = $("#addressValue").val();
        if (city == "" || city == undefined) {
            $.helpTool().errorWarning('#error_show', {"desc": '请选择省、市'});
            return false;
        } else if (hphm == "" || hphm == undefined) {
            $.helpTool().errorWarning('#error_show', {"desc": '请填写车辆车牌号'});
            return false;
        } else if (engineno == "" || engineno == undefined || engineno.length < 6) {
            $.helpTool().errorWarning('#error_show', {"desc": '请输入发动机号后6位'});
            return false;
        }
        //显示加载状态
        $.helpTool().loading().open();
        antService.getIllegaData(city, hphm, engineno, classno).success(function (req) {
            $.helpTool().loading().close();
            if (req.resultcode == "200") {
                $rootScope.showIllegaData = req.result.lists;
                window.location.href = '#/home/illegaDetail';
            } else {
                $.helpTool().errorWarning('#error_show', {"desc": req.reason});
            }
        }).error(function (req) {
            //关闭加载状态
            $.helpTool().loading().close();
            $.helpTool().errorWarning('#error_show', {"desc": req.reason});
        })
    }
});
//违章列表页面
myControllers.controller('illegaDetailCtrl', function ($scope, $stateParams, antService, $rootScope) {
    console.log("违章列表页面");
    /*  $scope.data=antService.showIllegaData().getVal();*/
    $scope.illeageArr = $rootScope.showIllegaData;
})
//违章详情页面
myControllers.controller('illegaInforCtrl', function ($scope, $stateParams, antService) {
    console.log("违章详情页面");
    $scope.data = $stateParams;
})
//车辆临停页面
myControllers.controller('temporaryCtrl', function ($scope, $stateParams,birdService, antService, $compile, $location,localStorageService) {
    console.log("车辆临停页面");
    /* $scope.getQueryString=function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    $scope.userCode=$scope.getQueryString("code");
    $scope.openId={};
    $scope.customerId={};
    //获取openId
    birdService.getOpenId($scope.userCode).success(function(req){
        $scope.openId=req.openId;
        //获取customerId
        antService.getCustomerId(req.openId).success(function(req){
            if(req.errorNum =="0"){
                angular.element('.kongbai').css("display","none");
                $scope.customerId=req.customer.customerId;
            }else{
                /!*$scope.encodeuri=encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/login");
                window.location.href =$scope.encodeuri;*!/
                $scope.encodeuri=encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/login&type=temporary");
                window.location.href =$scope.encodeuri;
            }
        }).error(function(req){

        })
    }).error(function(){
    });*/

    $scope.openId = localStorageService.get('userWxOpenIdSixThree');
    $scope.customerId = localStorageService.get('userWxCustomerIdSixThree');
    if($scope.openId =="" || $scope.openId==null ||$scope.customerId=="" || $scope.customerId==null){
        $scope.encodeuri=encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/login&type=temporary");
        window.location.href =$scope.encodeuri;
    }else{
        angular.element('.kongbai').css("display","none");
    }


    $scope.updateView = function (param, currentIndex) {
        if (param.length > 0) {
            $("#historyCar").html("");
            var html = "";
            var j = -1;
            for (var i = param.length - 1; i >= 0; i--) {
                j++;
                html += '<li id="carNumber1" ng-click="queryCars(\'' + param[i] + '\', \'' + j + '\')">' + param[i] + '</li>';
            }
            $("#historyCar").html($compile(html)($scope));
            if (currentIndex != -1) {
                var n = currentIndex;
                $('.selectList li').eq(n).addClass('current').siblings().removeClass('current');
            }

            console.log($("#historyCar"));
        }
    }
    //动态加载历史车牌号码
    var ary = new Array();
    if (localStorage.getItem("item1") != null) {
        ary = localStorage.getItem("item1").split(",");
    }
    console.log(ary);
    $scope.updateView(ary, -1);
    //查询车辆
    $scope.queryCars = function (inputCarNumber, currentIndex) {
        //存入h5数据缓存
        console.log(currentIndex);
        var carNumber = inputCarNumber;
        if (!(/^[\u4E00-\u9FA5][\da-zA-Z]{6}$/).test(carNumber)) {
            /* alert("请输入正确的车牌");*/
            $(".temp_tangc .tangc_desc").text("请输入正确的车牌");
            $(".temp_tangc").css("display", "block");
            return false;
        }
        else {
            var AcarNumber = carNumber.toUpperCase();
            if (ary.indexOf(AcarNumber) == -1) {
                ary.push(AcarNumber);
            }
            if (ary.length > 3) {
                ary = ary.splice(1, 3);
            }
            localStorage.setItem("item1", ary);
            console.log(ary);
            $scope.updateView(ary, currentIndex);
        }
        var param = {
            "customerId":$scope.customerId,
            "carNumber": AcarNumber,
        };
        var str = param.customerId + param.carNumber + jsonUrl.key;
        var summary = $.md5(str);

        var cardata = EX.ajaxTollPshare.commenGet(jsonUrl.carList + param.customerId + "/" + param.carNumber + "/" + summary);
        console.log(cardata);
        if (cardata != null && cardata.errorNum == 0) {
            var cars = cardata.cars;
            if (cars.length == 0) {
                $("#zu").html("");
                $("#orderNum").html(0);
                //  alert("小p暂未找到您的爱车临停订单,如需缴款，可直接前往岗亭处");
                $(".temp_tangc .tangc_desc").text("小p暂未找到您的爱车临停订单,如需缴款，可直接前往岗亭处");
                $(".temp_tangc").css("display", "block");
                return false;
            }
            $("#orderNum").html(cars.length);
            var car = cars[0];
            $("#zu").html("");
            var html =
                '<div class="section">' +
                '<div class="chepai">' +
                '<span class="left" id="left">' + car.carNumber + '</span>' +
                '<span class="right">' + car.parkingName + '</span>' +
                '</div>' +
                '<div class="time">进场时间:<span>' + car.beginDate + '</span></div>' +
                '<ul class="detail">' +
                '<li class="parktime">' +
                '<span>停车时长:</span>' +
                '<div class="times">' + car.parkingTime + '</div>' +
                '</li>' +
                '<li class="parkpay">' +
                '<span>停车金额:</span>' +
                '<div class="pays">' + car.amountPayable + '<span>元</span></div>' +
                '</li>' +
                '</ul>' +
                '<button class="paynow"  ng-click="createOrderC(\'' + car.carNumber + '\', \'' + car.parkingId + '\')">立即支付</button>' +
                '</div>'
            $("#zu").html($compile(html)($scope));
        } else if (cardata == null) {
            // alert("服务器繁忙");
            $(".temp_tangc .tangc_desc").text("服务器繁忙");
            $(".temp_tangc").css("display", "block");
        } else {
            // alert(cardata.errorInfo);
            $(".temp_tangc .tangc_desc").text(cardata.errorInfo);
            $(".temp_tangc").css("display", "block");
        }
    }
    //立即下单
    $scope.createOrderC = function (carNumber, parkingId) {
        //调用微信公众号支付接口
        /*var wechatInfo=navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
         alert(1+wechatInfo);
         if (!wechatInfo){*/
        var param1 = {
            "customerId":$scope.customerId,
            "carNumber": carNumber,
            "orderType": "11",
            "timestamp": new Date().toLocaleString(),
            "parkingId": parkingId
        };
        var orderdata = EX.ajaxTollPshare.commenPost(jsonUrl.orderc, param1);
        if (orderdata.errorNum == "0") {
            var da = {
                "orderNo": orderdata.order.orderId,
                "money": orderdata.order.amountPaid,
                //"money": "0.01",
                "openId": $scope.openId,
                "notify_url": "http://www.p-share.com/share/payment/wechat/backpay_11",
                "body": "口袋停临停"
            };
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
                        data : {money:orderdata.order.amountPaid,
                            body: "口袋停临停",
                            openId: $scope.openId,
                            orderNo:orderdata.order.orderId,
                            notify_url:"http://www.p-share.com/share/payment/wechat/backpay_11"},
                        success: function(data){
                            wx.chooseWXPay({
                                timestamp: data.timeStamp,
                                nonceStr: data.nonceStr,
                                package: data.package,
                                signType: 'MD5',
                                paySign: data.sign,
                                success: function (res) {
                                    PaySuccess();
                                    $.MsgBox.Alert("提醒", "支付成功");
                                    // 支付成功后的回调函数
                                },
                                fail: function() {
                                    $.MsgBox.Alert("提醒", "支付失败");
                                }
                            });
                        },
                        complete: function() {
                            hideLoader();
                        },
                        error:function(){
                            alert(error);
                        }
                    });
                });
                //授权失败
                wx.error(function() {
                    //alert("wx.error");
                })
            }).error(function(){
            });
           /* $.ajax({
                type: 'post',
                url: 'http://p-share.cn/wx_share/wxpay/towxPay',
                dataType: "json",
                data: da,
                success: function (msg) {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                            "appId": msg.appId,                //公众号名称，由商户传入
                            "timeStamp": "" + msg.timeStamp,         //时间戳，自1970年以来的秒数
                            "nonceStr": msg.nonceStr,		   //随机串
                            "package": msg.package,
                            "signType": msg.signType,          //微信签名方式：
                            "paySign": msg.sign               //微信签名
                        },
                        function (res) {
                            if (res.err_msg == "get_brand_wcpay_request：ok") {
                            } else if (res.err_msg == "get_brand_wcpay_request：cancel") {
                                // alert("您已取消支付");
                                $(".temp_tangc .tangc_desc").text("您已取消支付");
                                $(".temp_tangc").css("display", "block");
                            } else if (res.err_msg == "get_brand_wcpay_request：fail") {
                                //  alert("支付失败");
                                $(".temp_tangc .tangc_desc").text("支付失败");
                                $(".temp_tangc").css("display", "block");
                            }
                        }
                    )
                },
                error: function (res) {
                    //   alert("支付异常");
                    $(".temp_tangc .tangc_desc").text("支付异常");
                    $(".temp_tangc").css("display", "block");
                }
            })*/
        }
        /*}else if(wechatInfo[1]<"5.0"){
         alert('本活动仅支持微信5.0以上版本');
         }*/
    }
})
//代泊
myControllers.controller('replaceStopCtrl',function($scope,antService,birdService,$state,$location,localStorageService){
    $scope.openId = localStorageService.get('userWxOpenIdSixThree');
    $scope.customerId = localStorageService.get('userWxCustomerIdSixThree');
    console.log("customerId:"+localStorageService.get('userWxCustomerIdSixThree')+";opendId:"+localStorageService.get('userWxOpenIdSixThree'));
    console.log("代泊");

    /*$scope.userCode=$location.search().code;
    $scope.openId="";                                                     //微信的openId
    $scope.customerId = "2016050500000585";               //用户的Id
    //获取openId
    birdService.getOpenId($scope.userCode).success(function(req){
        $scope.openId=req.openId;
        //获取customerId
        antService.getCustomerId(req.openId).success(function(req){
            if(req.errorNum =="0"){
                angular.element('.empty_page').css("display","none");
                $scope.customerId=req.customer.customerId;
            }else{
                $scope.encodeuri=encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/login&type=replaceStop");
                window.location.href =$scope.encodeuri;
            }
        })
    });*/
    if($scope.openId =="" || $scope.openId==null ||$scope.customerId=="" || $scope.customerId==null){
        $scope.encodeuri=encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/login&type=replaceStop");
        window.location.href =$scope.encodeuri;
    }else{
        angular.element('.empty_page').css("display","none");
    }


    $scope.parklist=false;
    $scope.plate=localStorageService.get('userCarNumber');         //车牌号
    $scope.parkName="";      //停车场名称
    $scope.parkId="";        //停车场的Id
    $scope.price="0";        //预计费用
    $scope.takeTime="";      //预计取车时间
    $scope.date=new Date();
    $scope.CurentTime=function(){
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        var ss=now.getSeconds();            //秒
        var clock = year + "-";
        if(month < 10)
            clock += "0";
        clock += month + "-";
        if(day < 10)
            clock += "0";
        clock += day + " ";
        if(hh < 10)
            clock += "0";
        clock += hh + ":";
        if (mm < 10)
            clock += '0';
        clock += mm +":";
        if(ss<10)
        clock +='0';
        clock +=ss;
        return(clock);
    }
    $scope.date.getHour=$scope.CurentTime();


    //绑定可代泊的车场
    antService.getCanParkList("","").success(function(req){
        $.helpTool().loading().close();
        if(req.errorNum=="0"){
            $scope.parkList=req.data;
        }else{
            $.helpTool().errorWarning("",{"desc":req.errorInfo});
        }

    }).error(function(){
        $.helpTool().errorWarning("",{"desc":"服务器繁忙"})
    });
    /**
     * 获取附近的停车场
     *根据经纬度在去获取菜单数据
     */
    /*var map, geolocation;
     //加载地图，调用浏览器定位服务
     map = new AMap.Map('mapcontainer', {
     resizeEnable: true
     });
     map.plugin('AMap.Geolocation', function () {
     geolocation = new AMap.Geolocation({
     enableHighAccuracy: true,//是否使用高精度定位，默认:true
     timeout: 10000,          //超过10秒后停止定位，默认：无穷大
     buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
     zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
     buttonPosition: 'RB'
     });
     map.addControl(geolocation);
     geolocation.getCurrentPosition();
     AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
     AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
     });
     //解析定位结果
     function onComplete(data) {
     //绑定可代泊的车场
     antService.getCanParkList(data.position.lng, data.position.lat).success(function(req){
     $.helpTool().loading().close();
     if(req.errorNum=="0"){
     $scope.parkList=req.data;
     }else{
     $.helpTool().errorWarning("",{"desc":req.errorInfo});
     }

     }).error(function(){
     $.helpTool().errorWarning("",{"desc":"服务器繁忙"})
     });
     }
     //解析定位错误信息
     function onError(data) {
     $.helpTool().loading().close();
     antService.getCanParkList("","").success(function(req){
     $.helpTool().loading().close();
     if(req.errorNum=="0"){
     $scope.parkList=req.data;
     }else{
     $.helpTool().errorWarning("",{"desc":req.errorInfo});
     }

     }).error(function(){
     $.helpTool().errorWarning("",{"desc":"服务器繁忙"})
     });
     }*/



    //弹出日期插件
    angular.element('.how_take_time').mobiscroll().datetime({
        theme: 'mobiscroll',
        lang: 'zh',
        display: 'bottom',
        minDate: new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate(),$scope.date.getHours(),$scope.date.getMinutes()),
        maxDate: new Date($scope.date.getFullYear(),$scope.date.getMonth(),$scope.date.getDate()+1,23,59),
        /* invalid: [
         { start: '00:00', end: '08:30' },
         ],*/
        dateOrder: 'yymmdd',
        timeWheels: 'HHii',
        dateFormat:'yy-mm-dd',
        timeFormat:'HH:ii:ss',
        onSelect: function (valueText, inst) {
            // 获取预计停车的费用
            antService.getTakeTimePrice($scope.parkId,$scope.date.getHour,valueText,'001').success(function(req){
                console.log(req);
                if(req.errorNum=="0"){
                    angular.element(".btn_replace_stop").attr("disabled",false).css("background-color","#3AD5B8");
                    $scope.description=req.data.description;
                    $scope.price=req.data.price;
                }else{
                    $.helpTool().errorWarning("",{"desc":req.errorInfo});
                    angular.element(".btn_replace_stop").attr("disabled",true).css("background-color","#909090");
                }
            }).error(function(req){
                $.helpTool().errorWarning("",{"desc":"服务器繁忙"})
            })
        }
    });

    //选择代泊车场
    $scope.selectReplacePark=function(){
        $scope.parklist=true;
    }
    //选择车场
    $scope.selectPark=function(parkName,parkId){
        $scope.parkName=parkName;
        $scope.parkId=parkId;
        $scope.parklist=false;
    }

    //立即代泊
    $scope.nowReplace=function(){
        if($scope.plate==""){
            $.helpTool().errorWarning("",{"desc":"请输入车牌号"})
        }else if($scope.plate.length<7){
            $.helpTool().errorWarning("",{"desc":"请输入正确的车牌号"})
        }else if($scope.takeTime==""){
            $.helpTool().errorWarning("",{"desc":"请选择取车时间"})
        }
        else{
            localStorageService.set('userCarNumber',$scope.plate);     //车牌号记录到缓存里
            //创建代泊订单
            antService.getOrderC($scope.customerId,$scope.plate,$scope.parkId,$scope.date.getHour,$scope.takeTime,'0').success(function(req){
                if(req.errorNum=="0"){         //下单成功
                    $scope.dialogBox(req);
                }else if(req.errorNum=="1"){    //下单忙碌中
                    $scope.busyDialoBox(req);
                }else{
                    $.helpTool().errorWarning("",{"desc":req.errorInfo});
                }
            }).error(function(){
                $.helpTool().errorWarning("",{"desc":"服务器繁忙"});
            })
        }

    };
    //下单成功呼出插件
    $scope.dialogBox=function(req){
        angular.element('.dialog_btn_right').showDialog().open({
            'dialogHead':'恭喜您',
            'dialogDesc':'成功订购口袋停代泊业务！',
            'dialogEndTimeTxt':'取车时间为:',            //取车时间描述
            'dialogEndTimeValue':req.data.endTime,      //取车时间
            'preTxt':'预计费用:',                        //预计费用描述
            'PrePrice':req.data.price+'元',             //预计费用
            'relate':'您的车管家联系电话为:',             //联系方式
            'relateTel':req.data.parkerMobile,          //联系电话
            'status':"",                                //状态
            'btn':['取消','查看订单'],                    //按钮
            cancelCallBack:function(){
                angular.element(".dialog_box_content").remove();
            },
            checkOrder:function(status){
                console.log("查看订单");
                angular.element(".dialog_box_content").remove();
                /*$scope.encodeuri=encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/replaceOrder");
                window.location.href =$scope.encodeuri;*/
                /*$location.path("/home/replaceOrder");*/
                $state.go('home.replaceOrder');
            }
        })
    }
    //下单忙碌中呼出插件
    $scope.busyDialoBox=function(req){
        angular.element('.dialog_btn_right').showDialog().open({
            'dialogHeadCorlor':'#B1B1B1',
            'dialogHead':'现在车管家都在忙碌中',
            'dialogDesc':'<div style="color: #5F5F5F">前面等待<span style="color:rgb(58, 213, 184);font-size: 18px">'+req.data.count+'</span>辆车</div>',
            'dialogEndTimeTxt':'预计代泊时间为:',                 //取车时间描述
            'dialogEndTimeValue':'',                             //取车时间
            'preTxt':req.data.startTime,                         //预计费用描述
            'PrePrice':'',                                      //预计费用
            'relate':'请问是否继续下单?',                          //联系方式
            'relateTel':'',                                     //联系电话
            'status':"",                                        //状态
            'btn':['取消','继续'],                               //按钮
            cancelCallBack:function(){
                angular.element(".dialog_box_content").remove();
            },
            checkOrder:function(status){
                console.log("忙碌中");
                antService.getOrderC($scope.customerId,$scope.plate,$scope.parkId,$scope.date.getHour,$scope.takeTime,'1').success(function(req){
                    if(req.errorNum=="0"){
                       $scope.dialogBox(req);
                    }else{
                        $.helpTool().errorWarning("",{"desc":req.errorInfo});
                    }
                }).error(function(){
                    $.helpTool().errorWarning("",{"desc":"服务器繁忙"});
                })
            }
        })
    };
    //关闭停车场列表
    $scope.closeList=function(){
        $scope.parklist=false;
    }
});

//测试页面
myControllers.controller('testCtrl',function($scope,localStorageService,$timeout){
    $scope.localStorageDemo = localStorageService.get('localStorageDemo');
    $scope.userWxCustomerIdSixThree = localStorageService.get('userWxCustomerIdSixThree');
    alert(localStorageService.get('userWxCustomerIdSixThree'));
    $scope.localBtn=function(username,psw){
        $timeout(function(){
            $scope.$apply(function(){
                localStorageService.set('localStorageDemo',username);
                localStorageService.set('userWxCustomerIdSixThree',"linjanix");
                $scope.localStorageDemo = localStorageService.get('localStorageDemo');

            })
        },0);

    }

})
