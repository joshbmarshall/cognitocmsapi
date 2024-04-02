<template>
  <img ref="lazyelement" :src="src" :class="imageClass">
</template>

<script setup lang="ts">
import { CognitoImage } from '~cognito/models/Cognito/Image'
import { CognitoPhoto } from '~cognito/models/Cognito/Photo'
import { hiresFetchMutex } from '~cognito/plugins/mutex'

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
let all_done = false
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
  if (all_done) {
    // Only load one hi-res image at a time
    await hiresFetchMutex.dispatch(async () => {
      if (!lazyelement.value) {
        // Element has disappeared, abort
        return
      }
      img.src = show_image.value
      try {
        await img.decode()
      } catch (error) {
        console.log({ error, src: img.src })
      }
    })
  } else {
    img.src = show_image.value
    try {
      await img.decode()
    } catch (error) {
      console.log({ error, src: img.src })
      return
    }
  }
  if (!lazyelement.value) {
    // Element has disappeared, abort
    return
  }
  src.value = show_image.value
  if (props.forceSize) {
    return
  }
  if (all_done) {
    return
  }
  if (!lazyelement.value) {
    // Element has disappeared, abort
    return
  }

  const filename = show_image.value.split('/').pop()
  let width = Math.round(lazyelement.value.clientWidth * window.devicePixelRatio)
  let height = Math.round(lazyelement.value.clientHeight * window.devicePixelRatio)

  if (height === 0) {
    return
  }

  // Make it to the closest upper 25px - not pixel perfect but close for similar sized screens
  const roundTo = 25
  const newWidth = Math.ceil(width / roundTo) * roundTo
  if (newWidth > 0) {
    height = Math.ceil(height * newWidth / width)
    width = newWidth
  }

  // Keep ratio for images that are cropped on-screen by hiding portions of the image, ie square thumbnails
  if (props.image?.width && props.image?.height) {
    const ratio = props.image.width / props.image.height
    const checkWidth = Math.abs(Math.floor(props.image.height * width / height) - props.image.width)

    if (checkWidth > 1) {
      // Is definitely a different shape
      if (width / height > ratio) {
        height = Math.ceil(width / ratio)
      } else {
        width = Math.ceil(height * ratio)
      }
    }
  }

  if (filename) {
    const hires_url = `${show_image.value.replace(filename, '') + width}x${height}:${filename}`
    nextTick(() => {
      all_done = true
      show_image.value = hires_url
      checkVisible()
    })
  }
}

async function newImage() {
  // Set/Reset
  all_done = false
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
  if (all_done) {
    return
  }
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
