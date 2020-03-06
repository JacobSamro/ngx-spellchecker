import { Injectable } from '@angular/core';

import { Dictionary } from './dictionary';

@Injectable()
export class SpellCheckerService {

    dictionaryURL = 'https://raw.githubusercontent.com/JacobSamro/ngx-spellchecker/master/dict/normalized_en-US.dic';

    getDictionary(dictionary: any) {
        return new Dictionary(dictionary.split('\n'));
    }

    /**
     * Reads a UTF8 dictionary string, removes the BOM and \r characters and sorts the list of words.
     *
     * @param {String} content The string to normalize
     * @param {Promize} String A promise to process after finishing.
     */
    normalizeDictionary(content: String): Promise<String> {

        return new Promise((resolve, reject) => {

            // Remove BOM and \r characters.
            content = this.stripBOM(content);
            content = content.replace(/\r/g, '');

            // Sort words.
            let lines = content.split('\n');
            const collator = new Intl.Collator(); // Use this comparator for consider accents and special characters.
            lines = lines.sort(collator.compare);

            // Generate output content.
            let newContent = '';
            let first = true;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i] !== '' && lines[i] !== '\n') {
                    if (!first) { newContent += '\n'; }
                    newContent += lines[i];
                    first = false;
                }
            }

            resolve(newContent);


        });
    }

    stripBOM(s: String): String {
        if (s.charCodeAt(0) === 0xFEFF) {
            return s.slice(1);
        }

        return s;
    }

}
