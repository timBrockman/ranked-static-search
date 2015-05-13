
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
module.exports={};

var rawQuery = 'this is for a test operation';
var querySet = {};
var docSet = {};

function parseRaw(){
  return true;
}

function createDocSet(){
  return true;
}

function search(queryTerms){
  var results = [];

  return results;
}

