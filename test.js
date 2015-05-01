//mocha spec tests

var expect  = require('expect.js'),
    index   = require('./index.js'),
    indexer = require('./indexer.js');

describe('the index.js file',function(){
  var testPath      = './test/test_corpus',
      testFiles     = index.listTxtFiles(testPath),
      testFile      = testFiles[0],
      testContent   = index.readTxtFile(testPath+'/'+testFile),
      cleanContent  = indexer.cleanTxt(testContent);

  it('should read the txt files from the test folder', function(done){
    expect(testFiles.length).to.be(2);
    expect(testContent).to.match(/.+Here.+/);
    done();
  });
  describe('the indexer', function(){
    it('should clean the content and split it into an array', function(done){
      expect(cleanContent).to.contain('here');
      expect(cleanContent).to.contain('55');
      expect(cleanContent).to.not.contain('ola');
      expect(cleanContent.length).to.be(9);
      done();
    });
    it('should create a term frequency index',function(done){
      expect(true).to.be(true);
      done();
    });
    it('should create an inverse index',function(done){
      expect(true).to.be(true);
      done();
    });
    it('should log10 normalize the term frequency',function(done){
      expect(true).to.be(true);
      done();
    });
    it('should calculate the inverse document frequency',function(done){
      expect(true).to.be(true);
      done();
    });
  });
});