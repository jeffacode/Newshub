var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require("passport");
var mongoose = require('./models/main');
var localSignupStrategy = require('./passport/signup_passport');
var localLoginStrategy = require('./passport/login_passport');
var config = require('./server.config.json');

var VERSION = 'v' + config.version;
var CLIENT_BUILD_DIR = path.resolve(__dirname, '../client/build');
var CLIENT_OUTPUT_PATH = path.join(CLIENT_BUILD_DIR, VERSION);

var authRouter = require('./routes/auth');
var apiRouterV1 = require('./routes/api_v1');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors()); // TODO:暂时解决跨域问题
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(CLIENT_OUTPUT_PATH)); // 访问前端打包的静态资源

// 连接MongoDB数据库
mongoose.connect(config.mongoDbUri);

// 配置passorts
app.use(passport.initialize());
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);


app.use('/v1', apiRouterV1);
app.use('/auth', authRouter);
app.get('*', function (request, response){
  response.sendFile(path.resolve(CLIENT_OUTPUT_PATH, 'index.html'))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
