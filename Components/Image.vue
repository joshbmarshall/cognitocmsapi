<template>
  <img v-if="!props.background" ref="image" :src="src">
  <div v-else ref="image" :style="{ 'background-image': `url(${src})` }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { CognitoImage } from '~cognito/models/Cognito/Image'
import { hiresFetchMutex } from '~cognito/plugins/mutex'

const props = defineProps({
  imageHash: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  aspect: {
    type: String,
  },
  extension: {
    type: String,
  },
  lazy: {
    type: Boolean,
    default: true,
  },
  background: {
    type: Boolean,
  },
  parallax: {
    type: Boolean,
  },
})

const image = ref()
const imageSize = useElementSize(image)
const windowSize = useWindowSize()
const { pixelRatio } = useDevicePixelRatio()

const imageIsVisible = useElementVisibility(image)
const urlGetter = useImageUrl()

const default_aspects = [
  { name: '16x3', ratio: 16 / 3 },
  { name: '16x9', ratio: 16 / 9 },
  { name: '8x5', ratio: 8 / 5 },
  { name: '4x3', ratio: 4 / 3 },
  { name: '1x1', ratio: 1 / 1 },
  { name: '3x4', ratio: 3 / 4 },
  { name: '5x8', ratio: 5 / 8 },
  { name: '9x16', ratio: 9 / 16 },
] // Make sure this is ordered from widest to tallest
const sizeRounding = 25

let all_done = false
let webp_supported = false
let avif_supported = false

const blank_webp = 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAAQAFZQOCAYAAAAMAEAnQEqAQABAAEYOCekAANwAP77nMAA'
const src = ref(blank_webp)
const show_image = ref('')
const last_image_url = ref('')

const desiredWidth = computed(() => {
  let actualWidth = 0
  if (props.parallax) {
    actualWidth = Math.round(windowSize.width.value * pixelRatio.value)
  } else {
    actualWidth = Math.round(imageSize.width.value * pixelRatio.value)
  }
  return Math.ceil(actualWidth / sizeRounding) * sizeRounding
})
const desiredHeight = computed(() => {
  let actualHeight = 0
  if (props.parallax) {
    actualHeight = Math.round(windowSize.height.value * pixelRatio.value)
  } else {
    actualHeight = Math.round(imageSize.height.value * pixelRatio.value)
  }
  return Math.ceil(actualHeight / sizeRounding) * sizeRounding
})

const imageAspect = computed(() => {
  if (props.aspect) {
    const aspect = props.aspect.match(/\d+/g)
    const aspectX = Number.parseInt(aspect?.at(0) || '1')
    const aspectY = Number.parseInt(aspect?.at(1) || '1')
    return { name: `${aspectX}x${aspectY}`, ratio: aspectX / aspectY }
  }
  // No aspect defined, default to the nearest default
  for (let index = 0; index < default_aspects.length; index++) {
    const aspect = default_aspects[index]
    const height = desiredWidth.value / aspect.ratio
    if (height >= desiredHeight.value - sizeRounding) {
      return aspect
    }
  }
  // Didn't find an aspect that is taller than the current aspect, use the tallest available
  return default_aspects[default_aspects.length - 1]
})
const imageHeight = computed(() => {
  return props.width / imageAspect.value.ratio
})

const getImageUrl = (width: number) => {
  let extension = 'jpg'
  if (props.extension) {
    extension = props.extension
  } else if (avif_supported) {
    extension = 'avif'
  } else if (webp_supported) {
    extension = 'webp'
  }
  return urlGetter.getUrl(props.imageHash, width, imageAspect.value.name, extension)
}
const imageUrl = computed(() => {
  return getImageUrl(props.width)
})

const runImageLoader = async (source: string) => {
  const imageLoader = new Image()
  imageLoader.src = source
  try {
    await imageLoader.decode()
  } catch (error) {
    console.log({ error, src: imageLoader.src })
    return false
  }
  return true
}

async function checkVisible() {
  if (!show_image.value) {
    return
  }
  if (!image.value) {
    return
  }
  if (imageSize.height.value === 0 && !props.background) {
    // Ensure the placeholder image has a height
    return
  }

  // Load standard image
  if (all_done) {
    // Only load one hi-res image at a time
    await hiresFetchMutex.dispatch(async () => {
      if (!image.value) {
        // Element has disappeared, abort
        return
      }
      await runImageLoader(show_image.value)
    })
  } else {
    if (!await runImageLoader(show_image.value)) {
      return
    }
  }
  if (!image.value) {
    // Element has disappeared, abort
    return
  }
  src.value = show_image.value

  if (!props.lazy) {
    return
  }
  if (all_done) {
    return
  }
  if (!image.value) {
    // Element has disappeared, abort
    return
  }

  if (desiredHeight.value === 0) {
    return
  }
  if (!imageIsVisible.value) {
    return
  }
  nextTick(() => {
    all_done = true
    show_image.value = getImageUrl(desiredWidth.value)
    checkVisible()
  })
}

async function newImage() {
  // Set/Reset
  all_done = false
  show_image.value = ''
  last_image_url.value = ''
  src.value = blank_webp // clear while loading

  const url = imageUrl.value
  const placeholder = new CognitoImage().blankImageUrl(props.width, imageHeight.value)
  if (last_image_url.value == url) {
    // No need to reload same image
    return
  }
  if (!image.value) {
    // Might have browsed away or image hidden while awaiting above
    return
  }

  last_image_url.value = url
  show_image.value = ''
  if (placeholder && src.value != placeholder) {
    // Load transparent png
    src.value = placeholder
    if (!image.value.complete) {
      await new Promise((resolve) => {
        if (!image.value) {
          return
        }
        if (props.background) {
          // div for the background doesn't have image events
          resolve(true)
        }
        image.value.onload = resolve
        image.value.onerror = resolve
      })
    }
  }

  show_image.value = url
  if (!imageIsVisible.value) {
    return
  }
  nextTick(() => {
    checkVisible()
  })
}

watch(() => imageIsVisible.value, () => {
  if (all_done) {
    return
  }
  if (!imageIsVisible.value) {
    return
  }
  checkVisible()
})
watch(() => props, () => {
  newImage()
}, { deep: true })

onMounted(async () => {
  webp_supported = await useWebpStore().isSupported()
  avif_supported = await useAVIFStore().isSupported()
  await newImage()
})

onServerPrefetch(async () => {
  src.value = urlGetter.getUrl(props.imageHash, props.width, props.aspect || 'raw', props.extension || 'jpg')
})
</script>
