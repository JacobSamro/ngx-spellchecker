// Load dependencies.
const SpellChecker = require('./index.js');

// Create dictionary.
var dictionary = SpellChecker.getDictionarySync("en-US");

// Make simple tests.
console.log("spellCheck('house') = ", dictionary.spellCheck('house'));
console.log("checkAndSuggest('house') = ", dictionary.checkAndSuggest('house'));
console.log("spellCheck('housec') = ", dictionary.spellCheck('housec'));
console.log("isMisspelled('housec') = ", dictionary.isMisspelled('housec'));
console.log("getSuggestions('housec') = ", dictionary.getSuggestions('housec'));
console.log("checkAndSuggest('housec') = ", dictionary.checkAndSuggest('housec'));

console.log("\n-----\n");

// Create another dictionary.
SpellChecker.getDictionary("fr-FR", function(err, otherDictionary) {
    if(err) {
        console.log(err);
    } else {
        // Make simple tests.
        console.log("spellCheck('maison') = ", otherDictionary.spellCheck('maison'));
        console.log("checkAndSuggest('maison') = ", otherDictionary.checkAndSuggest('maison'));
        console.log("spellCheck('maisonc') = ", otherDictionary.spellCheck('maisonc'));
        console.log("isMisspelled('maisonc') = ", otherDictionary.isMisspelled('maisonc'));
        console.log("getSuggestions('maisonc') = ", otherDictionary.getSuggestions('maisonc'));
        console.log("checkAndSuggest('maisonc') = ", otherDictionary.checkAndSuggest('maisonc'));
        
    }
    
    // Finish process. 
    process.exit();
});