'use strict';

/**
 * Module used for converting IDs to a alphanumeric code
 * 
 * Algorithm: https://www.geeksforgeeks.org/how-to-design-a-tiny-url-or-url-shortener/
 * Goal: Store each url with a 10 character numerical ID, 
 * which converts to a 6 character long string
 */ 

module.exports = {
        /**
     * @description Validate submitted url to check for unsafe characters
     * @see https://perishablepress.com/stop-using-unsafe-characters-in-urls/
     * @returns boolean representing validity
     * 
     * Note: We do not detect if the URL *works*, only if it contains characters that are unsafe.
     */
    isSafeURL: function (url) {
        var subject = String(url);

        if (subject === "") return false;
        
        // eslint-disable-next-line
        var invalidCharacters = "\"<>#%{}|\ \\^~[]\`".split("");
        
        for (var c of invalidCharacters) {
            if (subject.includes(c)) {
                return false;
            }
        }
        return true;
    },

    convertIDtoShortURL: function (n) {
        // Character array too store the 62 possible characters in a url
        var charMap = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
        
        // Initialize result
        var shortURL = "";

        // Convert integer ID to a base 62 number
        while (n > 0) {
            shortURL += charMap[n % 62];
            n = Math.floor(n / 62);
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
