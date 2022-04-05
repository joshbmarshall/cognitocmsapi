const lazy = () => {
  let use_webp = null
  function testWebP(callback) {
    const webP = new Image()
    webP.onload = webP.onerror = function() {
      callback(webP.height == 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  }
  function atStartup() {
    testWebP((canSupportWebp) => {
      use_webp = canSupportWebp
      lazyLoad()
    })
  }
  registerListener('load', atStartup)

  setInterval(lazyLoad, 500)
  let lazy = []

  function lazyLoad() {
    if (use_webp === null) {
      atStartup()
      return
    }
    lazy = document.getElementsByClassName('coglazy')
    if (use_webp) {
      for (var i = 0; i < lazy.length; i++) {
        if (lazy[i].getAttribute('data-webp')) {
          lazy[i].setAttribute('data-src', lazy[i].getAttribute('data-webp'))
          lazy[i].removeAttribute('data-webp')
        }
      }
    }
    let replaced_placeholder = false
    for (var i = 0; i < lazy.length; i++) {
      if (lazy[i].getAttribute('coglazyplaceholder')) {
        continue
      }
      if (lazy[i].getAttribute('data-src')) {
        lazy[i].src = lazy[i].getAttribute('data-src')
        lazy[i].setAttribute('coglazyplaceholder', '1')
      }
      replaced_placeholder = true
    }
    if (replaced_placeholder) {
      // Allow the preloaded image to load
      return
    }
    for (var i = 0; i < lazy.length; i++) {
      if (lazy[i].getAttribute('coglazydone')) {
        continue
      }
      if (isInViewport(lazy[i])) {
        if (lazy[i].getAttribute('data-src')) {
          const srcurl = lazy[i].getAttribute('data-src')
          const filename = srcurl.split('/').pop()
          const width = Math.floor(lazy[i].clientWidth * window.devicePixelRatio)
          const height = Math.floor(lazy[i].clientHeight * window.devicePixelRatio)

          lazy[i].src = `${srcurl.replace(filename, '') + width}x${height}:${filename}`
          lazy[i].removeAttribute('data-src')
        }
        lazy[i].setAttribute('coglazydone', '1')
      }
    }
  }

  function isInViewport(el) {
    const rect = el.getBoundingClientRect()
    let screenheight = window.innerHeight || document.documentElement.clientHeight
    const screenwidth = window.innerWidth || document.documentElement.clientWidth
    // Increase height to pre-load on scroll
    screenheight += 200
    return (
      rect.bottom >= 0
            && rect.right >= 0
            && rect.top <= screenheight
            && rect.left <= screenwidth
    )
  }

  function registerListener(event, func) {
    if (window.addEventListener) {
      window.addEventListener(event, func)
    } else {
      window.attachEvent(`on${event}`, func)
    }
  }
}

export { lazy }
