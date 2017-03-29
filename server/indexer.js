// indexer function breakout
let stemmer = require('porter-stemmer').stemmer;

module.exports = {
  cleanTxt: cleanTxt,
  stemEach: stemEach,
  tfIndex: tfIndex,
  buildVocab: buildVocab,
  logNormalize: logNormalize,
  tfNormalize: tfNormalize,
  calculateIDF: calculateIDF,
  calculateTFIDF: calculateTFIDF,
  createSuggestions: createSuggestions,
  calculateVN: calculateVN,
};


/** cleanTxt function
      @param {string} txt raw text string
      @return {array} of trimmed keyword strings
*/
function cleanTxt(txt) {
  // this isn't the best tokenizer
  // but, this should be ok
  txt = txt.toLowerCase();
  txt = txt.replace(/([^\w\s])/g, '');
  // txt = txt.replace(/[,.'"](?![0-9])|-/g,'');
  // txt = txt.replace(/-/g,'');
  txt = txt.replace(/\s+/g, ' ');
  txt = txt.trim();
  return txt.split(' ');
}


/** stemEach function helper for porter stemmer
      @param {array} words of keywords to be stemmed
      @return {array} of stemmed keywords
*/
function stemEach(words) {
  let stems = [];
  words.forEach(function(word) {
    stems.push(stemmer(word));
  });
  return stems;
}


/** tfIndex function calculates raw term frequecy
 *    @param {array} wordList of stemmed keywords
 *    @return {object} of words and thier frequency
 */
function tfIndex(wordList) {
  let termFrequency = {};
  wordList.forEach(function(word) {
    if(!termFrequency[word]) {
       termFrequency[word] = 1;
    }else{
      termFrequency[word] += 1;
    }
  });
  return termFrequency;
}


/** buildVocab creates a dictionary for a document
 *    @param {object} invIndex the inverted index
 *    @param {object} tfIndex the term frequency index
 *    @param {string} docName the document docName
 *    @return {boolean} true
 */
function buildVocab(invIndex, tfIndex, docName) {
  // create new entries for current index
  for(let atKey in tfIndex) {
    if(!invIndex[atKey]) {
      invIndex[atKey] = [];
    }
    invIndex[atKey].push(docName);
  }
  // pass object global by ref
  return true;
}


/** createSuggestions creates a lookup of unstemmed to stemmed terms
 *    @param {object} sugIndex the suggestion index to attach terms to
 *    @param {array} terms the keywords
 *    @param {array} stems the stemmed version of the keyword
 *    @return {boolean} true
 */
function createSuggestions(sugIndex, terms, stems) {
  let counter = 0;
  let terms = terms;
  let stems = stems;
  let sugIndex = sugIndex;
  terms.forEach(function(term) {
    let term = (''+term);
    if(!sugIndex[term]) {
      if(!stems) {
        sugIndex[term] = sugIndex[term];
      }else{
        sugIndex[term] = stems[counter];
      }
    }

    // sugIndex[term] = stems[counter];
    counter++;
  });
  // pass object global by ref
  return true;
}


/** logNormalize by log10
 *    @param {number} value a number
 *    @return {number} the log10 of the number
 */
function logNormalize(value) {
  if(value < 1) {
    return 0;
  }else{
    return log10(value);
  }
}

/** tfNormalize for normalization of term frequency by log10
 *    @param {number} value the term frequency
 *    @return {number} the normalized tf
 */
function tfNormalize(value) {
  if(value < 1) {
    return 0;
  }else{
    return (1.0 + log10(value));
  }
}


/** calculateIDF inverse document frequency
 *    @param {number} docFrequency the number of documents term appears in
 *    @param {number} totalDocs the total number of documents
 *    @return {number} the total docs / docFrequency
 */
function calculateIDF(docFrequency, totalDocs) {
  if((docFrequency < 1)||(totalDocs < 1)) {
    return 0;
  }else{
    return totalDocs/docFrequency;
  }
}


/** calculate tfidf (psst it's multiplication)
 *    @param {number} tf term frequency
 *    @param {number} idf inverse document frequency
 *    @return {number} tf * idf
 */
function calculateTFIDF(tf, idf) {
  return (tf * idf);
}


/** log10 because at some point this wasn't standard Math
 * maybe they fixed this
 *    @param {number} x a number
 *    @return {number} the log of x / natural log of 10
 */
function log10(x) {
  return Math.log(x) / Math.LN10;
}


/** calculateVN normed vector length for array of dimensions
 *    @param {array} dimensions array of numbers
 *    @return {number} the length normalization
 */
function calculateVN(dimensions) {
  // vector length normalization = sqrt of summation tfidf^2
  let score = 0;
  dimensions.forEach(function(dimension) {
    score += (dimension^2);
  });
  return Math.sqrt(score);
}
