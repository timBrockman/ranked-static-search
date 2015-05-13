//some basic requires
var fs      = require('fs'),
    path    = require('path'),
    mkdirp  = require('mkdirp'),
    config  = require('./config.js'),
    indexer = require('./indexer.js');

var corpusDir = path.normalize('./' + config.corpus);


// index vars
var totalDocs = 0; //listTxtFiles(dir).length
var vectorNorms = {};
/*vector norm format
* {<docName>:vectorNorm}
* consider clobbering docIndex instead
 */
var docIndex = {};
/*doc index format
* {<docName>:{<term>:raw TF (int)}}
* */
var inverseIndex = {};
/*inverse index format
* {<term>:[docNames]}
* */
var bigIndex = {};
/*big index format
* {<term>:{IDF: normed float,
*              docs:{<docName>:normed TF-IDF (float)}
*             }
* }
* consider optimized sorting
* */
var suggestIndex = {};
/*suggest index format
* {<term>:stemmed version or term for unstemmed}
* consider optimized sorting
* */

/* -----
* algorithm sketch
* ------
* 1 read files
* 2 clean files
* 3 index documents to docIndex
* docIndex -> (Porter stem option)
*   => suggestIndex
*   => inverseIndex -> calculate normalized idf & tf -> bigIndex
* 4 write suggestIndex to json
* 5 write bigIndex to json
* 6 copy searcher
* 7 create demo.html
* */

var corpus = listTxtFiles(corpusDir);
totalDocs = corpus.length;

//this loop does initial indexing
//after it completes calculations can be done
//then calculations can be compiled into a final bigIndex
corpus.forEach(function(txtFile){
  var txtContent = readTxtFile(path.normalize(corpusDir + '/' + txtFile));
  var terms = indexer.cleanTxt(txtContent); //scan and split once
  var stems = indexer.stemEach(terms);
//
  indexer.createSuggestions(suggestIndex, terms, stems);
//
  docIndex[txtFile] = indexer.tfIndex(stems);
//
  indexer.buildVocab(inverseIndex, docIndex[txtFile], txtFile);
});
//suggestIndex completed
//console.log(Object.keys(suggestIndex).length);
//console.log(Object.getOwnPropertyNames(suggestIndex).sort());
//docIndex completed
//console.log(JSON.stringify(docIndex));
//inverseIndex completed
//console.log(Object.keys(inverseIndex).length);
//console.log(inverseIndex);
//then start bigIndex
var curIDF = 0;
var curTF = 0;
var curTFIDF = 0;
var tf = [];
//todo: consider turning big index and suggest index into sorted arrays
//todo: consider making this look nicer
//todo: wrap it for testing
for(var term in inverseIndex){
  tf=[];
  curIDF = indexer.logNormalize(indexer.calculateIDF(inverseIndex[term].length, totalDocs));
  //idf filter
  if(curIDF === 0){
    //don't enter in bigIndex
    //filter from suggestIndex
    for(var suggestion in suggestIndex){
      if(suggestIndex[suggestion] === term){
        delete suggestIndex[suggestion];
      }
    }
  }else {
    bigIndex[term] = {
      idf: curIDF,
      docs: {}
    };
    inverseIndex[term].forEach(function (doc) {
      curTF = 1 + indexer.tfNormalize(docIndex[doc][term]);
      curTFIDF = indexer.calculateTFIDF(curTF, curIDF);
      var k = {};
      k[doc]=curTFIDF;
      bigIndex[term].docs = k;
    });

  }
}

//create document vector length norms
for(var doc in docIndex){
  var curVector = [];
  for(var term in docIndex[doc]){
    if(bigIndex.hasOwnProperty(term)){
      curVector.push(bigIndex[term]['docs'][doc]);
    }
  }
  vectorNorms[doc] = indexer.calculateVN(curVector);
}

writeIndexes();
//console.log(vectorNorms);
//console.log(Object.keys(suggestIndex).length);
//console.log(JSON.stringify(bigIndex));
//exposed functions for test.js
module.exports = {
  listTxtFiles:listTxtFiles,
  readTxtFile:readTxtFile
};
function listTxtFiles(txtDir){
  var txtFiles = [];
  var allFiles = fs.readdirSync(txtDir);
  allFiles.forEach(function(file){
    if(/^[a-zA-Z0-9-_]+\.txt$/.test(file)){
      txtFiles.push(file);
    }
  });
  return txtFiles;
}

function readTxtFile(txtFile){
  var content = fs.readFileSync(txtFile,'utf-8');
  return content;
}
function createDest(){
  mkdirp.sync(path.normalize(config.dest + '/indexes'));
  return true;
}
function copySearcher(){
  return true;
}
function writeIndexes(){
  createDest();
  //write bigIndex
  fs.writeFileSync(path.normalize(config.dest + '/indexes/' +'indexes.json'),JSON.stringify(bigIndex));
  //write suggestions
  fs.writeFileSync(path.normalize(config.dest + '/indexes/' +'suggestions.json'),JSON.stringify(suggestIndex));
  //write docnorms
  fs.writeFileSync(path.normalize(config.dest + '/indexes/' +'docnorms.json'),JSON.stringify(vectorNorms));
}