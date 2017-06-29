/**
 * Created by leiyao on 16/3/27.
 */

var CustomError = require('./model/ErrorEnum');

var conf = {
    ORDER:{
        CONFLICTS:100
    },
    GOODS:{
        STATUS:{
            OnSale:'10',      //正在售卖，默认值
            SaleOut:'20',     //已售完
            Delete:'30',      //已被删除
            DownShelf:'40'    //商品下架
        },
        TYPE:{
            ALI:'1',
            LEMALL:'2'
        }
    },
    VOTE:{
        HOST:'http://ark.letv.com/interaction',
        TOKEN:'e3083cc83a588414a62fd1207ca50625'
    },
    TRACKING_TYPE: {
        IMPRESSION: "1",
        CLICK_TRACKING: "2",
        EVENT_TRACKING: "4"
    },
    TRACKING_SOURCE: {
        WAB: "1",
        OTHER: "2"
    },
    TRACKING_PREFIX: 'http://ark.le.com/lt?',
    APP: {
        NAME: '边看边买操作平台'
    },
    REDIS: {
        port: 6371,
        host: '10.110.94.152',
        auth: 'DDvsJPwOJvO2r5QG2rFX',
        option: {
            connect_timeout: 3000,
            max_attempts: 3
        }
    },
    SESSION_REDIS: {
        port: 6371,
        pass:'DDvsJPwOJvO2r5QG2rFX',
        //port: 6379,
        //host: '127.0.0.1'
        host: '10.110.94.152'
    },
    MYSQL: {
        connectionLimit: 50,
        host: '127.0.0.1',
        port: 3306,
        user: 'ark_wab',
        password: '$e93^3!@A',
        database: 'ark_wab',
        dateStrings: true
    },
    AFP_MYSQL: {
        connectionLimit: 50,
        host: '117.121.54.226',
        port: 3307,
        user: 'afp_r',
        password: 'DDvsJPwOJvO2r5QG2rFX',
        database: 'afp',
        dateStrings: true
    },
    ERRORS: {
        "OK": 0,
        "ARGUMENTS_ERROR": 1,
        "SERVER_ERROR": 2,
        "NOT_LOGIN": 10,
        "REPEAT_TIME_STREAM_ORDER": 11,
        "ORIENT_CONFLICT":111,
        "EXIST_ORDER_BY_ADID": 12,
        "ORDER_OUT_OF_LIMIT":13,
        "TARGET_DATA_NOT_EXIST": 20,
        "AD_STATUS_NOT_OK": 31,
        "UPLOAD_LOCAL_FAIL": 41,
        "UPLOAD_LOCAL_RENAME_FAIL": 42,
        "UPLOAD_LOCAL_SUM_FAIL": 43,
        "UPLOAD_LOCAL_EXIST": 44,
        "UPLOAD_CDN_FAIL": 51,
        "UPLOAD_MONGODB_FAIL": 61,
        "GOODS_ITEMINFO_FAIL": 71, //从淘宝接口获取商品信息错误.
        "DB_ERROR": 1001,
        "QUERY_ERROR": 1002,
        "TRANSACTION_ERROR": 1003,
        "DB_CONNECT_ERROR": 1004
    },
    GROUPS_DICT: {
        "ADMIN": 1,
        "HANDLER": 2,
        "DELIVER": 3
    },
    GROUPS: [
        {
            ID: 1,
            NAME: "ADMIN",
            DESC: "管理员组"
        },
        {
            ID: 2,
            NAME: "HANDLER",
            DESC: "操作组"
        },
        {
            ID: 3,
            NAME: "DELIVER",
            DESC: "投放组"
        }
    ],
    SOLDIER: {
        //巡逻间隔 30s
        interval: 30000,
        offset: 5 * 60 * 1000,
        internalId: 999999,
        messagerId: 999998
    },
    PUSH_REDIS_CONF: {
        //port: 6371,
        port: 6380,
        host: '10.110.94.241',
        //host: '10.150.160.136',
        auth_pass: '@*LivE20170302!',
        option: {
            connect_timeout: 3000,
            max_attempts: 3
        }
    },
    Mail: {
        toList: 'yaolei@le.com',
        defaultTitle: '边看边买操作平台-错误提示'
    },
    UPLOAD: {
        uploadHttpRoot: './public/files/',
        cdnUrl: 'http://upload.letvcdn.com:8000/single_upload_tool.php'
    },
    ALIBABA: {
        app_key: 23387178,
        app_secret: '9a49e5cdf956667c950a546c42c1cd8e',
        session:'6102226551a0ca39cf98200ed0b90b86b614fef97b5e7c22890962045'
    },
    Statics_Ver: '201605301443',
    MONGODB:{
        URI:'mongodb://wab:admin888@10.110.94.152:27019/wab'
    }
};

global.conf = conf;
global.CustomError = CustomError;

module.exports = conf;
