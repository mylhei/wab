/**
 * Created by coolcao on 16/8/18.
 */

app.service('apiService',['$http','$q','appTools','conf',function ($http,$q,appTools,conf) {

    /**
     * platforms
     * @returns Promise
     */
    this.getPlatforms = function () {
        return $q(function (resolve,reject) {
            $http.get('/api/get_platforms').then(function onSuccess(response) {
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return;
                }
                resolve(data.body);

            },function onError(err) {
                reject(err);
            });
        });
    };

    /**
     * ---------------
     *     广告 AD
     * ---------------
     */

    /**
     *  获取广告列表
     * @param platform
     * @returns Promise
     */
    this.getAdsByPlatform = function (platform) {
        return $q(function (resolve,reject) {
            $http.get('/api/get_ads/' + platform).then(function (response) {
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return
                }
                var ads = data.body;
                resolve(ads);
            },function (err) {
                reject(err);
            });
        });
    };

    /**
     * 根据广告id获取广告信息
     * @param id
     * @returns {Promise}
     */
    this.getAd = function (id) {
        return new Promise(function (resolve,reject) {
            $http.get('/api/get_ad/'+id).then(function (response) {
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return
                }
                var ad = data.body[0];
                resolve(ad);
            },function (err) {
                reject(err);
            });
        });
    }

    /**
     * 获取视频流
     * @param limit
     * @returns Promise
     */
    this.getStreams = function (limit) {
        limit = limit || conf.PAGINATION.LIMIT;
        return $q(function (resolve,reject) {
            $http.get('/api/get_streams/?limit=' + limit).then(function (response) {
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return
                }
                var streams = data.body;
                resolve(streams);
            },function (err) {
                reject(err);
            });
        });
    };

    /***
     * 获取专辑列表
     * @param limit
     * @returns {*}
     */
    this.getAlbums = function (key,limit) {
        limit = limit || conf.PAGINATION.LIMIT;
        var url = '/api/get_albums/';
        if(key){
            url = url + key;
        }
        return $q(function (resolve,reject) {
            $http({url:url,method:'GET',params:{limit:limit}}).then(function (response) {
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return
                }
                var albums = data.body;
                resolve(albums);
            },function (err) {
                reject(err);
            });
        });
    };


    /***
     * 获取视频列表
     * @param limit
     * @returns {*}
     */
    this.getVideos = function (key,limit) {
        limit = limit || conf.PAGINATION.LIMIT;
        var params = {limit:limit};
        var url = '/api/get_videos';
        if(key){
            url = url + '/' + key;
        }

        return $q(function (resolve,reject) {
            $http.get(url,{params:params}).then(function (response) {
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return
                }
                var videos = data.body;
                resolve(videos);
            },function (err) {
                reject(err);
            });
        });
    };


    /**
     * 根据专辑id或视频id获取相应的专辑或视频
     * @param aids
     * @param vids
     * @returns {*}
     */
    this.get_video_album_batch = function(aids,vids) {
        if(angular.isArray(aids) && angular.isArray(vids)){
            return new Promise(function (resolve,reject) {
                $http.get('/api/get_video_album_batch?aids='+aids.join()+"&vids="+vids.join()).then(function onSuccess(response) {
                    var data = response.data;
                    if(!appTools.checkResponse(data)){
                        return
                    }
                    var result = data.body;
                    resolve(result);
                },function onError(err) {
                    reject(err);
                });
            });
        }else{
            return Promise.reject({code:conf.ERRORS.ARGUMENTS_ERROR,message:'参数错误，adis或vids必须为数组'});
        }
    };


    /**
     * 获取创意模板列表
     * @param platform
     * @returns {Promise}
     */
    this.getCreatives = function getCreatives(platform) {
        return new Promise(function (resolve,reject) {
            $http.get('/api/get_creatives/'+platform).then(function (response) {
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return
                }
                var creates = data.body;
                resolve(creates);
            },function (err) {
                reject(err);
            });
        });
    };

    this.getStreamNamesById = function (id) {
        return $q(function (resolve,reject) {
            $http.get('/api/get_stream_names_by_id?id='+id).then(function (response) {
                var data = response.data;
                if(!appTools.checkResponse(data)){
                    return
                }
                var stream_names = data.body;
                resolve(stream_names);
            },function (err) {
                reject(err);
            });
        });
    }

}]);
