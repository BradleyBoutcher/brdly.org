'use strict';

/**
 * Module used for converting IDs to a alphanumeric code
 * 
 * Algorithm: https://www.geeksforgeeks.org/how-to-design-a-tiny-url-or-url-shortener/
 * Goal: Store each url with a 10 character numerical ID, 
 * which converts to a 6 character long string
 */ 

module.exports = {
    convertIDtoShortURL: function (n) {
        // Character array too store the 62 possible characters in a url
        var charMap = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
        
        // Initialize result
        var shortURL = "";

        // Convert integer ID to a base 62 number
        while (n > 0) {
            shortURL += charMap[n % 62];
            n = Math.round(n / 62);
            if (n === 1) n = 0;
        }
        return shortURL;
    },

    convertShortURLtoID: function(url) {
        // Initialize result
        var id = 0;
        // Verify parameter is a String
        var shortURL = String(url);
        // Process in reverse order complete base conversion
        for (var i = shortURL.length; i >= 0; i--) {
            if ('a'.charCodeAt() <= shortURL.charCodeAt(i) &&  shortURL.charCodeAt(i) <= 'z'.charCodeAt()) { 
                id = id * 62 + shortURL.charCodeAt(i) - 'a'.charCodeAt();  
            }
            if ('A'.charCodeAt() <= shortURL.charCodeAt(i) && shortURL.charCodeAt(i) <= 'Z'.charCodeAt()) {
                id = id * 62 + shortURL.charCodeAt(i) - 'A'.charCodeAt() + 26;  
            }
            if ('0'.charCodeAt() <= shortURL.charCodeAt(i) && shortURL.charCodeAt(i) <= '9'.charCodeAt()) {
                id = id * 62 + shortURL.charCodeAt(i) - '0'.charCodeAt() + 52;   
            }
        }

        return id;
    }
}
