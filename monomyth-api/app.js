require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');
const passport = require("passport");
var User = require('./models/user');
var logger = require('morgan');
const cors = require('cors');
const MongoStore = require('connect-mongo');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS
app.use(cors({
  'origin' : 'http://localhost:3000',
  'credentials': true,
}))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:3000'); // update to match the domain you will make the request from
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true)
  next();
});

// Mongoose connection
var mongoose = require('mongoose');
var mongoDB = `mongodb+srv://${process.env.MONGO_CRED}@cluster0.zojvq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// PASSPORT -------------------------------------

// Passport Middleware
app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: false,
  store: new MongoStore({ mongoUrl: `mongodb+srv://${process.env.MONGO_CRED}@cluster0.zojvq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority` }),
  saveUninitialized: false,
  // cookie: {
  //   secure: false
  // }
}));
  
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Passport Setup
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
      if (err) { 
        console.log('err!')
        return done(err);
      }
      if (!user) {
        console.log('wrong email!')
        return done(null, false, { message: "Incorrect email" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          console.log('password match!')
          // passwords match, log user in
          return done(null, user)
        } else {
          // passwords do not match
          console.log('wrong password!')
          return done(null, false, { message: "Incorrect password" })
        }
      })
      // return done(null, user);
    });
  })
);
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(id, done) {
  console.log('id: ', id);
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

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
