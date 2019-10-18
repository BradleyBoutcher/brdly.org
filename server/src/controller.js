var URL = require('./model');
var shortener = require('./shortener');
var moment = require('moment')

/**
 * @description Generate a new ID and store the full URL
 * 
 * @param request           - JSON data containing a body. 
 * @requires full_url       - Key with string value of a web URL to be stored
 * @param response          - Callback containing error and query response data
 *              
 * @returns json containing the fully-qualified shortened URL 
 *  specifically the base 64 encoded URL suffix and host prefix
 */
exports.create_a_url = function(request, response) {
    var new_url = String(request.body.full_url);
    var expiration = String(request.body.expiration);
    // No URL passed in - throw an error 
    if(!new_url) {
        response.status(400).send({ error:true, message: 'Please provide a complete URL.' });
    } else if(!shortener.isSafeURL(new_url)) {
        response.status(400).send({ error:true, message: 'Please provide a safe URL.' });
    } else {
        // Make sure it has the correct prefix
        if (!new_url.includes("https://") && !new_url.includes("http://")) new_url = "http://" + new_url;
        // Create new entry
        URL.createUrl(new_url, expiration, function(error, url) {
            if (error) {
                response.status(500).send({ error: true, message: 'Unable to create Shortened URL.' });
            }
            var shortURL = shortener.convertIDtoShortURL(url.rows[0].id) 
            response.json({error: false, short_url: "brdly.org/?" + shortURL});
        });
    }
};

/**
 * @description Read a URL and increment the visit count. 
 * 
 * @param request         - JSON data containing a body. 
 * @requires id           - Key with numerical value correlating to a database entry
 * @param response        - Callback containing query data
 * @returns Full url for redirection purposes
 */
exports.visit_a_url = function(request, response) {
    // Unpack ID from request body
    var id = request.body.id;
    if(!id){
         response.status(400).send({ error: true, message: 'Please provide ID for a URL.' });
    } else {
        // Convert shortened ID to valid ID
        var decodedID = shortener.convertShortURLtoID(id); 
        URL.updateVisitsById(decodedID, function(error, url) {
            if (error) {
                response.send({error: true, message: error});
            }
            // No URL found - return 400 error
            else if (!url || url.rows.length === 0) {
                response.status(400).send({ error: true, message: 'Invalid or expired URL.' });
            } else {
                // Cast response to object
                var newURL = new URL(url.rows[0]);

                // URL is expired or invalid - remove from database
                if (this.url_is_invalid(newURL.expires_on, newURL.visits)) {
                    URL.remove(decodedID, function(error, result) {
                        if (error) {
                            throw new Error(error);
                        }
                        response.status(400).send({ error: true, message: 'Invalid or expired URL.' });
                    })
                } else {
                    response.json({error: false, full_url: newURL.full_url });
                }
            }
        });
    }
};

/**
 * @description Return information on all rows.
 * 
 * @param request        - JSON data containing a body. No value needed.
 * @param response       - Callback containing query data, specifically an array of row info
 * @returns An array of row information
 */
exports.read_all_urls = function(request, response) {
    URL.getAllURLs(function(error, url) {
        if (error) {
            response.status(400).send({ error: true, message: 'Unable to retrieve URLs.' });
        } else {
            response.send({error: false, urls: url.rows});
        }   
    });
};

/**
 * @description Delete a url entry from the database
 * 
 * @param request        - JSON data containing a body
 * @param response       - Callback containing query data
 * @returns Confirmation message
 */
exports.delete_a_url = function(request, response) {
    // Unpack ID from request body
    var id = request.body.id;
    if(!id){
        response.status(400).send({ error: true, message: 'Please provide ID for a URL to be deleted.' });
    } else {
        URL.remove( request.params.id, function(error, url) {
            if (error) {
                response.send(error);
            }
            response.json({error: false, message: 'URL successfully deleted.' });
        });
    }
};

/**
 * Check if the date is past expiration or max visits have been reached
 * @param   expirationDate  - The date and time that a URL is invalid past
 * @param   visits          - Maximum number of visits / uses for a shortened URL to redirect
 * @returns A boolean, true meaning that the URL is valid. False meaning it needs to be removed.
 */
url_is_invalid = function(expirationDate, visits) {

    // Check if we've reached the max amount of visits
    if (visits > 49) {
        return true;
    }

    // Retrieve current datetime
    var now = moment().format("YYYY-MM-DD");

    // Check if current time is after expiration
    if (moment(expirationDate).isBefore(now)) {
        return true;
    }

    return false;
}