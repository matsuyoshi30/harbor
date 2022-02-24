window.onload = function () {

  var toggle = document.getElementById('dark-mode-toggle')
  var darkTheme = document.getElementById('dark-mode-theme')

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme(localStorage.getItem('dark-mode-storage') || 'dark')
  } else {
    setTheme(localStorage.getItem('dark-mode-storage') || 'light')
  }

  toggle.addEventListener('click', () => {
    if (toggle.className === 'fas fa-moon') {
      setTheme('dark')
    } else if (toggle.className === 'fas fa-sun') {
      setTheme('light')
    }
  })

  function setTheme(mode) {
    localStorage.setItem('dark-mode-storage', mode)
    if (mode === 'dark') {
      darkTheme.disabled = false
      toggle.className = 'fas fa-sun'
      document.querySelector('body').setAttribute('data-dark-theme', 'true')
    } else if (mode === 'light') {
      darkTheme.disabled = true
      toggle.className = 'fas fa-moon'
      document.querySelector('body').setAttribute('data-dark-theme', 'false')
    }
  }
  
}
