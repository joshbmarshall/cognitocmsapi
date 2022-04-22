<template>
  <img ref="lazyelement" :src="src">
</template>

<script setup lang="ts">
const props = defineProps({
  placeholder: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  webp: {
    type: String,
    required: true,
  },
})

const lazyelement = ref()

let use_webp = false
const show_image = ref('')
let lazytimer = 0

const src = computed(() => {
  if (show_image.value) {
    return show_image.value
  }
  return props.placeholder
})

const isInViewport = (el: HTMLElement) => {
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
const checkVisible = () => {
  if (!lazyelement.value) {
    clearInterval(lazytimer)
    return
  }
  if (!lazyelement.value.complete) {
    // Ensure the placeholder image has loaded
    return
  }
  if (lazyelement.value.naturalHeight === 0) {
    // Ensure the placeholder image has a height
    return
  }
  if (!isInViewport(lazyelement.value)) {
    return
  }
  let srcurl = props.url
  if (use_webp) {
    srcurl = props.webp
  }

  if (!srcurl) {
    return
  }

  const filename = srcurl.split('/').pop()
  const width = Math.floor(lazyelement.value.clientWidth * window.devicePixelRatio)
  const height = Math.floor(lazyelement.value.clientHeight * window.devicePixelRatio)
  if (height === 0) {
    return
  }

  show_image.value = `${srcurl.replace(filename, '') + width}x${height}:${filename}`
  clearInterval(lazytimer)
}

const testWebP = (cbfn: Function) => {
  const webP = new Image()
  webP.onload = webP.onerror = function() {
    cbfn(webP.height === 2)
  }
  webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
}

onMounted(() => {
  testWebP((canSupportWebp: boolean) => {
    use_webp = canSupportWebp
    if (use_webp) {
      show_image.value = props.webp
    } else {
      show_image.value = props.url
    }
    lazytimer = setInterval(() => {
      checkVisible()
    }, 500)
  })
})

onUnmounted(() => {
  if (lazytimer) {
    clearInterval(lazytimer)
  }
})
</script>
