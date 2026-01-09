const init = () => {
  const searchBox = document.querySelector('#searchBox')
  if (searchBox === null) {
    return
  }

  // Initialize Pagefind
  let pagefind = null
  const loadPagefind = async () => {
    if (!pagefind) {
      pagefind = await import('/pagefind/pagefind.js')
      await pagefind.options({
        excerptLength: 100
      })
    }
    return pagefind
  }

  searchBox.addEventListener('keyup', async function (event) {
    let searchResultsArea = document.querySelector('#searchResults')
    let query = event.currentTarget.value

    // Only trigger a search when 2 chars. at least have been provided
    if (query.length < 2) {
      searchResultsArea.style.display = 'none'
      return
    }

    // Load Pagefind if not already loaded
    const pf = await loadPagefind()

    // Perform search
    const search = await pf.search(query)

    // Display search results
    renderResults(search.results, query)
    searchResultsArea.style.display = 'block'
  })
}

/**
 * Rendering search results
 * @param {Object[]} results Array of search results from Pagefind
 * @param {string} query The search query
 */
const renderResults = async (results, query) => {
  const searchResults = document.querySelector('#searchResults')
  const BODY_LENGTH = 100

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

  // Load and render each result
  let fragment = document.createDocumentFragment();
  for (const result of results) {
    const data = await result.data()

    let resultPage = document.createElement('div')
    resultPage.className = 'searchResultPage'

    let resultTitle = document.createElement('a')
    resultTitle.className = 'searchResultTitle'
    resultTitle.href = data.url
    resultTitle.textContent = data.meta.title || 'Untitled'
    resultPage.append(resultTitle)

    let resultBody = document.createElement('div')
    resultBody.className = 'searchResultBody'

    // Use Pagefind's excerpt if available, otherwise use content
    if (data.excerpt) {
      resultBody.innerHTML = data.excerpt
    } else if (data.content) {
      // Fallback to manual excerpt creation
      let content = data.content
      let matchPos = content.toLowerCase().indexOf(query.toLowerCase())
      if (matchPos !== -1) {
        let bodyStartPos = matchPos - BODY_LENGTH / 2 > 0 ? matchPos - BODY_LENGTH / 2 : 0
        resultBody.textContent = content.substr(bodyStartPos, BODY_LENGTH)
      } else {
        resultBody.textContent = content.substr(0, BODY_LENGTH)
      }
    }

    resultPage.append(resultBody)
    fragment.append(resultPage)
  }
  searchResults.append(fragment);
}

init();
