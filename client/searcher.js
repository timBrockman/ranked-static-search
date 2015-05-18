
  /*
   *algorithm sketch
   * 1. query set = query stems with idf > 0
   * 2. doc set = docs contained in query set inverse index
   * 3. //calculate vector norm for each document
   * 4. cosine sim for each doc/query pair
   *   for each document in docSet
   *     doc.vectorNorm
   *     for each word in querySet
   *       cosSimScore += query.word.tfidf * doc.word.tfidf / doc.vectorNorm
   *
   * todo: commonjs wrap for browserfy or whatever
   */

(function(exports) {
//"use strict";

//var rawQuery = 'this is for a test operation';
  var querySet = {};
  var docSet = {};
//module.exports={searcher: searcher};
  function foo() {
    alert('foo');
  };
  exports.foo = foo();
  function searcher(rawQuery, suggestions, docnorms, indexes) {
    var results = [];
    var stems = getStemmed(rawQuery.split(/ /), suggestions);
    return stems;
  };
  function getStemmed(terms, suggestions) {
    var stems = [];
    terms.forEach(function (term) {
      if (suggestions.hasOwnProperty(term)) {
        stems.push[suggestions[term]];
      }
    });
    return stems;
  }


  function loadForTesting() {
    //in general jQuery and jQuery ui autocomplete

  }


  function _parseRaw() {
    return true;
  }

  function _createDocSet() {
    return true;
  }

})(this);

