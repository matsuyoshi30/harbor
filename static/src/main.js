import lunr, { Token, utils } from 'lunr'
import Mark from 'mark.js'
import '../css/main.css'
import '../css/syntax.css'

let lunrIndex
let lunrResult
let pagesIndex

const bigramTokeniser = (obj, metadata) => {
  if (obj == null || obj == undefined) {
    return []
  }

  let str = obj.toString().trim().toLowerCase()
  let tokens = []

  for(let i = 0; i <= str.length - 2; i++) {
    let tokenMetadata = utils.clone(metadata) || {}
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
  const str = query.toString().trim().toLowerCase()
  const tokens = []

  for(let i = 0; i <= str.length - 2; i++) {
    tokens.push(str.slice(i, i + 2))
  }

  return tokens.join(' ')
}

const index = '../post/index.json'

const initLunr = () => {
  let request = new XMLHttpRequest();
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
  request.onerror = function() {
    console.error('connection error')
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

const initUI = () => {
  document.querySelector('#searchBox').addEventListener("keyup", function(event) {
    console.log("debug");
    let searchResultsArea = document.querySelector('#searchResults');
    let query = event.currentTarget.value;
  
    // Only trigger a search when 2 chars. at least have been provided
    if (query.length < 2) {
      searchResultsArea.style.display = "none"
      return
    }
  
    // Display search results
    renderResults(search(query))
    searchResultsArea.style.display = "block"
  })
}

/**
 * Rendering search results
 * @param {Object[]} results Array of search results
 */
const renderResults =　results => {
  const searchResults = document.querySelector('#searchResults')
  const query = document.querySelector('#searchBox').value
  const BODY_LENGTH = 100
  const MAX_PAGES = 10

  // Clear search result
  while (searchResults.firstChild)
    searchResults.removeChild(searchResults.firstChild)

  // Show message when results is empty
  if (!results.length) {
    let resultPage = document.createElement('div')
    resultPage.className = 'searchResultPage'
    resultPage.innerHTML = 'No results found for query "' + query + '"'
    searchResults.append(resultPage)
    return
  }

  let instance = new Mark(document.querySelector("#searchResults"))
  // Only show the ten first results
  results.slice(0, MAX_PAGES).forEach((result, idx) => {
    let resultPage = document.createElement('div')
    resultPage.className = 'searchResultPage'
    let metadata = lunrResult[idx].matchData.metadata
    let matchPosition = metadata[Object.keys(metadata)[0]].body.position[0][0]
    let bodyStartPosition = (matchPosition - (BODY_LENGTH / 2) > 0) ? matchPosition - (BODY_LENGTH / 2) : 0

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

initLunr()
initUI()