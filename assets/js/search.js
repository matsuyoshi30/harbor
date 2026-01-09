// Pagefind search integration
// Initialize Pagefind UI when the page loads
(function() {
  'use strict';

  const initPagefind = () => {
    const searchContainer = document.querySelector('#searchContainer')
    if (!searchContainer) {
      console.error('Search container not found')
      return
    }

    // Check if PagefindUI is available
    if (typeof PagefindUI === 'undefined') {
      console.error('PagefindUI is not loaded')
      return
    }

    // Create Pagefind UI instance
    new PagefindUI({
      element: '#searchContainer',
      showSubResults: true,
      showImages: false,
      excerptLength: 15,
      resetStyles: false,
      bundlePath: '{{ .Site.BaseURL }}_pagefind/',
      translations: {
        placeholder: '{{ i18n "search" }}'
      }
    })
  }

  // Wait for DOM and PagefindUI to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPagefind)
  } else {
    initPagefind()
  }
})();
