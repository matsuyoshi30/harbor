{{ $searchData := resources.Get "list.json" | resources.ExecuteAsTemplate "search-data.json" . }}
const searchDataURL = '{{ $searchData.RelPermalink }}'

const init = () => {
  const searchBox = document.querySelector('#searchBox')
  if (searchBox === null) {
    return
  }

  let index = new FlexSearch.Document({
    tokenize: 'reverse',
    document: {
      field: ['title', 'body'],
      store: ['title', 'href', 'body']
    },
  })

  fetch(searchDataURL)
    .then(pages => pages.json())
    .then(pages => {
      for(let i = 0; i < pages.length; i++){
        index.add(i, pages[i]);
      }
    })

  searchBox.addEventListener('keyup', function (event) {
    let searchResultsArea = document.querySelector('#searchResults')
    let query = event.currentTarget.value

    // Only trigger a search when 2 chars. at least have been provided
    if (query.length < 2) {
      searchResultsArea.style.display = 'none'
      return
    }

    // Display search results
    renderResults(index.search(query, 10, { enrich: true }));
    searchResultsArea.style.display = 'block'
  })
}

/**
 * Rendering search results
 * @param {Object[]} results Array of search results ( fields[] => { field, result[] => { document }} )
 */
const renderResults = (results) => {
  const searchResults = document.querySelector('#searchResults')
  const query = document.querySelector('#searchBox').value
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

  let arr = results[0].result
  if (results.length > 1) {
    arr.concat(results[1].result)
  }
  arr.filter((element, index, self) =>
    self.findIndex(e => e.id === element.id) === index)

  let instance = new Mark(document.querySelector('#searchResults'))
  let fragment = document.createDocumentFragment();
  arr.forEach((result) => {
    let resultPage = document.createElement('div')
    resultPage.className = 'searchResultPage'

    let resultTitle = document.createElement('a')
    resultTitle.className = 'searchResultTitle'
    resultTitle.href = result.doc.href
    resultTitle.innerHTML = result.doc.title
    resultPage.append(resultTitle)

    let resultBody = document.createElement('div')
    resultBody.className = 'searchResultBody'
    let matchPos = result.doc.body.indexOf(query)
    let bodyStartPos = matchPos - BODY_LENGTH / 2 > 0 ? matchPos - BODY_LENGTH / 2 : 0
    resultBody.innerHTML = result.doc.body.substr(bodyStartPos, BODY_LENGTH)
    resultPage.append(resultBody)
    fragment.append(resultPage)
  })
  searchResults.append(fragment);
  instance.mark(query)
}

init();
