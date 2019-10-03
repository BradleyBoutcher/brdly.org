'use strict';

const express = require('express');
const bodyparser = require('body-parser');

const app = express();

// Constants
const PORT = 8000;

// Bodyparser
app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
)

app.use(function(req, res, next) {
  const origin = req.get('origin');

  // TODO Add origin validation
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Origin', "https://brdly.com");
  res.header('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Pragma');

  next();
});

// Basic test case
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})

// Import and Register our Routes
var routes = require('./routes');
routes(app); 
