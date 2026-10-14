<template>
  <img ref="lazyelement" :src="src" :class="imageClass">
</template>

<script setup lang="ts">
import { CognitoImage } from '~cognito/models/Cognito/Image'
import { CognitoPhoto } from '~cognito/models/Cognito/Photo'
import { computeSizedUrl } from '~cognito/composables/imageSizing'

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

async function loadImage(source: string): Promise<boolean> {
  const image = new Image()
  image.src = source
  try {
    await image.decode()
    return true
  } catch (error) {
    console.log({ error, src: image.src })
    return false
  }
}

async function checkVisible() {
  if (!show_image.value) {
    return
  }

  if (!lazyelement.value) {
    return
  }

  // Fixed-size images load their exact url without measuring the element
  if (props.forceSize) {
    if (!await loadImage(show_image.value)) {
      return
    }
    if (!lazyelement.value) {
      return
    }
    src.value = show_image.value
    return
  }

  const sized_url = computeSizedUrl({
    url: show_image.value,
    clientWidth: lazyelement.value.clientWidth,
    clientHeight: lazyelement.value.clientHeight,
    devicePixelRatio: window.devicePixelRatio,
    imageWidth: props.image?.width,
    imageHeight: props.image?.height,
  })

  // Not laid out yet (e.g. closed tab/carousel). Leave it to retry once it has
  // a width and is revealed.
  if (!sized_url) {
    return
  }

  // One download: the placeholder is already showing, so only the sized file
  // is fetched.
  if (!await loadImage(sized_url)) {
    return
  }
  if (!lazyelement.value) {
    // Element has disappeared, abort
    return
  }
  src.value = sized_url
  all_done = true
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
  const urlprefix = url.split('.').slice(0, -1).join('.')
  if (!webp) {
    webp = `${urlprefix}.webp`
  }
  if (!avif) {
    avif = `${urlprefix}.avif`
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
  use_avif = false // await useAVIFStore().isSupported()
  await newImage()
})

onServerPrefetch(async () => {
  // Render the placeholder only. The sized image is chosen in the browser, so
  // the server has no viewport to size against and a template-size file would
  // only be a wasted download.
  if (props.placeholder) {
    src.value = props.placeholder
  }
  if (props.image) {
    const image = props.image.image ? props.image.image : props.image
    src.value = image.placeholder || src.value
  }
  if (props.imageHash && props.imageAspect && props.imageWidth) {
    const data = await new CognitoImage().getByHash({
      hash: props.imageHash,
      image_aspect: props.imageAspect,
      image_width: props.imageWidth,
    })
    src.value = data.placeholder || src.value
  }
  if (props.imageId && props.imageAspect && props.imageWidth) {
    const data = await new CognitoImage().find_one({
      url: props.imageId,
      image_aspect: props.imageAspect,
      image_width: props.imageWidth,
    })
    src.value = data.placeholder || src.value
  }
})
</script>
