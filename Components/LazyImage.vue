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
    default: '',
  },
  webp: {
    type: String,
  },
  avif: {
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
let use_avif = false
const blank_webp = 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAAQAFZQOCAYAAAAMAEAnQEqAQABAAEYOCekAANwAP77nMAA'
const show_image = ref('')
const last_image_url = ref('')
const src = ref(blank_webp)
const imageIsVisible = useElementVisibility(lazyelement)

async function checkVisible() {
  if (!show_image.value) {
    return
  }

  if (!lazyelement.value) {
    return
  }

  if (lazyelement.value.clientHeight === 0) {
    // Ensure the placeholder image has a height
    return
  }

  // Load standard image
  const img = new Image()
  img.src = show_image.value
  await img.decode()
  src.value = show_image.value
  if (props.forceSize) {
    return
  }

  const filename = show_image.value.split('/').pop()
  const width = Math.floor(lazyelement.value.clientWidth * window.devicePixelRatio)
  const height = Math.floor(lazyelement.value.clientHeight * window.devicePixelRatio)

  if (height === 0) {
    return
  }

  if (filename) {
    nextTick(() => {
      if (!lazyelement.value) {
        // Element has disappeared, abort
        return
      }

      src.value = `${show_image.value.replace(filename, '') + width}x${height}:${filename}`
    })
  }
}

async function newImage() {
  // Set/Reset
  show_image.value = ''
  last_image_url.value = ''
  src.value = blank_webp // clear while loading

  // Hide if already set
  let webp = props.webp
  let avif = props.avif
  let url = props.url
  let placeholder = props.placeholder
  let image = props.image
  if (image) {
    if (image.image) {
      // This is a CognitoPhoto
      image = image.image
    }
    webp = image.webp_url
    avif = image.avif_url
    url = image.url
    placeholder = image.placeholder
    if (image.width && image.height) {
      // Create image of that size so no need for http request
      placeholder = new CognitoImage().blankImageUrl(image.width, image.height)
    }
    if (props.extraAspect) {
      const extraAspect = image.extra_aspects.find(e => e.aspect === props.extraAspect)
      if (extraAspect) {
        webp = extraAspect.webp_url
        avif = extraAspect.avif_url
        url = extraAspect.url
        placeholder = extraAspect.placeholder
      }
    }
  }
  if (props.imageHash && props.imageAspect && props.imageWidth) {
    const data = await new CognitoImage().getByHash({
      hash: props.imageHash,
      image_aspect: props.imageAspect,
      image_width: props.imageWidth,
    })
    webp = data.webp_url
    avif = data.avif_url
    url = data.url
    placeholder = data.placeholder
  }
  if (props.imageId && props.imageAspect && props.imageWidth) {
    const data = await new CognitoImage().find_one({
      url: props.imageId,
      image_aspect: props.imageAspect,
      image_width: props.imageWidth,
    })
    webp = data.webp_url
    avif = data.avif_url
    url = data.url
    placeholder = data.placeholder
  }
  if (last_image_url.value == url) {
    // No need to reload same image
    return
  }
  if (!lazyelement.value) {
    // Might have browsed away or image hidden while awaiting above
    return
  }
  last_image_url.value = url
  show_image.value = ''
  if (placeholder && src.value != placeholder) {
    // Load transparent png
    src.value = placeholder
    if (!lazyelement.value.complete) {
      await new Promise((resolve) => {
        if (!lazyelement.value) {
          return
        }
        lazyelement.value.onload = resolve
        lazyelement.value.onerror = resolve
      })
    }
  }

  if (use_avif && avif && !url?.endsWith('svg')) {
    show_image.value = avif
  } else if (use_webp && webp && !url?.endsWith('svg')) {
    show_image.value = webp
  } else if (url) {
    show_image.value = url
  }
  if (imageIsVisible.value) {
    nextTick(() => {
      checkVisible()
    })
  }
}
watch(() => imageIsVisible.value, () => {
  if (imageIsVisible.value) {
    checkVisible()
  }
})
watch(() => props, () => {
  newImage()
}, {
  deep: true,
})

onMounted(async () => {
  use_webp = await useWebpStore().isSupported()
  use_avif = await useAVIFStore().isSupported()
  await newImage()
})

onServerPrefetch(async () => {
  if (props.image) {
    src.value = props.image.url
  }
  if (props.url) {
    src.value = props.url
  }
  if (props.imageHash && props.imageAspect && props.imageWidth) {
    const data = await new CognitoImage().getByHash({
      hash: props.imageHash,
      image_aspect: props.imageAspect,
      image_width: props.imageWidth,
    })
    src.value = data.url
  }
  if (props.imageId && props.imageAspect && props.imageWidth) {
    const data = await new CognitoImage().find_one({
      url: props.imageId,
      image_aspect: props.imageAspect,
      image_width: props.imageWidth,
    })
    console.log(data)
    src.value = data.url
  }
})
</script>
