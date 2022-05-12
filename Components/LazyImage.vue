<template>
  <img ref="lazyelement" :src="src">
</template>

<script setup lang="ts">
import { CognitoImage } from '~cognito/models/Cognito/Image'

const props = defineProps({
  // Give just the image if you have a CognitoImage
  image: {
    type: CognitoImage,
  },
  // Below for custom lazy images
  placeholder: {
    type: String,
  },
  url: {
    type: String,
  },
  webp: {
    type: String,
  },
})

const lazyelement = ref()

let use_webp = false
const show_image = ref('')
const placeholder = ref('')
let lazytimer = 0

const src = computed(() => {
  if (show_image.value) {
    return show_image.value
  }
  return placeholder.value
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
  let webp = props.webp
  let url = props.url
  placeholder.value = props.placeholder
  if (props.image) {
    webp = props.image.webp_url
    url = props.image.url
    placeholder.value = props.image.placeholder
  }
  testWebP((canSupportWebp: boolean) => {
    use_webp = canSupportWebp
    if (use_webp) {
      show_image.value = webp
    } else {
      show_image.value = url
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
