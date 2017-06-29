app.service('adPositionService', ['$http', '$q', 'appTools', 'conf', function ($http, $q, appTools, conf) {
  this.queryAdPositions = function (vid, tag) {
    return $q(function (resolve, reject) {
      var url = '/adPosition?vid=' + vid;
      if(tag){
        url  = url + '&tag=' + tag;
      }
      $http.get(url).then(function success(response) {
        var data = response.data;
        if (!appTools.checkResponse(data)) {
          return;
        }
        resolve(data.body);
      }, function fail(err) {
        reject(err);
      });
    });
  };

  this.listAdps = function(tag,brand,pid){
    return $q(function(resolve,reject){
      var url = '/adPosition/list?';
      if(tag !== null && tag !== undefined){
        url = url + '&tag=' + tag;
      }
      if(brand !== null && brand !== undefined){
        url = url + '&brand=' + brand;
      }
      if(pid !== null && pid !== undefined){
        url = url + '&pid=' + pid;
      }
      $http.get(url).then(function(response){
        var data = response.data;
        if(!appTools.checkResponse(data)){
          return
        }
        resolve(data.body);
      },function(err){
        reject(err);
      })
    });
  };

  this.tags = function(){
    return $q(function(resolve,reject){
      var url = '/adPosition/tags';
      $http.get(url).then(function(response){
        var data = response.data;
        if(!appTools.checkResponse(data)){
          return
        }
        resolve(data.body);
      },function(err){
        reject(err);
      });
    });
  }

  this.brands = function(tag){
    return $q(function(resolve,reject){
      var url = '/adPosition/brands';
      if(tag){
        url = url + '?tag=' + tag;
      }
      $http.get(url).then(function(response){
        var data = response.data;
        if(!appTools.checkResponse(data)){
          return
        }
        resolve(data.body);
      },function(err){
        reject(err);
      });
    });
  }

  this.listByPid = function(pid){
    return $q(function(resolve,reject){
      var url = '/adPosition/listByPid?pid='+pid;
      $http.get(url).then(function(response){
        var data = response.data;
        if(!appTools.checkResponse(data)){
          return
        }
        resolve(data.body);
      },function(err){
        reject(err);
      })
    });
  }

  this.addJob = function addJob(pid) {
    return $q(function (resolve,reject) {
      var url = '/adPosition/addJob';
      $http.post(url,{pid:pid}).then(function (response) {
        var data = response.data;
        if(!appTools.checkResponse(data)){
          return
        }
        resolve(data.body);
      },function (err) {
        reject(err);
      });
    })
  }

  this.queryJob = function queryJob(pid) {
    return $q(function (resolve,reject) {
      var url = '/adPosition/queryJob';
      $http.post(url,{pid:pid}).then(function (response) {
        var data = response.data;
        if(!appTools.checkResponse(data)){
          return
        }
        resolve(data.body)
      },function (argument) {
        reject(err);
      });
    });
  }

  this.changeJobPriority = function (jid,level) {
    return $q(function (resolve,reject) {
      var url = '/adPosition/changeJobPriority'
      $http.post(url,{jid:jid,level:level}).then(function (response) {
        var data = response.data;
        if(!appTools.checkResponse(data)){
          return
        }
        resolve(data.body);
      },function (err) {
        reject(err);
      });
    });
  }

}]);
