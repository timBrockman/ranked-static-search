
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
  //{queryterm:tfidf}
  var docSet = {};
  //{doc:score}
  var resultSet = {};
  // merge sort from docSet
//exports hoist list
  exports.searcher=searcher;
  exports.mergeSortObj = mergeSortObj;

  function searcher(rawQuery, suggestions, docnorms, indexes) {
    querySet = getStemmed(rawQuery.split(/ /), suggestions);
    for(var stem in querySet){
      querySet[stem] = querySet[stem] * indexes[stem].idf;
      for(doc in indexes[stem].docs){
        if(!docSet[doc]){
          docSet[doc] = ((indexes[stem].docs[doc] * querySet[stem]) / docnorms[doc]);
        }else {
          docSet[doc] += ((indexes[stem].docs[doc] * querySet[stem]) / docnorms[doc]);
        }
      }
    }
    //merge sort docset by value
    return mergeSortObj(docSet);
  };

  function getStemmed(terms, suggestions) {
    var stems = {};
    terms.forEach(function (term) {
      if (suggestions.hasOwnProperty(term)) {
        if(stems.hasOwnProperty(suggestions[term])){
          stems[suggestions[term]] += 1;
        }else{
          stems[suggestions[term]] = 1;
        }
      }
    });
    return stems;
  }
  function mergeSortObj(sourceObj){
    var source = sourceObj;
    var sorted = [];
    var keys = mergeSort(Object.keys(source));

    function mergeSort(items){
      if(items.length < 2){
        return items;
      }
      var middle  = Math.floor(items.length / 2),
          left    = items.slice(0,middle),
          right   = items.slice(middle);
      return merge(mergeSort(left),mergeSort(right));
    }

    function merge(left,right){
      var result = [],
          lCount = 0,
          rCount = 0;

      while(lCount < left.length && rCount < right.length){
        if((0.0 + source[left[lCount]]) > (0.0 + source[right[rCount]])){
          result.push(left[lCount]);
          lCount++;
        }else{
          result.push(right[rCount]);
          rCount++;
        }
      }
      return result.concat(left.slice(lCount)).concat(right.slice(rCount));
    }
    //write ordered object
    var foo = {};
    keys.forEach(function(key){
      foo = {};
      foo[key] = source[key];
      sorted.push(foo);
    });
    return sorted;
  }

})(this);

