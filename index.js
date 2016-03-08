
// Load dependencies.
const fs = require('fs');
const unzip = require('unzip');
const Dictionary = require('./dictionary.js');

const FOLDER_PATH = './dictionaries';

// Define module.
var SpellChecker = {
    /**
     * Create a dictionary from a file, which might be either a .dic or a .zip file.
     *
     * @param {String} lang The name of the language to check (and that also matchs a file with a word list).
     * @param {Callback} callback A function to invoke when either the dictionary was created or an error was found.
     */  
    getDictionary: function(lang, callback) {
        try{
            var dic_path = FOLDER_PATH + '/' + lang + '.dic';
            var zip_path = FOLDER_PATH + '/' + lang + '.zip';
          
            // Verify if the dictionary file exists.
            fs.exists(dic_path, function(exists) {
                if(exists) {
                    // The file exists, read it.
                    SpellChecker._readFile(dic_path, callback);
                } else {
                    // The file do not exists, verify if the ZIP file exists.
                    fs.exists(zip_path, function(exists) {
                        if(exists) {
                            // The file ZIP exists, unzip it.
                            fs.createReadStream(zip_path).pipe( unzip.Extract({ path: FOLDER_PATH }) ).on('close', function() {
                                // The file was extracted, now read it.
                                SpellChecker._readFile(dic_path, callback);
                            });
                        } else {
                            // The ZIP file also doesn't exists, return an error.
                            callback('The dicctionary file could not be found for the language "' + lang + '"', null);
                        } 
                    });
                }
            });
        } catch(err) {
            // Return error.
            if(callback) callback('An unexpected error ocurred: ' + err, null);
        }
    },
  
    /**
     * Create a dictionary from a .dic file.
     *
     * @param {String} file_path The path of the file.
     * @param {Callback} callback A function to invoke when either the dictionary was created or an error was found.
     */  
    _readFile: function(file_path, callback) {
        fs.readFile(file_path, 'utf8', function(err, text) {
            // Check for errors.
            if (!err) {
                // Create dictionary and return it.
                var dictionary = new Dictionary(text.split('\n'));
                callback(null, dictionary);
            } else {
                // Return an error.
                callback("The dictionary file could not be read: " + err, null);
            }
          console.log(data);
        });
    },
  
    /**
     * Create a dictionary from a .dic file .
     *
     * @param {string} lang The name of the language to check (and that also matchs a file with a word list).
     * @return {Object} An instance of the Dictionary class.
     * @throws {Exception} If the dictionary's file can't be found or is invalid.
     */  
    getDictionarySync: function(lang) {
        try{
            var dic_path = FOLDER_PATH + '/' + lang + '.dic';
            var zip_path = FOLDER_PATH + '/' + lang + '.zip';
          
            // Verify if the dictionary file exists.
            if(fs.existsSync(dic_path)) {
                // The file exists, read it.
                var text = fs.readFileSync(dic_path, 'utf8');
                var dictionary = new Dictionary(text.split('\n'));
                return dictionary;
            } else {
                // The file do not exists, throw an error (only the asynchronous versions of this method unzip the compressed files).
                throw new Error('The diccionary file could not be found for the language "' + lang + '"');
            }
        } catch(err) {
            // Throw an error.
            throw new Error('An unexpected error ocurred: ' + err);
        }
    }
}

// Export module.
module.exports = SpellChecker;
