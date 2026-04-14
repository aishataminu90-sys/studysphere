require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const cors = require('cors');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();

// Router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');
var resourceRouter = require('./routes/resources');
var groupsRouter = require('./routes/groups');
var remindersRouter = require('./routes/reminders');

// 🔍 DEBUG (VERY IMPORTANT — DO NOT REMOVE YET)
console.log('indexRouter:', typeof indexRouter);
console.log('usersRouter:', typeof usersRouter);
console.log('authRouter:', typeof authRouter);
console.log('authMiddleware:', typeof authMiddleware);
console.log('resourceRouter:', typeof resourceRouter);
console.log('groupsRouter:', typeof groupsRouter);
console.log('remindersRouter:', typeof remindersRouter);

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Routes
app.use('/', indexRouter);
app.use('/users', authMiddleware, usersRouter);
app.use('/auth', authRouter);
app.use('/resources', resourceRouter);
app.use('/groups', groupsRouter);
app.use('/reminders', remindersRouter);

// catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json({
    error: err.message
  });
});

module.exports = app;