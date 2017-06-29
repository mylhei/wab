'use strict'

const request = require('request');
const AdPosition = require('../model/AdPosition.js');
const videoService = require('./videoService.js');
const MongoClient = require('mongodb').MongoClient;


const featchAdPosition = (vid, tag = 'car') => {
  let adInfoHost = 'http://10.112.33.125:20032/query_adinfo.php'
  let adInfoUrl = adInfoHost + '?vid=' + vid + '&tag=' + tag
  return new Promise((resolve, reject) => {
    console.log(adInfoUrl);
    request(adInfoUrl, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        if (typeof body == 'string') {
          console.log(body);
          try {
            body = JSON.parse(body)
            if (body.errcode == 1000) {
              resolve(body)
            } else {
              reject(body.errmsg);
            }
          } catch (error) {
            reject(error)
          }
        }
        resolve(body)
      }
    })
  })
}

const queryAdPosition = function(vid, tag = 'car') {
  return (new AdPosition()).queryByVidAndTag(vid, tag).then(function(adPosition) {
    if (adPosition) {
      return adPosition;
    } else {
      return module.exports.featchAdPosition(vid, tag).then(function(adPosition) {
        console.log(adPosition);
        adPosition.tag = adPosition.tag_list && adPosition.tag_list[0].tag;
        adPosition.title = unescape(adPosition.title.replace(/\\u/g, '%u'));
        let _adPosition = new AdPosition(adPosition);
        //将common_pos解析为对象
        _adPosition.tag_list.forEach(function(tag) {
          tag.ad_list.forEach(function(ad) {
            let cp = ad.common_pos.replace('(', '').replace(')', '').split(',');
            //过滤掉公共点都为0的，取第一帧的顶点
            if (Number.parseFloat(cp[0]) !== 0 || Number.parseFloat(cp[1]) !== 0) {
              ad.common_pos_p = {
                x: cp[0],
                y: cp[1]
              };
            }

          });
        });
        _adPosition.insert();
        return adPosition;
      });
    }
  });

}

const searchByOpt = ({
  pid,
  vid,
  tag,
  brand
}) => {
  let opt = Object.create(null);
  let optTags = Object.create(null);
  if (pid !== null && pid !== undefined) {
    opt.pid = pid;
  }
  if (vid !== null && vid !== undefined) {
    opt.vid = vid;
  }
  if (brand !== null && brand !== undefined) {
    opt['tag_list.ad_list.brand'] = brand;
  }
  if (tag !== null && tag !== undefined) {
    opt['tag_list.tag'] = tag;
  }
  // opt.tag = tag;
  console.log(opt);
  let query = AdPosition.find(opt)
  return new Promise((resolve, reject) => {
    query.exec().then(list => {
      //根据brand过滤广告位
      if (brand !== null && brand !== undefined) {
        list.forEach(item => {

          for (let i = 0; i < item['tag_list'].length; i++) {
            item['tag_list'][i]['ad_list'] = item['tag_list'][i]['ad_list'].filter(item => {
              return item.brand == brand;
            });
          }

        })
      }
      resolve(list);
    }).catch(err => {
      reject(err);
    });
  });
}


//聚合所有专辑的信息
const reduceList = ({
  pid,
  vid,
  tag,
  brand
}) => {

  let searchPromise = searchByOpt({
    pid,
    vid,
    tag,
    brand
  });
  return new Promise((resolve, reject) => {
    console.time('search');
    searchPromise.then(list => {
      console.timeEnd('search');
      console.time('reduce');
      let re = list.reduce((pre, current) => {
        let currentIndex = pre.findIndex(item => {
          return item.pid == current.pid;
        })

        //如果结果中已存在该专辑
        if (~currentIndex) {
          pre[currentIndex].count++;

          current['tag_list'].forEach(item => {
            pre[currentIndex].adps += item['ad_list'].length;
          })

          //使用set处理tag，然后再将其转换为数组
          pre[currentIndex].tags.push(...current.tag.split(','));
          let tags_set = new Set(pre[currentIndex].tags);
          pre[currentIndex].tags = [];
          for (let v of tags_set.values()) {
            pre[currentIndex].tags.push(v);
          }
          // pre[currentIndex].tags.add(current.tag);
        } else {
          let obj = Object.create(null);
          obj.count = 1;
          obj.adps = 0;
          obj.pid = current.pid;

          current['tag_list'].forEach(item => {
            obj.adps += item['ad_list'].length;
          });

          let tags_set = new Set([...current.tag.split(',')]);
          // tags_set.add(current.tag);
          let setIter = tags_set.values();
          obj.tags = [];
          for (let v of setIter) {
            obj.tags.push(v);
          }
          pre.push(obj);
        }
        return pre;
      }, []);
      console.timeEnd('reduce');

      //循环获取相应的专辑名称
      let promises = [];
      re.forEach(item => {
        promises.push(videoService.queryalbumByPid(item.pid));
      })
      Promise.all(promises).then(result => {
        for (let i = 0; i < re.length; i++) {
          re[i].album_name = result[i].name;
        }
        resolve(re);
      }).catch(err => {
        reject(err);
      })
    }).catch(err => {
      reject(err);
    })
  })
}

