// Pagefind search integration
// Initialize Pagefind UI when the page loads
const init = () => {
  const searchContainer = document.querySelector('#searchContainer')
  if (searchContainer === null) {
    return
  }

  // Create Pagefind UI instance
  new PagefindUI({
    element: '#searchContainer',
    showSubResults: true,
    showImages: false,
    excerptLength: 15,
    resetStyles: false,
    bundlePath: '{{ .Site.BaseURL }}_pagefind/'
  })
}

init();
