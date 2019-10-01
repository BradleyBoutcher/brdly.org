'use strict';

/**
 * RESTful routes for URLS
 * GET      - Retrieve all URL information from all rows
 * PUT      - Create an entry for a full-url
 * POST     - Update the visit count for a full-url, and return it
 * DELETE   - Remove an entry
 */
module.exports = function(app) {
    var controller = require('./controller');
    app.route('/api/')
        .get(controller.read_all_urls)
        .put(controller.create_a_url)
        .post(controller.visit_a_url)
        .delete(controller.delete_a_url);
};