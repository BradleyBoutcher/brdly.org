var bodyParser = require('body-parser');
var express = require('express');
var cookieParser = require('cookie-parser');
var helmet = require('helmet');
var logger = require('morgan');
var rateLimeterMiddleware = require('./middleware/rateLimiter')
var app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimeterMiddleware);

// Import and Register our Routes
var routes = require('./src/routes');
routes(app); 

app.use(function(req, res, next) {
  // TODO Add origin validation
  res.header('Access-Control-Allow-Origin', "*");       // Production
  res.header('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Pragma');

  next();
});

module.exports = app;
