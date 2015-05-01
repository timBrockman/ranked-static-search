##this is in progress..
todo:
  - [x] write spec for indexer
  - [ ] write legit tests for indexer
  - [ ] write legit tests for searcher
  - [ ] write some precision/recall type thing
  - [ ] searcher: write basic cos similarity search filter
  - [ ] searcher: write multi-term suggestive search feature
  - [x] index: simple folder search
  - [x] index: get corpus size
  - [x] index: read txt files
  - [ ] index: write inverse index
  - [ ] index: write tf indexes
  - [x] indexer: write simple text cleaner
  - [x] indexer: write term frequency indexer
  - [x] indexer: write vocab builder
  - [x] indexer: write inverse indexer
  - [ ] indexer: calculate inverse document frequency
  
todo: Find and link my old tfidf calculating spread sheet to check values against. 
  
# tfidf search on txt files
There are two parts.
_The indexer_ is designed to index some txt files and calculate some log10 normalized tfidf values.
Rather than a classic linked list it creates json object files that can be easily accessed 
by the searcher, or whatever client or server side script you choose.
_The searcher_ should calculate the cosine similarity of search terms to indexed documents.
It should return the top 5 results.



##restrictions
  - document names must be unique
  - documents must exist in flat file

##sync vs async
For now the indexing is done synchronously.
In the future some optimization could take place.

##file types
For now this only checks for .txt files and tries to clear out all punctuation.
This will give some weird word fragments, but oh well.
Some porter stemming may be useful but I think it may overtax the ability to do 
suggestive search, so for now I'm skipping that idea.

It would be nice to do some .md for static documentation type sites.. like those built by assemble.io

###spec
  - describe the index
    - it should read txt files from test_corpus directory
    - describe the indexer
      - it should create an term frequency index
      - it should create an inverse document frequency index
      - it should log10 normalize the values

TDD feels like writing the answer for a math problem before entering values in the calculator.
