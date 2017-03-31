# Ranked Static Search

This is creates a series of indexes(ices) in .json format. You can use these (tfidf) values to create quick vector space comparisons between documents and/or search terms. This could also be used to pull unique keywords from your documents.

## 2017-3-30 update
todo: start building tests for refactor
todo: eslint and restructure index.js, refactor as I go
todo: think about new es6 data types
todo: restructure project

done: quick eslint of indexer.js


##this is a work in progress..
The general goal is to develop some sort of IR package that can be deployed on any web server.
 It would be nice if sites that don't have or want full on database had local site wide search
  features, at least for documentation. It would also be nice to have indexes to tell you what 
  a document is actually talking about in the context of the collection.


[My Google Sheet for basic TF-IDF calculations](https://docs.google.com/spreadsheets/d/1yWSgmJH1Zr5XkGIhCvssmIMYAXnNfilsidj5dsaxGl4/edit?usp=sharing)
  
Currently, my approach is to build a pretty standard system that indexes tf-idf values 
and ranks the results based on some query. It uses node (should also be happy with io.js) 
to create a static index file. It does the ranking with a client side script. 
Hopefully, I can gin up something that will produce good results without eating all the resources. 

todo: (currently)
  - [x] write spec for indexer
  - [ ] write spec 'tests' for indexer
  - [ ] write spec 'tests' for searcher
  - [ ] write some precision/recall/F benchmarking thing
  - [x] demo.html: write simple demo.html wrapper
  - [ ] test.html: incorporate benchmarking in wrapper
  - [x] searcher: write cos similarity search
  - [x] searcher: merge-sort result set to rank by value
  - [x] demo.html: write multi-term suggestive search feature
  - [x] index: simple folder search
  - [x] index: get corpus size
  - [x] index: read txt files
  - [x] index: write inverse index
  - [x] index: write tf indexes
  - [x] index: write suggestion index
  - [x] index: write document vector norm index
  - [x] indexer: simple text cleaner
  - [x] indexer: term frequency indexer
  - [x] indexer: vocab builder
  - [x] indexer: inverse indexer
  - [x] indexer: suggestive search list
  - [x] indexer: calculate inverse document frequency
  - [x] indexer: calculate document vector norm
  - [x] index: filter out 0 idf terms and suggestions
  - [ ] index: sort (merge or native array) suggestions and index 
  - [x] docs: add link to google tf-idf sheet
  - [ ] docs: clean up and update google sheet to be more clear
  - [ ] Optimize this. It should only have to read through corpus once to create all indexes.
  - [ ] Consider some pre-sorting for the final objects, convert/merge-sort set-ish objects to hash-ish arrays. Possibly before returning docIndex & big index. 
  - [x] Find and link my old tfidf calculating spread sheet to check values against. 
  - [x] Implement Porter stemmer (porter-stemmer)
  - [ ] Find more a realistically sized test corpus to test performance and F-score, precision & recall.
  - [ ] consider flag for other content types .md, .html, etc.
  - [ ] consider extractors for those content types html-to-text, node-unfluff, remove-markdown

metrics review:
  - precision = PPV or tp/tp+fp or retrieved relevant/ all retrieved
  - recall = TPR or tp/tp+fn or retrieved relevant/ all relevant
  - Fscore = 2 * (precision * recall) / (precision + recall)
  
todo: Find a good mix of metrics vs. performance presets.

# tfidf search on txt files
There are two parts.
_The indexer_ is designed to index some txt files and calculate some log10 normalized tfidf values.
Rather than a classic linked list it creates json object files that can be easily accessed 
by the searcher, or whatever client or server side script you choose. They could also be 
saved as .js files if you wanted to script load them.
_The searcher_ should calculate the cosine similarity of search terms to indexed documents.
It should return the top 5 results. The demo.html uses jquery, and jquery-ui auto-complete to 
enhance the probability that terms existing in the corpus actually get searched for.


##restrictions
  - document names must be unique
  - documents must exist in one directory

##sync vs async
For now the indexing is done synchronously.
In the future some optimization could take place.

##file types
For now this only checks for .txt files.
It would be nice to do some .html & .md for static documentation type sites.. like those built by assemble.io

###spec
  - describe the index
    - it should read txt files from test_corpus directory
    - describe the indexer
      - it should create an term frequency index
      - it should create an inverse document frequency index
      - it should log10 normalize the values
      - it should create an suggestive search word only list
    - it should write tf indices for documents
    - it should write inverse index with idf values
    - it should write tf-idf values into each index after all indexes are counted
    - it should write the demo page to the destination
    - describe the searcher
      - it should read the indexes
      - it should suggest words based on corpus dictionary
      - it should use space separation to suggest more words
      - it should calculate cosine similarity
      - it should return top x matches
      - it should use cosine similarity to rank matches
    - describe the demo.html
    - describe the test.html
      - it should index some corpus
      - it should run a set of queries
      - it should return some expected results
      - it should display precision, recall, F score

(B/T)DD feels like writing the answer for a math problem before solving it.
