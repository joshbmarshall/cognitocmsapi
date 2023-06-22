<template>
  <img ref="lazyelement" :src="src" :class="imageClass">
</template>

<script setup lang="ts">
import { CognitoImage } from '~cognito/models/Cognito/Image'
import { CognitoPhoto } from '~cognito/models/Cognito/Photo'

const props = defineProps({
  // Give just the image if you have a CognitoImage
  image: {
    type: [CognitoImage, CognitoPhoto, Object],
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
  imageClass: {
    type: String,
  },
  imageHash: {
    type: String,
  },
  imageId: {
    type: String,
  },
  imageAspect: {
    type: String,
  },
  imageWidth: {
    type: String,
  },
  forceSize: {
    type: Boolean,
    default: false,
  },
  extraAspect: {
    type: String,
  },
})

const lazyelement = ref()

let use_webp = false
const blank_webp = 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAAQAFZQOCAYAAAAMAEAnQEqAQABAAEYOCekAANwAP77nMAA'
const show_image = ref('')
const last_image_url = ref('')
const src = ref(blank_webp)
let lazytimer = 0

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  if (rect.width == 0) {
    return false
  }
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
async function checkVisible() {
  if (!lazyelement.value) {
    clearInterval(lazytimer)
    return
  }
  if (!lazyelement.value.complete) {
    // Wait for the placeholder image to load
    await new Promise((resolve) => {
      lazyelement.value.onload = resolve
    })
  }
  if (lazyelement.value.naturalHeight === 0) {
    // Ensure the placeholder image has a height
    return
  }
  if (!isInViewport(lazyelement.value)) {
    return
  }

  if (!show_image.value) {
    return
  }

  const filename = show_image.value.split('/').pop()
  const width = Math.floor(lazyelement.value.clientWidth * window.devicePixelRatio)
  const height = Math.floor(lazyelement.value.clientHeight * window.devicePixelRatio)

  if (height === 0) {
    return
  }

  if (filename) {
    src.value = `${show_image.value.replace(filename, '') + width}x${height}:${filename}`
  }
  clearInterval(lazytimer)
}

function testWebP(cbfn: Function) {
  const webP = new Image()
  webP.onload = webP.onerror = function () {
    cbfn(webP.height === 2)
  }
  webP.src = blank_webp
}
async function newImage() {
  // Set/Reset
  show_image.value = ''
  last_image_url.value = ''
  src.value = blank_webp // clear while loading
  if (lazytimer) {
    clearInterval(lazytimer)
  }

  // Hide if already set
  let webp = props.webp
  let url = props.url
  let placeholder = props.placeholder
  let image = props.image
  if (image) {
    if (image.image) {
      // This is a CognitoPhoto
      image = image.image
    }
    webp = image.webp_url
    url = image.url
    placeholder = image.placeholder
    if (props.extraAspect) {
      const extraAspect = image.extra_aspects.find(e => e.aspect === props.extraAspect)
      if (extraAspect) {
        webp = extraAspect.webp_url
        url = extraAspect.url
        placeholder = extraAspect.placeholder
      }
    }
  }
  if (props.imageHash && props.imageAspect && props.imageWidth) {
    await new CognitoImage().getByHash({
      hash: props.imageHash,
      image_aspect: props.imageAspect,
      image_width: props.imageWidth,
    })
      .then((data) => {
        webp = data.webp_url
        url = data.url
        placeholder = data.placeholder
      })
  }
  if (props.imageId && props.imageAspect && props.imageWidth) {
    await new CognitoImage().find_one({
      url: props.imageId,
      image_aspect: props.imageAspect,
      image_width: props.imageWidth,
    })
      .then((data) => {
        webp = data.webp_url
        url = data.url
        placeholder = data.placeholder
      })
  }
  if (last_image_url.value == url) {
    // No need to reload same image
    return
  }
  last_image_url.value = url
  show_image.value = ''
  if (placeholder) {
    // Load transparent png
    src.value = placeholder
    await new Promise((resolve) => {
      if (!lazyelement.value) {
        return
      }
      lazyelement.value.onload = resolve
    })
  }
  if (url) {
    // Load standard image
    src.value = url
    await new Promise((resolve) => {
      if (!lazyelement.value) {
        return
      }
      lazyelement.value.onload = resolve
    })
  }
  if (props.forceSize) {
    return
  }
  testWebP((canSupportWebp: boolean) => {
    use_webp = canSupportWebp
    if (use_webp && webp) {
      show_image.value = webp
    } else if (url) {
      show_image.value = url
    }
    // Check immediately if in view
    checkVisible()
    // Check every half second
    lazytimer = setInterval(() => {
      checkVisible()
    }, 500)
  })
}
watch(() => props, () => {
  newImage()
}, {
  deep: true,
})

onMounted(() => {
  newImage()
})

onUnmounted(() => {
  if (lazytimer) {
    clearInterval(lazytimer)
  }
})
onServerPrefetch(async () => {
  if (props.image) {
    src.value = props.image.url
  }
  if (props.url) {
    src.value = props.url
  }
  if (props.imageHash && props.imageAspect && props.imageWidth) {
    await new CognitoImage().getByHash({
      hash: props.imageHash,
      image_aspect: props.imageAspect,
      image_width: props.imageWidth,
    })
      .then((data) => {
        src.value = data.url
      })
  }
})
</script>
