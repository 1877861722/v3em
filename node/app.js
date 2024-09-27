var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//身份认证部分包
let expressJWT = require('express-jwt')
let secretKey = require('./public/uilt/key') // 密钥

let ChinaRouter = require('./routes/china/index')
const app = express();
// 静态资源展示
app.use('/apidoc', express.static('apidoc'));
app.use('/public', express.static('public'));
// token认证白名单
app.use(
  expressJWT.expressjwt({ secret: secretKey, algorithms: ["HS256"] }).unless({
    // path: [/^\/api\//],
    path: [
      '/',
      '/api/login',
      '/api/upload/img',
    ]
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
/**
 * express.static是一个express内置的中间件函数，用于提供静态文件。
 * 我们在index.js中使用这个中间件函数，即可提供public目录下的静态资源：
 * 
 */


app.use(ChinaRouter)
app.use(require('./routes/admin/index'))
app.use(require('./routes/user/index'))
app.use(require('./routes/upload/index'))
/* 中间键 404资源 */
app.use(function (req, res, next) {
  res.status(404).send({
    code: 404,
    measg: "'请求资源获取失败404'"
  })
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
