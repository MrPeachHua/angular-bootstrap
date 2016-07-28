/**
 * Created by Administrator on 2016/7/14.
 */
'use strict';
var myControllers = angular.module('parkPayControllers', []);
myControllers.controller('parkPayCtrl', function ($scope,$state, $timeout,$location,$stateParams, parkPayService,localStorageService) {
    console.log('停车缴费');

    $scope.openId = localStorageService.get('userWxOpenIdSixThree');
    $scope.customerId = localStorageService.get('userWxCustomerIdSixThree');

    /*$scope.openId="12121";
    $scope.customerId = "2016072100000720";     //用户的Id*/

   // $scope.parkingId = $location.search().parkingId;    // 通过二维码扫描 进入页面
   // $scope.enterType = $location.search().enterType;    //二维码扫描（00）、月租（13）、产权（14）、临停（11）

    if($location.search().parkingId !="" && $location.search().parkingId !=undefined && $location.search().enterType !="" && $location.search().enterType !=undefined ){
        localStorageService.set('parkingId',$location.search().parkingId);
        localStorageService.set('enterType',$location.search().enterType);
    }
    $scope.parkingId = localStorageService.get('parkingId');
    $scope.enterType = localStorageService.get('enterType');




    $scope.type = "";
    switch ($scope.enterType){
        case "00":
            $scope.type="未选中";
            break;
        case  "11":
            $scope.type="临停";
            break;
        case "13":
            $scope.type = "月租";
            break;
        case "14":
            $scope.type = "产权";
            break;
        default :
            $scope.type="未选中";
            break;
    }

    $scope.monthJf = "1";       //  默认1个月
    $scope.carNumber = "";   //默认显示的车牌号


    $scope.data = "";
    $scope.parklist = false;
    $scope.parkName = "";

    $scope.effectEndTime = "";    //月租 当前有效时间
    $scope.price = "";            //月租 单价
    $scope.totalPrice = "";       //月租 订单金额
    $scope.addValidTime = "";     //月租 续费有效期

    $scope.equityEffectEndTime = "";    //产权 当前有效时间
    $scope.equityPrice = "";            //产权 单价
    $scope.equityTotalPrice = "";       //产权 订单金额
    $scope.equityAddValidTime = "";     //产权 续费有效期
    
    $scope.amountPayable ="";        //临停 临停金额
    $scope.beginDate ="";            //临停 入场时间
    $scope.parkingTime ="";          //临停 停车时长

    if($scope.openId =="" || $scope.openId==null ||$scope.customerId=="" || $scope.customerId==null){

        localStorageService.set('parkingId',$location.search().parkingId);
        localStorageService.set('enterType',$location.search().enterType);
        $scope.parkingId = localStorageService.get('parkingId');
        $scope.enterType = localStorageService.get('enterType');
        if($scope.parkingId !="" && $scope.enterType !=""){
            $scope.encodeuri=encodeURI("http://p-share.cn/wx_share/wxpay/getAuthor?backUri=http://p-share.cn/wx_share/wxpay/getCode?directUrl=http://p-share.cn/wx_share/html5/views/index.html%23/home/login&type=parkPay");
            window.location.href =$scope.encodeuri;
            return false;
        }
    }

    $scope.showType = function (tp) {
        switch (tp) {
            case "月租":
                angular.element('.yz').addClass('typeCheck');                            //显示选中的边框样式
                angular.element('.yz').children().filter('img').css("opacity", "1");      //显示右下角 三角行
                angular.element('.yzCq').css("display", 'block');
                angular.element('.equity').css("display", "none");
                angular.element('.lt_main').css("display", 'none');
                break;
            case "产权":
                angular.element('.cq').addClass('typeCheck');
                angular.element('.cq').children().filter('img').css("opacity", "1");
                angular.element('.yzCq').css("display", 'none');
                angular.element('.equity').css("display", "block");
                angular.element('.lt_main').css("display", 'none');
                break;
            case "临停":
                angular.element('.lt').addClass('typeCheck');
                angular.element('.lt').children().filter('img').css("opacity", "1");
                angular.element('.yzCq').css("display", 'none');
                angular.element('.equity').css("display", "none");
                angular.element('.lt_main').css("display", 'block');
                break;
            case "未选中":
                angular.element('.type_comm').removeClass('typeCheck');
                angular.element('.type_img').css("opacity", "0");
                angular.element('.yzCq').css("display", 'block');
                angular.element('.equity').css("display", "none");
                angular.element('.lt_main').css("display", 'none');
                break;
            default :
                break;
        }
    }
    $scope.showType($scope.type);
    //选择类型
    $scope.selectType = function (event, befEle, AftEle, type) {
        var _this = event.currentTarget;
        angular.element('.' + befEle).removeClass('' + AftEle);
        angular.element('.type_img').css("opacity", "0");
        angular.element(_this).addClass('' + AftEle);
        angular.element(_this).children().filter('img').css("opacity", "1");
        $scope.showType(type);

        $timeout(function () {
            $scope.$apply(function () {
                $scope.monthJf = 1;
                $scope.totalPrice=$scope.price;
                $scope.equityTotalPrice=$scope.equityPrice;
                if($scope.enterType=="13"){      //月租
                    if ($scope.effectEndTime != undefined && $scope.effectEndTime != "") {
                        var d = $scope.effectEndTime;
                        var n = $scope.monthJf;
                        var eDate = $scope.addMonth(d, n);
                        console.log(eDate.getFullYear() + '-' + (eDate.getMonth() + 1) + '-' + eDate.getDate());
                        $scope.addValidTime = eDate.getFullYear() + '/' + (eDate.getMonth() + 1) + '/' + eDate.getDate();   //续费有效日期
                    }
                    $scope.amountPayable ="";        //临停 临停金额
                    $scope.beginDate ="";            //临停 入场时间
                    $scope.parkingTime ="";          //临停 停车时长
                }else if($scope.enterType=="14"){    //产权

                    if ($scope.equityEffectEndTime != undefined && $scope.equityEffectEndTime != "") {
                        var d = $scope.equityEffectEndTime;
                        var n = $scope.monthJf;
                        var eDate = $scope.addMonth(d, n);
                        console.log(eDate.getFullYear() + '-' + (eDate.getMonth() + 1) + '-' + eDate.getDate());
                        $scope.equityAddValidTime = eDate.getFullYear() + '/' + (eDate.getMonth() + 1) + '/' + eDate.getDate();   //续费有效日期
                    }
                    $scope.amountPayable ="";        //临停 临停金额
                    $scope.beginDate ="";            //临停 入场时间
                    $scope.parkingTime ="";          //临停 停车时长
                }else if ($scope.enterType=="11"){   //临停
                    $scope.amountPayable = $scope.amountPayable;        //临停 临停金额
                    $scope.beginDate =$scope.amountPayable;            //临停 入场时间
                    $scope.parkingTime =$scope.parkingTime;          //临停 停车时长
                }

            });
        }, 0);
    };


    //自定义格式化日期
    $scope.dateToDate = function (date) {
        var sDate = new Date(date);
        if (typeof date == 'object'
            && typeof new Date().getMonth == "function"
        ) {
            sDate = date;
        }
        else if (typeof date == "string") {
            var arr = date.split('-')
            if (arr.length == 3) {
                sDate = new Date(arr[0] + '-' + arr[1] + '-' + arr[2]);
            }
        }

        return sDate;
    };
    //月份加加或者减减
    $scope.addMonth = function (date, num) {
        num = parseInt(num);
        var sDate = $scope.dateToDate(date);

        var sYear = sDate.getFullYear();
        var sMonth = sDate.getMonth() + 1;
        var sDay = sDate.getDate();

        var eYear = sYear;
        var eMonth = sMonth + num;
        var eDay = sDay;
        while (eMonth > 12) {
            eYear++;
            eMonth -= 12;
        }
        var eDate = new Date(eYear, eMonth - 1, eDay);

        while (eDate.getMonth() != eMonth - 1) {
            eDay--;
            eDate = new Date(eYear, eMonth - 1, eDay);
        }
        return eDate;
    };


    //减
    $scope.reduceMonth = function (price) {

        if (parseInt(price) == 1) {
            return false;
        } else {
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.monthJf = parseInt(price) - 1;

                    if($scope.enterType=="13"){     //月租
                        var d = $scope.effectEndTime;
                        var n = $scope.monthJf;
                        var eDate = $scope.addMonth(d, n);
                        console.log(eDate.getFullYear() + '-' + (eDate.getMonth() + 1) + '-' + eDate.getDate());
                        $scope.addValidTime = eDate.getFullYear() + '/' + (eDate.getMonth() + 1) + '/' + eDate.getDate();   //续费有效日期

                        //订单金额随月份变化
                        $scope.totalPrice = parseInt($scope.price) * $scope.monthJf;
                    }else if($scope.enterType=="14"){   //产权
                        var d = $scope.equityEffectEndTime;
                        var n = $scope.monthJf;
                        var eDate = $scope.addMonth(d, n);
                        console.log(eDate.getFullYear() + '-' + (eDate.getMonth() + 1) + '-' + eDate.getDate());
                        $scope.equityAddValidTime = eDate.getFullYear() + '/' + (eDate.getMonth() + 1) + '/' + eDate.getDate();   //续费有效日期

                        //订单金额随月份变化
                        $scope.equityTotalPrice = parseInt($scope.equityPrice) * $scope.monthJf;
                    }
                });
            }, 0);
        }
    };
    //加
    $scope.plusMonth = function (price) {
        if (parseInt(price) >= 12) {
            return false;
        } else {
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.monthJf = parseInt(price) + 1;

                    if($scope.enterType=="13"){     //月租
                        var d = $scope.effectEndTime;
                        var n = $scope.monthJf;
                        var eDate = $scope.addMonth(d, n);
                        console.log(eDate.getFullYear() + '-' + (eDate.getMonth() + 1) + '-' + eDate.getDate());
                        $scope.addValidTime = eDate.getFullYear() + '/' + (eDate.getMonth() + 1) + '/' + eDate.getDate();   //续费有效日期

                        //订单金额随月份变化
                        $scope.totalPrice = parseInt($scope.price) * $scope.monthJf;
                    }else if($scope.enterType=="14"){   //产权
                        var d = $scope.equityEffectEndTime;
                        var n = $scope.monthJf;
                        var eDate = $scope.addMonth(d, n);
                        console.log(eDate.getFullYear() + '-' + (eDate.getMonth() + 1) + '-' + eDate.getDate());
                        $scope.equityAddValidTime = eDate.getFullYear() + '/' + (eDate.getMonth() + 1) + '/' + eDate.getDate();   //续费有效日期

                        //订单金额随月份变化
                        $scope.equityTotalPrice = parseInt($scope.equityPrice) * $scope.monthJf;
                    }

                });
            }, 0);
        }
    };
    //协议
    $scope.agree = function (elem) {
        var agr = angular.element('.' + elem).attr('checked');
        if (agr == "checked") {
            angular.element('.' + elem).attr('checked', false);
            angular.element('.checkImg').attr('src', '../images/disagree.png');
        } else if (agr == undefined) {
            angular.element('.' + elem).attr('checked', true);
            angular.element('.checkImg').attr('src', '../images/agree.png');
        }
    }
    //支付
    $scope.nowReplace = function () {
        var agr = angular.element('.agreeCheck').attr('checked');
        if (agr == "checked") {    //选择了同意协议

            var carNumber_val = angular.element('.carNumber').val();
            if (carNumber_val.length != "7") {
                layer.open({
                    content: '<h5 style="font-weight: bold">提示!</h5>车牌号码不正确',
                    style: 'width:100%;text-align:center',
                    btn: ['确认']
                });
                return false;
            }

                console.log("缴费类型:"+$scope.enterType);
            if($scope.enterType !=angular.element('.typeCheck').attr('data_val')){
                layer.open({
                    content: '<h5 style="font-weight: bold">请检查缴费类型!</h5>请检查缴费类型选择是否正确',
                    style: 'width:100%;text-align:center',
                    btn: ['确认']
                });
                return false;
            }

            var beginDate="2016/01/01";
            if($scope.enterType=="13"){
                beginDate=$scope.effectEndTime;
            }else if($scope.enterType=="14"){
                beginDate=$scope.equityEffectEndTime;
            }
            $.helpTool().loading().open();
            parkPayService.orderc($scope.parkingId,$scope.customerId,$scope.carNumber,$scope.enterType,beginDate,$scope.monthJf).success(function(req){
                $.helpTool().loading().close();
                if(req.errorNum=="0"){
                    console.log("创建订单:"+req);





                    //获取授权配置参数
                    parkPayService.getWxConfig().success(function(data){
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
                                    money:req.order.amountPaid,
                                    body: "口袋停临停",
                                    openId: $scope.openId,
                                    orderNo:req.order.orderId,
                                    notify_url:"http://www.p-share.com/share/payment/wechat/backpay_"+req.order.orderType
                                },
                                success: function(data){
                                    wx.chooseWXPay({
                                        timestamp: data.timeStamp,
                                        nonceStr: data.nonceStr,
                                        package: data.package,
                                        signType: 'MD5',
                                        paySign: data.sign,
                                        success: function () {
                                           /* alert("支付成功");*/
                                            // 支付成功后的回调函数
                                           /* $location.path("/home/paySuccess").search({'orderId':req.order.orderId,'orderType':$scope.enterType});*/
                                            window.location.href="http://p-share.cn/wx_share/html5/views/index.html#/home/paySuccess?orderId="+req.order.orderId+"&orderType="+$scope.enterType;
                                        },
                                        fail: function() {
                                        }
                                    });
                                },
                                complete: function() {
                                },
                                error:function(){
                                }
                            });
                        });
                        //授权失败
                        wx.error(function() {
                        })
                    })
                }else{
                    $.helpTool().errorWarning("",{"desc":req.errorInfo});
                    $scope.removeError();
                }
            }).error(function(){
                $.helpTool().loading().close();
                $.helpTool().errorWarning("",{"desc":"请求服务失败"});
                $scope.removeError();
            });
        } else if (agr == undefined) {
            layer.open({
                content: '<h5 style="font-weight: bold">请同意协议!</h5>请对我们的协议进行阅读',
                style: 'width:100%;text-align:center',
                btn: ['确认']
            });
        }
    }
    //获取车场列表和车牌号码
    $scope.dataParkingList = function (parkingId,carNumber,noneCar) {
        $.helpTool().loading().open();
        var tp=$scope.enterType;
         if(noneCar =='2') {
             tp=$location.search().enterType;
         }
        parkPayService.getDataByScanOrMenu(parkingId, $scope.customerId, tp ,carNumber).success(function (req) {
            $.helpTool().loading().close();
            console.log(req);
            if (req.errorNum == "0") {

                $timeout(function () {
                    $scope.$apply(function () {
                        $scope.data = req.data;
                    })
                },0);


                if (req.data.length != 0) {
                    //通过二维码扫描入口 进入页面
                        for (var i = 0; i < req.data.length; i++) {

                            if(noneCar !='2') {
                                //判断需要显示的车场
                                if (req.data[i].flag == "1") {
                                    $timeout(function () {
                                        $scope.$apply(function () {
                                            $scope.parkName = req.data[i].parkingName;
                                            $scope.parkingId = req.data[i].parkingId;
                                        });
                                    }, 0);
                                    console.log("flog:" + 1);
                                    //判断要显示的车牌号   只有一个车牌号码默认显示
                                    if (req.data[i].carNumList.length == 1) {
                                        $timeout(function () {
                                            $scope.$apply(function () {
                                                $scope.carNumber = req.data[i].carNumList[0];
                                                //获取缴费类型
                                                $scope.getOrderType(req.data[i].parkingId, $scope.customerId, $scope.carNumber);
                                            });
                                        }, 0);
                                    } else {
                                        //  有多个车牌号码则显示请输入车牌号
                                        $timeout(function () {
                                            $scope.$apply(function () {
                                                $scope.carNumber = "";        //车牌号码
                                                $scope.effectEndTime = "";    //当前有效时间
                                                $scope.price = "";            //单价
                                                $scope.totalPrice = "";       //订单金额
                                                $scope.addValidTime = "";     //续费有效期
                                                $scope.showType("未选中");          //未选中状态
                                            });
                                        }, 0);
                                    }

                                    break;
                                }
                            }

                        }

                }

            }
        }).error(function () {
            $.helpTool().loading().close();
            $.helpTool().errorWarning("", {"desc": "请求服务器失败"});
            $scope.removeError();
        });
    };




    //获取缴费类型  绑定有效时间、月租单价、续费时长、续费有效期、订单金额、进场时间、停车时长、
    $scope.getOrderType = function (parkingId, customerId, carNumber) {
        $.helpTool().loading().open();
        parkPayService.getOrderData(parkingId, customerId, carNumber).success(function (req) {
          /*  $scope.dataParkingList(parkingId,carNumber,'2');    //根据车牌号获取车场列表*/
            if (req.errorNum == "0") {
                $.helpTool().loading().close();
                console.log(req.data);
                angular.element('.type_comm').removeClass('typeCheck');
                angular.element('.type_img').css("opacity", "0");
                $timeout(function(){
                    $scope.$apply(function(){
                        $scope.enterType=req.data.orderType;
                        $scope.carNumber=carNumber;
                    })
                },0);
                switch (req.data.orderType) {
                    case "13":
                        $scope.showType("月租");
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.effectEndTime = req.data.data.effectEndTime;        // 月租 当前有效时间
                                $scope.price = req.data.data.price;                        // 月租 单价
                                $scope.totalPrice = req.data.data.price;                   // 月租 订单金额
                                if ($scope.effectEndTime != undefined && $scope.effectEndTime != "") {
                                    var d = $scope.effectEndTime;
                                    var n = $scope.monthJf;
                                    var eDate = $scope.addMonth(d, n);
                                    console.log(eDate.getFullYear() + '-' + (eDate.getMonth() + 1) + '-' + eDate.getDate());
                                    $scope.addValidTime = eDate.getFullYear() + '/' + (eDate.getMonth() + 1) + '/' + eDate.getDate();   //续费有效日期

                                }
                            });
                        }, 0);
                        break;
                    case "14":
                        $scope.showType("产权");
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.equityEffectEndTime = req.data.data.effectEndTime;        // 产权 当前有效时间
                                $scope.equityPrice = req.data.data.price;                        // 产权 单价
                                $scope.equityTotalPrice = req.data.data.price;                   // 产权 订单金额
                                if ($scope.equityEffectEndTime != undefined && $scope.equityEffectEndTime != "") {
                                    var d = $scope.equityEffectEndTime;
                                    var n = $scope.monthJf;
                                    var eDate = $scope.addMonth(d, n);
                                    console.log(eDate.getFullYear() + '-' + (eDate.getMonth() + 1) + '-' + eDate.getDate());
                                    $scope.equityAddValidTime = eDate.getFullYear() + '/' + (eDate.getMonth() + 1) + '/' + eDate.getDate();   //续费有效日期

                                }
                            });
                        }, 0);
                        break;
                    case "11":
                        $scope.showType("临停");
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.amountPayable = req.data.data.amountPayable;        //临停 临停金额
                                $scope.beginDate = req.data.data.beginDate;                //临停 入场时间
                                $scope.parkingTime = req.data.data.parkingTime;            //临停 停车时长
                            });
                        }, 0);
                        break;
                    default :
                        break;
                };
            } else {
                $.helpTool().loading().close();

                $timeout(function () {
                    $scope.$apply(function () {
                        $scope.showType("未选中");          //未选中状态

                        $scope.effectEndTime = "";    //月租 当前有效时间
                        $scope.price = "";            //月租 单价
                        $scope.totalPrice = "";       //月租 订单金额
                        $scope.addValidTime = "";     //月租 续费有效期


                        $scope.equityEffectEndTime = "";    //产权 当前有效时间
                        $scope.equityPrice = "";            //产权 单价
                        $scope.equityTotalPrice = "";       //产权 订单金额
                        $scope.equityAddValidTime = "";     //产权 续费有效期

                        $scope.amountPayable ="";        //临停 临停金额
                        $scope.beginDate ="";            //临停 入场时间
                        $scope.parkingTime ="";          //临停 停车时长
                    });
                }, 0);

                layer.open({
                    content: '<h5 style="font-weight: bold">提示!</h5>'+req.errorInfo+'',
                    style: 'width:100%;text-align:center',
                    btn: ['确认']
                });
            }
        }).error(function () {
            $.helpTool().loading().close();
            $.helpTool().errorWarning("", {"desc": "请求服务器失败"});
            $scope.removeError();

        });
    };
    $scope.dataParkingList($scope.parkingId,$scope.carNumber);


    //选择停车场
    $scope.selectPark = function (parkingName, parkingId) {
        $scope.parklist = false;
        $timeout(function () {
            $scope.$apply(function () {
                $scope.parkName = parkingName;
                $scope.parkingId = parkingId;
            });
        }, 0);
       /* $scope.dataParkingList(parkingId);*/
        var carNumber_val = angular.element('.carNumber').val();
        if (carNumber_val.length == "7") {
            $scope.getOrderType(parkingId, $scope.customerId, carNumber_val);
        }
    };

    //输入车牌号码获取 缴费类型
    $scope.onInputCarNumber = function () {
        var carNumber_val = angular.element('.carNumber').val();
        if (carNumber_val.length == "7") {
            $scope.dataParkingList($scope.parkingId,carNumber_val,'2');
            $scope.getOrderType($scope.parkingId, $scope.customerId, carNumber_val);

        }else if(carNumber_val.length >7){
            layer.open({
                content: '<h5 style="font-weight: bold">提示!</h5>车牌号码不正确',
                style: 'width:100%;text-align:center',
                btn: ['确认']
            });
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.showType("未选中");          //未选中状态
                    $scope.effectEndTime = "";    //月租 当前有效时间
                    $scope.price = "";            //月租 单价
                    $scope.totalPrice = "";       //月租 订单金额
                    $scope.addValidTime = "";     //月租 续费有效期

                    $scope.equityEffectEndTime = "";    //产权 当前有效时间
                    $scope.equityPrice = "";            //产权 单价
                    $scope.equityTotalPrice = "";       //产权 订单金额
                    $scope.equityAddValidTime = "";     //产权 续费有效期

                    $scope.amountPayable ="";        //临停 临停金额
                    $scope.beginDate ="";            //临停 入场时间
                    $scope.parkingTime ="";          //临停 停车时长
                });
            },0);

        } else {
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.showType("未选中");          //未选中状态
                    $scope.effectEndTime = "";    //月租 当前有效时间
                    $scope.price = "";            //月租 单价
                    $scope.totalPrice = "";       //月租 订单金额
                    $scope.addValidTime = "";     //月租 续费有效期

                    $scope.equityEffectEndTime = "";    //产权 当前有效时间
                    $scope.equityPrice = "";            //产权 单价
                    $scope.equityTotalPrice = "";       //产权 订单金额
                    $scope.equityAddValidTime = "";     //产权 续费有效期

                    $scope.amountPayable ="";        //临停 临停金额
                    $scope.beginDate ="";            //临停 入场时间
                    $scope.parkingTime ="";          //临停 停车时长
                });
            }, 0);
        }

    };

    $scope.selectReplacePark = function () {
        $scope.parklist = true;
    };
    $scope.closeList = function () {
        $scope.parklist = false;
    };

    //销毁错误提示
    $scope.removeError=function(){
        $timeout(function(){
            angular.element('#error_waring').remove();
        },1000)
    }
});
