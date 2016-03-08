
// Load dependencies.
const BinarySearch = require('binarysearch');
const EditDistance = require('damerau-levenshtein')();

// Use this object for consider accents and special characters when comparing UTF-8 strings.
var Collator = new Intl.Collator();

// The search for suggestions is going to be limited to words that are next to the position, in the word list, in which the word would be inserted.
var SuggestRadius = 1000;

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
        Collator.compare // Comparison method
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
 * @param {string} word A string.
 * @param {number} limit An integer indicating the maximum number of suggestions (by default 5).
 * @return {string[]} An array of strings with the suggestions.
 */
Dictionary.prototype.getSuggestions = function(word, limit) {
    // Validate parameters.
    if(limit == null || isNaN(limit)) limit = 5;
  
    // Search index of closest item.
    var closest = BinarySearch.closest(this.wordlist, word, Collator.compare);
    
    // Search suggestions around the position in which the word would be inserted.
    var k, dist;
    var res = {d1: [], d2: []};
    for(var i=0; i<SuggestRadius; i++) {
        // The index 'k' is going to be 0, 1, -1, 2, -2... 
        k = closest + (i%2 != 0? ((i+1)/2) : (-i/2) );
        if(k >=0 && k < this.wordlist.length) {
            dist = EditDistance(word, this.wordlist[k]);         
            if(dist <= 1) res.d1.push(this.wordlist[k]);
            if(dist == 2) res.d2.push(this.wordlist[k]);
        }
    }
    
    // Prepare result.
    var suggestions = [];
    if(res.d1.length > limit) {
        suggestions = res.d1.slice(0, limit);
    } else {
        suggestions = res.d1;
        limit = limit - suggestions.length;
        suggestions.concat( (res.d2.length > limit)? res.d2.slice(0, limit) : res.d2 );
    }
    return suggestions;
}

/**
 * Verify if a word is misspelled and get a list of suggestions.
 *
 * @param {string} word A string.
 * @param {number} limit An integer indicating the maximum number of suggestions (by default 5).
 * @return {Object} An object with the properties 'misspelled' (a boolean) and 'suggestions' (an array of strings).
 */
Dictionary.prototype.checkAndSuggest = function(word, limit) {
    // Get suggestions.
    var suggestions = this.getSuggestions(word, limit+1);

    // Prepare response.
    var res = {'misspelled': true, 'suggestions': []};
    res.misspelled = suggestions.length == 0 || suggestions[0].toLowerCase() != word.toLowerCase();
    if(res.missepelled && suggestions.length > limit) res.suggestions = suggestions.slice(0, limit);
    if(!res.missepelled) res.suggestions = suggestions.slice(1, suggestions.length);
    
    return res;
}

// Export class.
module.exports = Dictionary;
