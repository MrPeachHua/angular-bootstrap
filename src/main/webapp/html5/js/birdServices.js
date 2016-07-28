/**
 * Created by Administrator on 2016/4/13.
 */
'use strict';
var myService=angular.module('birdServices',[]);
myService.factory('birdService',['$http',function($http){
    return {
        getPromoCode: function (customerId) {
            return $http.get('/wx_share/share/getRedeem/'+customerId)           
        },
        receiveCouponByCount:function(customer_id,ruleId){
        	return $http.get('/wx_share/share/receiveCouponByCount/'+customer_id+'/'+ruleId)
        },
        //注册
        register:function(phone,paw,code,openId){
            return $http.post('/wx_share/Register/postRegister/'+phone+'/'+paw+'/'+code+'/'+openId);
        },
        //获取验证码
        getCode:function(phone){
            return $http.get('/wx_share/Register/sendSmsCode/'+phone);
        },
        //登录
        login:function(phone,pwd,openId){
        	return $http.post("/wx_share/Register/postLogin/"+phone+'/'+pwd+'/'+openId);
        },
        //微信支付获取openId
        getOpenId:function(code){
          return $http.get("/wx_share/wxpay/getOpenId?code="+code);
        },
        //洗车订单记录
        getCarwashList:function(customerId, orderStatus, pageIndex){
            return $http.get('/wx_share/Order/CarwashList/'+customerId+'/' + orderStatus + '/' + pageIndex);
        },
        //取消洗车订单
        cancelCarwashList:function(orderId, orderType){
            return $http.get('/wx_share/Order/Cancel/'+orderId+'/' + orderType);
        },
        //租车
        rentCar:function() {
            return $http.get('/wx_share/Order/rentCar');
        },
        //代泊订单列表
        getQueryParkerById:function(customerId,carNumber){
            return $http.get('/wx_share/ReplaceOrder/queryParkerById?customerId='+customerId+"&carNumber="+carNumber+"&version="+"1.3.7");
        },
        //代泊订单 取消代泊
        getCancelOrder:function(orderId){
            return $http.get('/wx_share/ReplaceOrder/cancelOrder?orderId='+orderId);
        },
        //代泊订单取车
        gettingCar:function(orderId){
            return $http.get('/wx_share/ReplaceOrder/gettingCar?orderId='+orderId+"&version="+'1.3.7');
        },
         //代泊订单评价
        orderAssess:function(customerId,orderId,commentType,commentLevel,commentContent) {
            return $http.post('/wx_share/daibo/orderAssess?customerId='+customerId+'&orderId='+orderId+'&commentType='+commentType+'&commentLevel='+commentLevel+'&commentContent='+commentContent);
        }
    }
}]);
