/**
 * Created by Administrator on 2016/4/13.
 */
'use strict';
var myService=angular.module('antServices',[]);
myService.factory('antService',['$http',function($http){
    return {
        //红包邀请
        getPromoCode: function (promoCode) {
            return $http.get('/wx_share/RedPacket/getRedeemCode/'+promoCode)
        },
        //获取车管家轮播图
        getCarButlerImage:function(){
        	return $http.get('/wx_share/CarButler/getCarButlerImage')
        },
        //违章记录查询 调用聚合数据接口
        getIllegaData:function(city,hphm,engineno,classno){
            /*return $http.jsonp('http://v.juhe.cn/wz/query?dtype=jsonp&callback=JSON_CALLBACK&city=SH&hphm=%E8%8B%8FL50A11&hpzl=02&engineno=123456&classno=&key=909110fd7305195902079f9e48057e42')*/
            return $http.jsonp('http://v.juhe.cn/wz/query?dtype=jsonp&callback=JSON_CALLBACK&city='+city+'&hphm='+encodeURI(hphm)+'&hpzl=02&engineno='+engineno+'&classno='+classno+'&key=909110fd7305195902079f9e48057e42')
        },
        /**
         * 用service实现共享数据，当违章查询记录结果保存到service里，共享出来，提供给其他页面使用
         * @returns {{getVal: Function, setVal: Function}}
         */
          showIllegaData:function(){
            var illegaData={};
            return {
                getVal:function(){return illegaData;},
                setVal:function(result){return illegaData=result;}
            }
        },
        //临停页面查询账单
        getCarList:function(customerId,carNumber){
            return $http.get('/wx_share/Temporary/getCarList/'+customerId+'/'+carNumber);
        },
        //临停获取授权配置
        getWxConfig:function(){
          return $http.get('/wx_share/wxpay/getWxConfig');
        },
        //车管家获取菜单
        getMenu:function(){
          return $http.get('/wx_share/CarButler/getMenu');
        },
        /**
         * 根据地理位置获取附近的停车场
         * @param lng
         * @param lat
         * @returns {HttpPromise}
         */
        getNearPark:function(lng,lat){
        	return $http.get('/wx_share/CarButler/getNearPark/'+lng+'/'+lat);
        },
        /**
         * 汽车内清洗、汽车打蜡、充电
         * @param parkingId  停车场的Id
         * @param srvId      类别的Id
         * @returns {HttpPromise}
         */
        getServeInfo:function(parkingId,srvId){
            return $http.get('/wx_share/CarButler/serveInstruc/'+parkingId+'/'+srvId);
        },
        //临停 通过openId查询customerId
        getCustomerId:function(openId){
            return $http.get('/wx_share/Temporary/postCustomerId/'+openId);
        },
        //可代泊车场
        getCanParkList:function(lng,lat){
            return $http.get('/wx_share/ReplaceStop/canParkList?lng='+lng+"&lat="+lat+"&version="+'1.3.6');
        },
        //代泊 预计取车
        getTakeTimePrice:function(parkingId,startTime,endTime,version){
            return $http.post('/wx_share/ReplaceStop/calcParkPrice?parkingId='+parkingId+'&startTime='+startTime+'&endTime='+endTime+'&version='+version)
        },
        /**
         * 立即代泊 创建代泊订单
         * @param customerId      用户Id
         * @param carNumber       车牌号
         * @param parkingId       车场Id
         * @param startTime       开始时间
         * @param endTime         取车时间
         * @param isContinue      是否继续  初始为0,继续为1
         * @returns {HttpPromise}
         */
        getOrderC:function(customerId,carNumber,parkingId,startTime,endTime,isContinue){
            return $http.get('/wx_share/ReplaceStop/orderc?customerId='+customerId+"&carNumber="+carNumber+"&orderType="+'12'+"&parkingId="+parkingId+"&startTime="+startTime+"&endTime="+endTime+"&isContinue="+isContinue+"&version="+'1.3.7');
        }
    }
}]);
