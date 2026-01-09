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
    const baseURL = '{{ .Site.BaseURL }}';
    const pagefindPath = baseURL.endsWith('/') ? baseURL + '_pagefind/' : baseURL + '/_pagefind/';

    console.log('Initializing Pagefind with bundlePath:', pagefindPath);

    const pagefind = new PagefindUI({
      element: '#searchContainer',
      showSubResults: true,
      showImages: false,
      excerptLength: 30,
      resetStyles: true,
      bundlePath: pagefindPath,
      translations: {
        placeholder: '{{ i18n "search" }}'
      }
    })

    console.log('Pagefind UI initialized successfully')
  }

  // Wait for DOM and PagefindUI to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPagefind)
  } else {
    initPagefind()
  }
})();
