var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Import and Register our Routes
var routes = require('./src/routes');
routes(app); 

app.use(function(req, res, next) {
  // TODO Add origin validation
  res.header('Access-Control-Allow-Origin', "https://brdly.org");       // Production
  res.header('Access-Control-Allow-Origin', "http://localhost:4000");   // Development
  res.header('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Pragma');

  next();
});

module.exports = app;
