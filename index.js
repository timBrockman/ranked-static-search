//some basic requires
var fs      = require('fs'),
    path    = require('path'),
    config  = require('./config.js'),
    indexer = require('./indexer.js');

//base index objects
var totalDocs = 0; //listTxtFiles(dir).length
var docIndex = {};
var inverseIndex = {};


console.log(
  indexer.logNormalize(1)
);

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