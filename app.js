var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash= require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })
var session = require('express-session');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var expressValidator=require('express-validator');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var port = process.env.PORT || 3000;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Handle sessionsnpm start
app.use(session({secret:'secret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());
app.use(flash());

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  res.locals.user = req.user || null;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(port , function (){
	console.log('server is running on port '+port);
});