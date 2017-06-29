var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var env = app.get('env');
console.log(env);
if (env === 'development') {
  require('./conf');
  global.Mailer = {
    error: function(msg) {
      console.log(msg);
    }
  };
  console.log('load dev config');
}else if(env === 'test'){
  require('./conf-test');
  global.Mailer = {
    error: function(msg) {
      console.log(msg);
    }
  };
  console.log('load test config');
} else {
  require('./conf-online');
  console.log('load online config');
  var mailer = require('./utils/Mailer');
  mailer.error('服务已经启动\thost:' + require('os').hostname() + '\t' + 'pid:' + process.pid + '\t' + new Date());
}
var RedisStore = require('connect-redis')(session);
var routes = require('./routes/index');

var users = require('./routes/users');
var api = require('./routes/api');
var upload = require('./routes/upload');
var goods = require('./routes/goods.js');
var vote = require('./routes/vote.js');
var adPosition = require('./routes/adPosition.js');
var lebuy = require('./routes/lebuy.js');
var area = require('./routes/area.js');

var log = require('./log');
var domain = require('domain');
var Utils = require('./utils/utils');

log.use(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  store: new RedisStore(conf.SESSION_REDIS),
  secret: '8dj3Vd3',
  //name: "wab_session",
  cookie: {
    maxAge: 1000 * 3600 * 10
  }, //10小时
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  if (req.session && req.session.currentUser) {
    res.setHeader('TOKEN', encodeURI(JSON.stringify(req.session.currentUser)));
  }
  next();
});
app.use(function(req, res, next) {
  var reqDomain = domain.create();
  reqDomain.on('error', function(err) { // 下面抛出的异常在这里被捕获
    console.log(err);
    res.send(500, err.stack); // 成功给用户返回了 500
  });

  reqDomain.run(next);
});
app.use('/', routes);
app.use('/users', users);
app.use('/upload', upload);
app.use('/api', api);
app.use('/goods', goods);
app.use('/votes',vote);
app.use('/adPosition',adPosition);
app.use('/lebuy',lebuy);
app.use('/areas',area);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.url);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
app.use(function(err, req, res, next) {
  //res.status(err.status || 500);
  //res.status(200);
  if (err.status == 404) {
    res.redirect('/#/access/404');
  } else {
    Utils.response(res, conf.ERRORS.SERVER_ERROR, err);
  }
});
//}

//require('./public/gulpfile').watch();



module.exports = app;
