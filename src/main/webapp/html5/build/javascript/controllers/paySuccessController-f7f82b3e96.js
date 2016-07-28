/**
 * Created by Administrator on 2016/7/15.
 */
'use strict';
var myControllers=angular.module('paySuccessControllers',[]);
myControllers.controller('paySuccessCtrl', function ($scope,$stateParams, paySuccessService,$location) {
    console.log("支付成功");
    $scope.orderId = $location.search().orderId;
    $scope.orderType = $location.search().orderType;
    paySuccessService.orderdetail($scope.orderId,$scope.orderType).success(function(req){
        if(req.errorNum=="0"){
            console.log(req);
            if($scope.orderType=="13" || $scope.orderType=="14"){
                $scope.lt=true;
                $scope.ltCar=false;
                $scope.data=req.order;
                $scope.carNumberStr=[req.order.carNumber.substring(0,2),req.order.carNumber.substring(2,7)];
            }else{
                $scope.lt=false;
                $scope.ltCar=true;
                $scope.data=req.order;
                $scope.carNumberStr=[req.order.carNumber.substring(0,2),req.order.carNumber.substring(2,7)];
            }
        }else
        {
            $.helpTool().errorWarning("",{"desc":req.errorInfo})
        }

    }).error(function(){
        $.helpTool().errorWarning("",{"desc":"请求服务器失败"});
    });

    $scope.closePc=function(){
        window.history.go( -1 );
    };

    $scope.lookPz=function(){
        $location.path("/home/payOrder").search({orderId:$scope.orderId,orderType:$scope.orderType});
    }

});
