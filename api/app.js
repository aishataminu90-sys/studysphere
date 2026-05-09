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

// trust proxy MUST be first - required on Render for cookies to work
app.set('trust proxy', 1);

// Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var resourceRouter = require('./routes/resources');
var groupsRouter = require('./routes/groups');
var remindersRouter = require('./routes/reminders');
var contactRouter = require('./routes/contact');
var adminRouter = require('./routes/admin');

const authMiddleware = require('./middleware/authMiddleware');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err.message));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session
const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
  secret: process.env.SESSION_SECRET || 'studysphere_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 86400,
    touchAfter: 3600
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction
  }
}));

// Routes
app.use('/', indexRouter);
app.use('/users', authMiddleware, usersRouter);
app.use('/auth', authRouter);
app.use('/resources', resourceRouter);
app.use('/groups', groupsRouter);
app.use('/reminders', remindersRouter);
app.use('/contact', contactRouter);
app.use('/admin', adminRouter);

// Catch 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;