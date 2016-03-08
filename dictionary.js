
// Load dependencies.
const BinarySearch = require('binarysearch');
const Fuse = require('fuse.js');
    
/**
 * Creates an instance of Dictionary.
 *
 * @constructor
 * @this {Dictionary}
 * @param {string[]} wordlist A sorted array of strings.
 */
function Dictionary(wordlist) {
    this.wordlist = [];
    this.setWordlist(wordlist);
}

/**
 * Set the list of words of the dictionary. a new Circle from a diameter.
 *
 * @param {string[]} wordlist A sorted array of strings.
 */
Dictionary.prototype.setWordlist = function(wordlist) {
    if(wordlist != null && Array.isArray(wordlist)) this.wordlist = wordlist;
};

/**
 * Verify if a word is in the dictionary.
 *
 * @param {string} word A string.
 * @return {bool} 'true' if the word is in the dictionary, 'false' otherwise.
 */
Dictionary.prototype.spellCheck = function(word) {
    // Since the list is sorted, is more fast to do a binary search than 'this.wordlist.indexOf(word)'.
    var res = BinarySearch(
        this.wordlist, // Haystack
        word.toLowerCase(), // Needle
        function(value, find) { // Comparison method
            value = value.toLowerCase();
            if(value > find) return 1;
            else if(value < find) return -1;
            return res;
        }
    );
    return res >= 0;
};

/**
 * Verify if a word is misspelled.
 *
 * @param {string} word A string.
 * @return {bool} 'true' if the word is misspelled, 'false' otherwise.
 */
Dictionary.prototype.isMisspelled = function(word) {
    return ! this.spellCheck(word);
};

/**
 * Get a list of suggestions for a misspelled word.
 *
 * Note that the 'threshold' parameter would define how many suggestions are found,
 * while 'limit' is only going to truncate the number of results obtained using that 'threshold' value. 
 *
 * @param {string} word A string.
 * @param {number} limit An integer indicating the maximum number of suggestions (by default 5).
 * @param {number} threshold An number between 0.0 (a perfect match) and 1.0 (will match anything) indicating how strict should be the search (by default 0.18).
 * @return {string[]} An array of strings with the suggestions.
 */
Dictionary.prototype.getSuggestions = function(word, limit, threshold) {
    // Validate parameters.
    if(limit == null || isNaN(limit)) limit = 5;
    if(threshold == null || isNaN(threshold)) threshold = 0.18;
    
    // Search suggestions.
    var finder = new Fuse(this.wordlist, {'threshold': threshold});
    var indexes = finder.search(word);

    // Prepare result.
    var suggestions = []
    for(var i=0; i<indexes.length && i<limit; i++) { 
        suggestions.push(this.wordlist[indexes[i]]); 
    }

    return suggestions;
}

/**
 * Verify if a word is misspelled and get a list of suggestions.
 *
 * Note that the 'threshold' parameter would define how many suggestions are found,
 * while 'limit' is only going to truncate the number of results obtained using that 'threshold' value. 
 *
 * @param {string} word A string.
 * @param {number} limit An integer indicating the maximum number of suggestions (by default 5).
 * @param {number} threshold An number between 0.0 (a perfect match) and 1.0 (will match anything) indicating how strict should be the search (by default 0.18).
 * @return {Object} An object with the properties 'misspelled' (a boolean) and 'suggestions' (an array of strings).
 */
Dictionary.prototype.checkAndSuggest = function(word, limit, threshold) {
    // Get suggestions.
    var suggestions = this.getSuggestions(word, limit+1, threshold);

    // Prepare response.
    var res = {'misspelled': true, 'suggestions': []};
    res.misspelled = suggestions.length == 0 || suggestions[0].toLowerCase() != word.toLowerCase();
    if(res.missepelled && suggestions.length > limit) res.suggestions = suggestions.slice(0, limit);
    if(!res.missepelled) res.suggestions = suggestions.slice(1, suggestions.length);
    
    return res;
}

// Export class.
module.exports = Dictionary;
