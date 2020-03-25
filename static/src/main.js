import lunr, { Token, utils } from 'lunr'
import Mark from 'mark.js'
import '../css/main.css'
import '../css/syntax.css'

var lunrIndex
var lunrResult
var pagesIndex

const bigramTokeniser = (obj, metadata) => {
  if (obj == null || obj == undefined) {
    return []
  }

  if (Array.isArray(obj)) {
    return obj.map(t => {
      return new Token(
        utils.asString(t).toLowerCase(),
        utils.clone(metadata)
      )
    })
  }

  var str = obj.toString().trim().toLowerCase(),
      tokens = []

  for(var i = 0; i <= str.length - 2; i++) {
    var tokenMetadata = utils.clone(metadata) || {}
    tokenMetadata["position"] = [i, i + 2]
    tokenMetadata["index"] = tokens.length
    tokens.push(
      new Token (
        str.slice(i, i + 2),
        tokenMetadata
      )
    )
  }

  return tokens
}

const queryNgramSeparator = query => {
  var str = query.toString().trim().toLowerCase(),
      tokens = []

  for(var i = 0; i <= str.length - 2; i++) {
    tokens.push(str.slice(i, i + 2))
  }

  return tokens.join(' ')
}

const index = '../post/index.json'

const initLunr = () => {
  var request = new XMLHttpRequest();
  request.open('GET', index, true)
  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      pagesIndex = JSON.parse(this.response);
      lunrIndex = lunr(function() {
        this.tokenizer = bigramTokeniser
        this.pipeline.reset()
        this.ref('ref')
        this.field('title', { boost: 10 })
        this.field('body')
        this.metadataWhitelist = ['position']
        pagesIndex.forEach(page => {
          this.add(page)
        }, this)
      })
    } else {
      console.error('Error getting Hugo index flie')
    }
  }
  request.send();
}

/**
 * Searching pages using lunr
 * @param {String} query Query string for searching
 * @return {Object[]} Array of search results
 */
const search = query => {
  lunrResult = lunrIndex.search(queryNgramSeparator(query))
  return lunrResult.map(result => {
    return pagesIndex.filter(page => {
      return page.ref === result.ref
    })[0]
  })
}

function initUI () {
    // Event when changing query
    let searchBox = document.querySelector('#searchBox')
    searchBox.addEventListener('keyup', () => {
        var searchResults = document.querySelector('#searchResults')
        var query = document.querySelector('#searchBox').value

        // Only trigger a search when 2 chars. at least have been provided
        if (query.length < 2) {
          searchResults.style.display = "none"
          return
        }

        // Display search results
        renderResults(search(query))
        searchResults.style.display = "block"
    })

    // TODO: Emit keyup event for when the query is already setted with browser back etc.
    // $('#searchBox').trigger('keyup')
}

/**
 * Rendering search results
 * @param {Object[]} results Array of search results
 */
const renderResults =　results => {
  var searchResults = document.querySelector('#searchResults')
  var query = document.querySelector('#searchBox').value
  var BODY_LENGTH = 100
  var MAX_PAGES = 10

  // Clear search result
  while(searchResults.firstChild) searchResults.removeChild(searchResults.firstChild)

  // Show message when results is empty
  if (!results.length) {
    let resultPage = document.createElement('div')
    resultPage.className = 'searchResultPage'
    resultPage.innerHTML = 'No results found for query "' + query + '"'
    searchResults.append(resultPage)
    return
  }

  var instance = new Mark(document.querySelector("#searchResults"))
  // Only show the ten first results
  results.slice(0, MAX_PAGES).forEach((result, idx) => {
    let resultPage = document.createElement('div')
    resultPage.className = 'searchResultPage'
    var metadata = lunrResult[idx].matchData.metadata
    var matchPosition = metadata[Object.keys(metadata)[0]].body.position[0][0]
    var bodyStartPosition = (matchPosition - (BODY_LENGTH / 2) > 0) ? matchPosition - (BODY_LENGTH / 2) : 0

    let resultTitle = document.createElement('a')
    resultTitle.className = 'searchResultTitle'
    resultTitle.href = result.ref
    resultTitle.innerHTML = result.title
    resultPage.append(resultTitle)

    let resultBody = document.createElement('div')
    resultBody.className = 'searchResultBody'
    resultBody.innerHTML = result.body.substr(bodyStartPosition, BODY_LENGTH)
    resultPage.append(resultBody)
    searchResults.append(resultPage)

    instance.mark(query)
  })
}

window.onload = () => {
  initLunr()
  initUI()
};