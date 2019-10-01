'use strict'

const Pool = require('pg').Pool;

// Generate pool of connections to avoid opening-and-closing
// connection for each query
const pool = new Pool({
    user: 'server',
    host: process.env.DB_HOST, 
    database: 'postgres', 
    password: 'password',
    port: 5432,
});

pool.connect(function(error) {
    if(error) throw error;
});

module.exports = pool;