//获取所有品牌列表
const getBrands = ({
  pid,
  vid,
  tag
}) => {
  let query = Object.create(null);
  if (pid) {
    query.pid = pid;
  }
  if (vid) {
    query.vid = vid;
  }
  if (tag) {
    query['tag_list.tag'] = tag;
  }

  return new Promise((resolve, reject) => {
    searchByOpt(query).then(list => {
      let set = new Set();
      if (tag) {
        list.forEach(item => {
          item['tag_list'].forEach(item => {
            if (item.tag == tag) {
              item.ad_list.forEach(item => {
                set.add(item.brand);
              });
            }
          });
        });
      } else {
        list.forEach(item => {
          item['tag_list'].forEach(item => {
            item['ad_list'].forEach(item => {
              set.add(item.brand);
            });
          });
        })
      }
      resolve([...set]);
    }).catch(err => {
      reject(err);
    });
  });

}

//获取所有标签列表
const getTags = ({
  pid,
  vid
}) => {
  let query = Object.create(null);
  if (pid) {
    query.pid = pid;
  }
  if (vid) {
    query.vid = vid;
  }
  return AdPosition.collection.distinct('tag_list.tag', query);
}

const listByPid = (pid) => {
  return new Promise((resolve, reject) => {
    if (pid) {
      searchByOpt({
        pid: pid
      }).then(result => {
        resolve(result);
      }).catch(err => {
        reject(err);
      });
    } else {
      reject('参数错误，pid不能为空');
    }
  })
}

const addJob = (pid, level = 0) => {
  return new Promise((resolve, reject) => {
    if (pid) {
      request.get(`http://10.112.33.125:20032/taskserver/AddJobByPid?pid=${pid}&level=${level}`, (err, response, body) => {
        if (err) reject(err);
        if (response.statusCode !== 200) reject(`请求状态码错误，状态码：${response.statusCode}`);
        if (Object.prototype.toString.call(body) == '[object String]') {
          try {
            body = JSON.parse(body);
            let result = body.result;
            if (result.errorCode !== 1) reject(`请求错误码：${result.errorCode}，错误信息：${result.errorMessage}`);
            resolve(result.errorMessage);
          } catch (err) {
            reject(err);
          }
        }
      });
    } else {
      reject('参数错误，pid不能为空');
    }
  });
}

/**
 * 接口查询JOB状态
 * @param  {Object} opt [查询条件]
 * @return {Promise}     [查询结果]
 */
const queryJob = (opt) => {
  let pid = opt.pid;
  let jid = opt.jid;
  let url = 'http://10.112.33.125:20032/taskserver/QueryJobById';
  return new Promise((resolve, reject) => {
    if (pid) {
      url = url + '?pid=' + pid;
    } else if (jid) {
      url = url + '?jid=' + jid;
    } else {
      reject('参数错误，pid和jid至少有一个不能为空');
    }
    console.log(url);
    request.get(url, (err, response, body) => {
      console.log(body);
      if (err) reject(err);
      if (response.statusCode !== 200) reject(`请求状态码错误，状态码：${response.statusCode}`);
      if (Object.prototype.toString.call(body) == '[object String]') {
        try {
          body = JSON.parse(body);
          let result = body.result;
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }
    })
  });
}

const queryTask = (vid) => {

  return new Promise((resolve, reject) => {
    if (vid) {
      let url = 'http://10.112.33.125:20032/taskserver/QueryTaskByVid?vid=' + vid;
      request.get(url, (err, response, body) => {
        if (err) reject(err);
        if (response.statusCode !== 200) reject(`请求状态码错误，状态码：${response.statusCode}`);
        if (Object.prototype.toString.call(body) == '[object String]') {
          try {
            body = JSON.parse(body);
            let result = body.result;
            resolve(result);
          } catch (err) {
            reject(err);
          }
        }
      });
    } else {
      reject('vid不能为空');
    }
  })
}

const changeJobPriority = (jid,level = 0) => {
  return new Promise((resolve, reject) => {
    if (jid) {
      request.get(`http://10.112.33.125:20032/taskserver/ChangeJobPriority?jid=${jid}&level=${level}`, (err, response, body) => {
        if (err) reject(err);
        if (response.statusCode !== 200) reject(`请求状态码错误，状态码：${response.statusCode}`);
        if (Object.prototype.toString.call(body) == '[object String]') {
          try {
            body = JSON.parse(body);
            let result = body.result;
            if (result.errorCode !== 1) reject(`请求错误码：${result.errorCode}，错误信息：${result.errorMessage}`);
            resolve(result.errorMessage);
          } catch (err) {
            reject(err);
          }
        }
      });
    } else {
      reject('参数错误，pid不能为空');
    }
  });
}

module.exports = {
  featchAdPosition,
  queryAdPosition,
  searchByOpt,
  getBrands,
  getTags,
  listByPid,
  reduceList,
  addJob,
  queryJob,
  queryTask,
  changeJobPriority
}
