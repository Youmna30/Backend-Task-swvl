require('dotenv').config()
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import indexRouter from './routes/index';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import cors from 'cors'

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.mongoURI, { useNewUrlParser: true })
autoIncrement.initialize(mongoose.connection);

mongoose.connection.on('connected', () => console.log('\x1b[32m%s\x1b[0m', '[DB] Connected...'));
mongoose.connection.on('error', err => console.log('\x1b[31m%s\x1b[0m', '[DB] Error : ' + err));
mongoose.connection.on('disconnected', () => console.log('\x1b[31m%s\x1b[0m', '[DB] Disconnected...'));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

global.requestCount = 0;
setInterval(function () {
  requestCount = 0;
}, 60000)

app.use('/', indexRouter);

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
  res.status(err.status || 500).json({
    errors: err.message
  });
});

module.exports = app;
