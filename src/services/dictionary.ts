/*
 * Copyright (c) 2016 José F. Maldonado, 2019 Jacob Samro
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Load dependencies.
// @ts-ignore
const BinarySearch = require('binarysearch');
// @ts-ignore
const Levenshtein = require('damerau-levenshtein');

// Use this object for consider accents and special characters when comparing UTF-8 strings.
const Collator = new Intl.Collator(undefined, { 'sensitivity': 'accent' });

// The search for suggestions is going to be limited to words that are next to the position,
// in the word list, in which the word would be inserted.
const SuggestRadius = 1000;


export class Dictionary {

  wordlist: any[];
  regexs: any[];

  /**
   * Creates an instance of Dictionary.
   *
   * @constructor
   * @param wordlist A sorted array of strings.
   */
  constructor(wordlist: any[]) {
    this.wordlist = [];
    this.setWordlist(wordlist);
    this.clearRegexs();
  }
  /**
   * Returns the number of words in the dictionary.
   *
   * @return {number} The number of words in the dictionary.
   */
  getLength() {
    return this.wordlist != null ? this.wordlist.length : 0;
  }




  /**
   * Set the list of words of the dictionary. a new Circle from a diameter.
   *
   * @param {string[]} wordlist A sorted array of strings.
   */
  setWordlist(wordlist: any[]) {
    if (wordlist != null && Array.isArray(wordlist)) { this.wordlist = wordlist; }
  }

  /**
   * Verify if a word is in the dictionary.
   *
   * @param {string} word A string.
   * @return {bool} 'true' if the word is in the dictionary, 'false' otherwise.
   */

  spellCheck(word: string) {
    // Verify if the word satifies one of the regular expressions.
    for (let i = 0; i < this.regexs.length; i++) {
      if (this.regexs[i].test(word)) { return true; }
    }

    // Since the list is sorted, is more fast to do a binary search than 'this.wordlist.indexOf(word)'.
    const res: any = new BinarySearch(
      this.wordlist, // Haystack
      word.toLowerCase(), // Needle
      Collator.compare // Comparison method,
    );
    return res >= 0;
  }

  /**
   * Verify if a word is misspelled.
   *
   * @param {string} word A string.
   * @return {bool} 'true' if the word is misspelled, 'false' otherwise.
   */
  isMisspelled(word: string) {
    return !this.spellCheck(word);
  }

  /**
   * Get a list of suggestions for a misspelled word.
   *
   * @param {string} word A string.
   * @param {number} limit An integer indicating the maximum number of suggestions (by default 5).
   * @param {number} maxDistance An integer indicating the maximum edit distance between the word and the suggestions (by default 3).
   * @return {string[]} An array of strings with the suggestions.
   */
  getSuggestions(word: string, limit: number = 5, maxDistance: number = 3) {

    let suggestions: any[] = [];

    if (word != null && word.length > 0) {
      // Validate parameters.
      word = word.toLowerCase();
      if (limit == null || isNaN(limit) || limit <= 0) { limit = 5 };
      if (maxDistance == null || isNaN(maxDistance) || maxDistance <= 0) { maxDistance = 2 };
      if (maxDistance >= word.length) { maxDistance = word.length - 1 };

      // Search index of closest item.
      const closest = BinarySearch.closest(this.wordlist, word, Collator.compare);

      console.log(closest)
      // Initialize variables for store results.
      const res: any = [];
      for (let i = 0; i <= maxDistance; i++) { res.push([]); }

      // Search suggestions around the position in which the word would be inserted.
      let k, dist;
      for (let i = 0; i < SuggestRadius; i++) {
        // The index 'k' is going to be 0, 1, -1, 2, -2...
        k = closest + (i % 2 != 0 ? ((i + 1) / 2) : (-i / 2));
        if (k >= 0 && k < this.wordlist.length) {
          dist = Levenshtein(word, this.wordlist[k].toLowerCase()).steps;
          console.log(this.wordlist[k])
          if (dist <= maxDistance) { res[dist].push(this.wordlist[k]); }
        }
      }

      // Prepare result.
      for (let d = 0; d <= maxDistance && suggestions.length < limit; d++) {
        const remaining: any = limit - suggestions.length;
        suggestions = suggestions.concat((res[d].length > remaining) ? res[d].slice(0, remaining) : res[d]);
      }
    }

    return suggestions;

  }

  /**
   * Verify if a word is misspelled and get a list of suggestions.
   *
   * @param {string} word A string.
   * @param {number} limit An integer indicating the maximum number of suggestions (by default 5).
   * @param {number} maxDistance An integer indicating the maximum edit distance between the word and the suggestions (by default 3).
   * @return {Object} An object with the properties 'misspelled' (a boolean) and 'suggestions' (an array of strings).
   */

  checkAndSuggest(word: string, limit: number = 5, maxDistance: number = 3) {
    // Get suggestions.
    const suggestions: any = this.getSuggestions(word, limit + 1, maxDistance);

    console.log(suggestions)
    // Prepare response.
    const res = { 'misspelled': true, 'suggestions': [] };
    res.misspelled = suggestions.length === 0 || suggestions[0].toLowerCase() !== word.toLowerCase();
    res.suggestions = suggestions;
    if (res.misspelled && (suggestions.length > limit)) { res.suggestions = suggestions.slice(0, limit); }
    if (!res.misspelled) { res.suggestions = suggestions.slice(1, suggestions.length); }

    // Verify if the word satifies one of the regular expressions.
    if (res.misspelled) {
      for (let i = 0; i < this.regexs.length; i++) {
        if (this.regexs[i].test(word)) { res.misspelled = false; }
      }
    }

    return res;
  }

  /**
   * Adds a regular expression that will be used to verify if a word is valid even though is not on the dictionary.
   * Useful indicate that numbers, URLs and emails should not be marked as misspelled words.
   *
   * @param {RegEx} regexp A regular expression.
   */

  addRegex(regex: any) {
    this.regexs.push(regex);
  }

  /**
   * Clear the list of regultar expressions used to verify if a word is valid even though is not on the dictionary.
   */

  clearRegexs() {
    this.regexs = [];
  }

}