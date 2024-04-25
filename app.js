var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

//import
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//using signed cookies with a secret key as an argument
// app.use(cookieParser('12345-67890-09876-54321'));
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false, //once the session has been created and updated and saved, it will continue to be resaved whenever a request is made for that session.
  store: new FileStore() //used to save session information to the server's hard disk
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// we'll add authentication
function auth(req, res, next) {
  // show the authorization header
  // console.log(req.headers);
  console.log(req.session);
  // if (!req.signedCookies.user) {
  if (!req.session.user) {
    // const authHeader = req.headers.authorization; //deleted ,cause it handled by user Router
    // if (!authHeader) {
      const err = new Error('You are not authenticated!');
      // res.setHeader('WWW-Authenticate', 'Basic'); //deleted ,cause it handled by user Router
      err.status = 401;
      return next(err);
    // }
    //parse the auth header and validate username and password
    // const auth= Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':'); //decode username and password
    // const user = auth[0]; //grab the username
    // const pass= auth[1]; //grab the password
    // if (user === 'admin' && pass === 'password') {
    //   // res.cookie('user', 'admin', {signed: true});// set up a cookie
    //   req.session.user = 'admin';
    //   return next(); //authorized
    // } else {
    //   const err = new Error('You are not authenticated!');
    //   res.setHeader('WWW-Authenticate', 'Basic');
    //   err.status = 401;
    //   return next(err);
    // }
  } else {
      // if (req.signedCookies.user === 'admin') {
      // if (req.session.user === 'admin') {
      if (req.session.user === 'authenticated') { //same as users.js line 59
        return next();
      } else {
          const err = new Error('You are not authenticated!');
          err.status = 401;
          return next(err);
      }
  }
}
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

//calls
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

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

//MONGOOSE
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'), 
    err => console.log(err)
);

module.exports = app;
