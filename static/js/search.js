var lunrIndex
var lunrResult
var pagesIndex

var bigramTokeniser = function (obj, metadata) {
  if (obj == null || obj == undefined) {
    return []
  }

  if (Array.isArray(obj)) {
    return obj.map(function (t) {
      return new lunr.Token(
        lunr.utils.asString(t).toLowerCase(),
        lunr.utils.clone(metadata)
      )
    })
  }

  var str = obj.toString().trim().toLowerCase(),
      tokens = []

  for(var i = 0; i <= str.length - 2; i++) {
    var tokenMetadata = lunr.utils.clone(metadata) || {}
    tokenMetadata["position"] = [i, i + 2]
    tokenMetadata["index"] = tokens.length
    tokens.push(
      new lunr.Token (
        str.slice(i, i + 2),
        tokenMetadata
      )
    )
  }

  return tokens
}

var queryNgramSeparator = function (query) {
  var str = query.toString().trim().toLowerCase(),
      tokens = []

  for(var i = 0; i <= str.length - 2; i++) {
    tokens.push(str.slice(i, i + 2))
  }

  return tokens.join(' ')
}


/**
 * Preparation for using lunr.js
 */
function initLunr () {
  $.getJSON('../post/index.json').done(function (index) {
    pagesIndex = index
    lunrIndex = lunr(function () {
      this.tokenizer = bigramTokeniser
      this.pipeline.reset()
      this.ref('ref')
      this.field('title', { boost: 10 })
      this.field('body')
      this.metadataWhitelist = ['position']
      pagesIndex.forEach(function (page) {
        this.add(page)
      }, this)
    })
  }).fail(function (jqxhr, textStatus, error) {
    var err = textStatus + ', ' + error
    console.error('Error getting Hugo index flie:', err)
  })
}

/**
 * Searching pages using lunr
 * @param {String} query Query string for searching
 * @return {Object[]} Array of search results
 */
function search (query) {
  lunrResult = lunrIndex.search(queryNgramSeparator(query))
  return lunrResult.map(function (result) {
    return pagesIndex.filter(function (page) {
      return page.ref === result.ref
    })[0]
  })
}

function initUI () {
    // Event when changing query
    $('#searchBox').keyup(function () {
        var $searchResults = $('#searchResults')
        var query = $('#searchBox').val()

        // Only trigger a search when 2 chars. at least have been provided
        if (query.length < 2) {
        $searchResults.hide()
        return
        }

        // Display search results
        renderResults(search(query))
        $searchResults.show()
    })

    // Emit keyup event for when the query is already setted with browser back etc.
    $('#searchBox').trigger('keyup')
}

/**
 * Rendering search results
 * @param {Object[]} results Array of search results
 */
function renderResults (results) {
  var $searchResults = $('#searchResults')
  var query = $('#searchBox').val()
  var BODY_LENGTH = 100
  var MAX_PAGES = 10

  // Clear search result
  $searchResults.empty()

  // Show message when results is empty
  if (!results.length) {
    $searchResults.append('<div class="searchResultPage">No results found for query "' + query + '"</div>')
    return
  }

  // Only show the ten first results
  results.slice(0, MAX_PAGES).forEach(function (result, idx) {
    var $searchResultPage = $('<div class="searchResultPage">')
    var metadata = lunrResult[idx].matchData.metadata
    var matchPosition = metadata[Object.keys(metadata)[0]].body.position[0][0]
    var bodyStartPosition = (matchPosition - (BODY_LENGTH / 2) > 0) ? matchPosition - (BODY_LENGTH / 2) : 0

    $searchResultPage.append('<a class="searchResultTitle" href="' + result.ref + '">' + result.title + '</a>')

    $searchResultPage.append('<div class="searchResultBody">' + result.body.substr(bodyStartPosition, BODY_LENGTH) + '</div>')
    $searchResults.append($searchResultPage)

    // Highlight keyword
    $('#searchResults').mark(query)
  })
}

initLunr()

document.addEventListener('DOMContentLoaded', function() {
  initUI()
});