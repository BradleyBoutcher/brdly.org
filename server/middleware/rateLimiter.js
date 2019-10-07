// https://github.com/animir/node-rate-limiter-flexible/wiki/PostgreSQL
// Handle attempts at brute force attacks
// Handle race conditions

const pool = require('../src/db');
const {RateLimiterPostgres} = require('rate-limiter-flexible');

const ready = (err) => {
  if (err) {
  console.log("Error: Rate limiter setup successful")
   throw new Error(err);
  } else {
    console.log("Rate limiter setup successful")
  }
};

const rateLimiter = new RateLimiterPostgres({
  storeClient: pool,
  points: 10,       // 10 requests
  duration: 1,      // per 1 second by IP

  // Custom options
  tableName: 'rateLimiter',
  keyPrefix: 'middleware',

  execEvenly: true, // delay actions evenly
  blockDuration: 10,
}, ready);


const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
      console.log('Too many requests.')
    });
};

module.exports = rateLimiterMiddleware;