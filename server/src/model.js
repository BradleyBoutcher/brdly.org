'use strict'

var pool = require('./db');

var URL = function(url) {
    this.id = url.id;
    this.full_url = url.full_url;
    this.expires_on = url.expires_on;
    this.visits = url.visits;
}

/**
 * Create a new url entry and set the expiration datetime
 * @param full_url      - URL passed by user
 * @param expiration    - date and time of expiration
 * @param response      - Callback with query data
 */
URL.createUrl = function (full_url, expires_on, response) {
    pool.query("INSERT INTO urls (full_url, expires_on, visits) VALUES($1, $2, $3) RETURNING id", [full_url, expires_on, 1], function (err, result) {
        if (err) {
            console.log("Error: ", err);
            response(err, null);
        } else { 
            console.log("Created URL: ", result.rows);
            response(null, result);
        }
    });
}

/**
 * Increment visit count for a URL and return URL info
 * @param id            - Row ID for an entry
 * @param response      - Callback with query data
 */
URL.updateVisitsById = function(id, response){
    pool.query("UPDATE urls SET visits = visits + 1 WHERE id = $1 returning id, full_url, expires_on, visits", [id], function (err, result) {
        if(err) {
            console.log("Error: ", err);
            response(err, null);
        } else { 
            console.log('Updated URL : ', result.rows);  
            response(null, result);
        }
    });  
  }; 

  /**
   * Retrieve information on a single URL with a given ID
    * @param id            - Row ID for an entry
    * @param response      - Callback with query data
   */
URL.getURLbyID = function (id, response) {
    pool.query("Select * FROM urls WHERE id = $1 ", [id], function (err, result) {
        if(err) {
            console.log("Error: ", err);
            response(err, null);
        } else {
            console.log('URL : ', result.rows);  
            response(null, result);
        }
    });   
};

/**
 * Get information on all URLs
 * @param response      - Callback with query data
 */
URL.getAllURLs = function (response) {
    pool.query("Select * FROM urls ORDER BY id ASC", function (err, result) {
        if(err) {
            console.log("Error: ", err);
            response(err, null);
        } else {
            console.log('URLs : ', result.rows);  
            response(null, result);
        }
    });   
};

/**
 * Delete a URL entry
 * @param id            - Row ID for an entry
 * @param response      - Callback with query data
 */
URL.remove = function(id, response){
    pool.query("DELETE FROM urls WHERE id = $1", [id], function (err, result) {
        if(err) {
            console.log("Error: ", err);
            response(err, null);
        } else { 
            response(null, result);
        }
    }); 
};

module.exports = URL;