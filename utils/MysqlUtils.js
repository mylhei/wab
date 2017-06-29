/**
 * Created by leiyao on 16/3/27.
 */

var mysql = require('mysql');

var pool = mysql.createPool(conf.MYSQL);
var afp_pool = mysql.createPool(conf.AFP_MYSQL);

var async = require('async');

pool.query = function(query,values,callback){
    if (values instanceof Function){
        callback = values;
        values = [];
    }
    pool.getConnection(function(err,conn){
        if (err){
            return callback(new CustomError(conf.ERRORS.DB_ERROR));
        }
        sqlLogger.info(conn.format(query, values));
        conn.query(query,values,function(err,reply){
            if (err){
                sqlLogger.info(err);
                callback(err);
            }else {
                callback(null, reply);
            }
            pool.releaseConnection(conn);
        });
    });
};

pool.insert = function(query,values,callback){
    if (values instanceof Function){
        callback = values;
        values = [];
    }
    pool.getConnection(function(err,conn){
        if (err){
            pool.releaseConnection(conn);
            return callback(new CustomError(conf.ERRORS.DB_ERROR, err));
        }
        conn.beginTransaction(function(err){
           if (err){
               pool.releaseConnection(conn);
               return callback(new CustomEvent(conf.ERRORS.TRANSACTION_ERROR));
           } else{
               conn.query(query,values,function(err,reply){
                   if (err){
                       callback(err);
                       conn.rollback(function(err){
                           logger.error("rollback error !"+err);
                       });
                   }else {
                       conn.commit(function (err) {
                           if (err) {
                               conn.rollback(function (err) {
                                   logger.error("rollback error when commit!" + err);
                               });
                           }
                           callback(null, reply);
                       });
                   }
                   pool.releaseConnection(conn);
               });
           }
        });
        sqlLogger.info(conn.format(query, values));
    });
};

pool.insertWithConn = function (conn, query, values, callback) {
    if (values instanceof Function) {
        callback = values;
        values = [];
    }

    conn.beginTransaction(function (err) {
        if (err) {
            return callback(new CustomEvent(conf.ERRORS.TRANSACTION_ERROR));
        } else {
            conn.query(query, values, function (err, reply) {
                if (err) {
                    sqlLogger.info(err);
                    callback(err);
                    conn.rollback(function (err) {
                        logger.error("rollback error !" + err);
                    });
                } else {
                    conn.commit(function (err) {
                        if (err) {
                            conn.rollback(function (err) {
                                logger.error("rollback error when commit!" + err);
                            });
                        }
                        callback(null, reply);
                    });
                }
            });
        }
    });
    sqlLogger.info(conn.format(query, values));
};

pool.update = function(query,values,callback){
    if (values instanceof Function){
        callback = values;
        values = [];
    }
    pool.getConnection(function(err,conn){
        if (err){
            pool.releaseConnection(conn);
            return callback(new CustomError(conf.ERRORS.DB_ERROR));
        }
        conn.beginTransaction(function(err){
            if (err){
                pool.releaseConnection(conn);
                return callback(new CustomEvent(conf.ERRORS.TRANSACTION_ERROR));
            } else{
                conn.query(query,values,function(err,reply){
                    if (err){
                        callback(conf.ERRORS.QUERY_ERROR);
                        conn.rollback(function(err){
                            logger.error("rollback error !"+err);
                        });
                    }else {
                        conn.commit(function (err) {
                            if (err) {
                                conn.rollback(function (err) {
                                    logger.error("rollback error when commit!" + err);
                                });
                            }
                            callback(null, reply);
                        });
                    }
                    pool.releaseConnection(conn);
                });
            }
        });
        sqlLogger.info(conn.format(query, values));
    });
};

pool.updateBatch = function (conn, funcArr, callback) {
    conn.beginTransaction(function (err) {
        async.series(funcArr, function (err, result) {
            if (err) {
                conn.rollback(function (err) {
                    sqlLogger.info('rollback err' + err)
                });
                callback(err, result);
            } else {
                conn.commit(function (err) {
                    if (err) {
                        sqlLogger.info('commit err ' + err);
                    }
                    callback(err, result);
                })
            }
        })
    });
};

pool.on('connection', function (connection) {
    // sqlLogger.info('connection for available connection slot');

});
pool.on('enqueue', function () {
    // sqlLogger.info('Waiting for available connection slot');
});


/*
pool.queryDeferred = function(query,values){
    pool.getConnection(function(err,conn){
        conn.query(query,values,function(err,reply){
            var deferred = Q.defer();
            if (!err)
                deferred.resolve(reply);
            else
                deferred.reject(err);
            return deferred.promise;
        });

    });
};
*/
pool.queryAfp = function (query, values, callback) {
    if (values instanceof Function) {
        callback = values;
        values = [];
    }
    afp_pool.getConnection(function (err, conn) {
        if (err) {
            return callback(new CustomError(conf.ERRORS.DB_ERROR));
        }
        sqlLogger.info(conn.format(query, values));
        conn.query(query, values, function (err, reply) {
            if (err) {
                sqlLogger.info(err);
                callback(err);
            } else {
                callback(null, reply);
            }
            afp_pool.releaseConnection(conn);
        });
    });
};
module.exports = pool;