/**
 * Created with JetBrains WebStorm
 * User: antBrother
 * Date:2016/8/1
 */
var myService=angular.module('reservedParkService',[]);
myService.factory('reservedParkService',['$http',function($http){
    return {
        //可代泊车场
        getCanParkList:function(lng,lat){
            return $http.get('/wx_share/ReplaceStop/canParkList?lng='+lng+"&lat="+lat+"&version="+'1.3.6');
        },
    }
}]);
