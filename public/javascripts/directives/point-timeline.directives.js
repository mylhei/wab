'use strict';
angular.module('app').directive('pointTimeLine', [function() {
    return {
        restrict: 'AE',
        templateUrl: 'tpl/pointTimeLine.html',
        replace: true,
        scope: {
          in:"@",
          videotime:"@",
          filtertag:"@",
          out:"="
        },
        controller: ["$scope", "$http", 'toaster', '$modal', function($scope, $http, toaster, $modal) {
          if($scope.in){
            var tagList = JSON.parse($scope.in).tag_list;
            $scope.tagList = tagList.map(function(tag){
              tag.ad_list = tag.ad_list.map(function(ad){
                ad.time_precent = ad.start_time / 1000 / $scope.videotime * 100;
                return ad;
              });
              return tag;
            });
          }
          
          $scope.click = function(tagindex,adindex){
            //清空已打的点
            var cleanMask = function(){
              var dragsaold= document.getElementById("dragsa");
              if(dragsaold){
                dragsaold.parentNode.removeChild(dragsaold);
              }
            }
            cleanMask();
            $scope.tagList[tagindex].ad_list.forEach(function(item){
              item.active = false;
            });
            $scope.tagList[tagindex].ad_list[adindex].active = true;
            var player = document.getElementById('Player');
            $scope.out = $scope.tagList[tagindex].ad_list[adindex];
            player.seekTo($scope.out.start_time / 1000);
            //重新打点
            var drag = function(x,y){
              mask.creatDrag(x,y);
            }
            //如果没有打点信息怎么办
            try{
              var x = $scope.tagList[tagindex].ad_list[adindex].info_list[0].x;
              var y = $scope.tagList[tagindex].ad_list[adindex].info_list[0].y;
              if($scope.tagList[tagindex].ad_list[adindex].common_pos_p){
                x = $scope.tagList[tagindex].ad_list[adindex].common_pos_p.x;
                y = $scope.tagList[tagindex].ad_list[adindex].common_pos_p.y;
              }
              drag(x,y);
            }catch(err){
              console.log(err);
            }
            

          }

          $scope.$watch('in',function(newValue,oldValue){
            if(newValue){
              var tagList = JSON.parse($scope.in).tag_list;
              $scope.tagList = tagList.map(function(tag){
                tag.ad_list = tag.ad_list.map(function(ad){
                  ad.time_precent = ad.start_time / 1000 / $scope.videotime * 100;
                  return ad;
                });
                return tag;
              });
              $scope.tagList = $scope.tagList.filter(function(tag){
              if($scope.filtertag){
                return tag.tag == $scope.filtertag;
              }else{
                return true;
              }              
            });

              console.log('=========');
              console.log($scope.tagList.length);

            }
            
          });
        }],
        link: function(scope, element, attrs, controller) {
            scope.attrs = attrs;
        }
    };
}]);
