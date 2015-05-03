//indexer function breakout
module.exports = {
  cleanTxt:cleanTxt,
  tfIndex:tfIndex,
  buildVocab:buildVocab,
  logNormalize:logNormalize,
  calculateIDF:calculateIDF,
  calculateTFIDF:calculateTFIDF,
  createSuggestions:createSuggestions
};

function cleanTxt(txt){
  //feels kind of verbose
  txt = txt.toLowerCase();
  txt = txt.replace(/([^a-z0-9-]+)/g, ' ');
  txt = txt.replace(/-/g,'');
  txt = txt.replace(/\s+/g, ' ');
  txt = txt.trim();
  return txt.split(' ');
}

function tfIndex(wordList){
  var termFrequency = {};
  wordList.forEach(function(word){
    if(!termFrequency[word]){
       termFrequency[word] = 1;
    }else{
      termFrequency[word] += 1;
    }
  });
  return termFrequency;
}

function buildVocab(setObjA, setObjB, docName){
  var vocab = {};
  var counter = 0;
  //copy & verify A
  for(var atKey in setObjA){
    if(!vocab[atKey]){
      vocab[atKey] = setObjA[atKey];
    }
  }
  //create new entries for B
  for(var atKey in setObjB){
    if(!vocab[atKey]){
      vocab[atKey] = {
        'idf':1,
        'inverseIndex':[]
      };
      vocab[atKey]['inverseIndex']= {docName:1.0};
    }else{
      vocab[atKey]['idf']+=1;
      vocab[atKey]['inverseIndex'].push({docName:1.0});
    }
  }
  return vocab;
}

function createSuggestions(vocab){
  var words = [];
  for(var atWord in vocab){
    words.push(atWord);
  }
  return words;
}

function logNormalize(value){
  if(value < 1){
    return 0;
  }else{
    return log10(value);
  }// don't forget to add one to tf
  function log10(x) {
      return Math.log(x) / Math.LN10;
  }
}

function calculateIDF(docFrequency, totalDocs){
  if((docFrequency < 1)||(totalDocs < 1)){
    return 0;
  }else{
    return totalDocs/docFrequency;
  }
}

function calculateTFIDF(tf, idf){
  return (tf * idf);
}