/**
 * Created with JetBrains WebStorm
 * User: antBrother
 * Date:2016/8/1
 */
var myController=angular.module('reservedParkController',[]);
myController.controller('reservedParkCtrl',function($scope,reservedParkService,$timeout){
    console.log("预约停车");
    //上拉刷新
    $timeout(function(){
        $scope.$watch('$viewContentLoaded',function(){
            var myScroll,
                upIcon = $("#up-icon"),
                downIcon = $("#down-icon");

            myScroll = new IScroll('#wrapper', { probeType: 3, mouseWheel: true });
            myScroll.on("scroll",function(){
                var y = this.y,
                    maxY = this.maxScrollY - y,
                    downHasClass = downIcon.hasClass("reverse_icon"),
                    upHasClass = upIcon.hasClass("reverse_icon");

                if(y >= 40){
                    !downHasClass && downIcon.addClass("reverse_icon");
                    return "";
                }else if(y < 40 && y > 0){
                    downHasClass && downIcon.removeClass("reverse_icon");
                    return "";
                }

                if(maxY >= 40){
                    !upHasClass && upIcon.addClass("reverse_icon");
                    return "";
                }else if(maxY < 40 && maxY >=0){
                    upHasClass && upIcon.removeClass("reverse_icon");
                    return "";
                }
            });
            myScroll.on("slideUp",function(){
                if(this.maxScrollY - this.y > 40){
                    console.log("slideUp");
                    upIcon.removeClass("reverse_icon")
                }
            });
        });
    },1000);
});
