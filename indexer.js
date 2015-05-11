//indexer function breakout
var stemmer = require('porter-stemmer').stemmer;

module.exports = {
  cleanTxt:cleanTxt,
  stemEach:stemEach,
  tfIndex:tfIndex,
  buildVocab:buildVocab,
  logNormalize:logNormalize,
  tfNormalize:tfNormalize,
  calculateIDF:calculateIDF,
  calculateTFIDF:calculateTFIDF,
  createSuggestions:createSuggestions
};

function cleanTxt(txt){
  //this isn't real normalization
  //but, this should be a fair compromise
  txt = txt.toLowerCase();
  txt = txt.replace(/([^a-z0-9-,.]+)/g, ' ');
  txt = txt.replace(/[,.](?![0-9])|-/g,'');
  //txt = txt.replace(/-/g,'');
  txt = txt.replace(/\s+/g, ' ');
  txt = txt.trim();
  return txt.split(' ');
}

function stemEach(words){
  var stems = [];
  words.forEach(function(word){
    stems.push(stemmer(word));
  });
  return stems;
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

function buildVocab(invIndex, tfIndex, docName){
  //create new entries for current index
  for(var atKey in tfIndex){
    if(!invIndex[atKey]){
      invIndex[atKey] = [];
    }
    invIndex[atKey].push(docName);
  }
  //pass object global by ref
  return true;
}

function createSuggestions(sugIndex, terms, stems){
  var counter = 0;
  var terms = terms;
  var stems = stems;
  var sugIndex = sugIndex;
  terms.forEach(function(term){
    var term = (''+term);
    if(!sugIndex[term]){
      if(!stems){
        sugIndex[term] = sugIndex[term];
      }else{
        sugIndex[term] = stems[counter];
      }
    }

    //sugIndex[term] = stems[counter];
    counter++;
  });
  //pass object global by ref
  return true;
}

function logNormalize(value){
  if(value < 1){
    return 0;
  }else{
    return log10(value);
  }
}

function tfNormalize(value){
  if(value < 1){
    return 0;
  }else{
    return (1.0 + log10(value));
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

function log10(x) {
  return Math.log(x) / Math.LN10;
}
