'use strict';
var env = process.env.NODE_ENV;
if (env === 'test') {
    require('../conf-test');
    console.log('load test config');
} else if(env === 'production') {
    require('../conf-online');
    console.log('load online config');
} else{
    require('../conf');
    console.log('load dev config');
}

const LeBuyService = require('../service/LeBuyService.js');
// LeBuyService.task();
LeBuyService.start();