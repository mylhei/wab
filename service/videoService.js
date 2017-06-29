'use strict';

const pool = require('../utils/MysqlUtils');


const queryalbumByPid = (pid) => {
    let sql = 'SELECT id,name FROM basic_album ba WHERE ba.id = ?';
    return new Promise((resolve,reject)=>{
        if(pid == null || pid == undefined){
            reject(new Error('参数错误，pid不能为空'));
        }
        pool.queryAfp(sql,[pid],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result && result[0]);
            }
        })
    });

}

module.exports = {
    queryalbumByPid
}