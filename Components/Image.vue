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
  field: {
    type: String,
    default: 'image',
  },
  width: {
    type: Number,
    required: true,
  },
  aspect: {
    type: String,
    required: true,
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
})

const image = ref()

const imageIsVisible = useElementVisibility(image)
const urlGetter = useImageUrl()

let all_done = false
let webp_supported = false
let avif_supported = false

const blank_webp = 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAAQAFZQOCAYAAAAMAEAnQEqAQABAAEYOCekAANwAP77nMAA'
const src = ref(blank_webp)
const show_image = ref('')
const last_image_url = ref('')

const imageAspect = computed(() => {
  const aspect = props.aspect.match(/\d+/g)
  const aspectX = Number.parseInt(aspect?.at(0) || '1')
  const aspectY = Number.parseInt(aspect?.at(1) || '1')
  return { width: aspectX, height: aspectY }
})
const imageHeight = computed(() => {
  return (props.width / imageAspect.value.width) * imageAspect.value.height
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
  return urlGetter.getUrl(props.imageHash, width, props.aspect, extension)
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
  if (image.value.clientHeight === 0) {
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

  let width = Math.round(image.value.clientWidth * window.devicePixelRatio)
  const height = Math.round(image.value.clientHeight * window.devicePixelRatio)
  if (height === 0) {
    return
  }

  // Make it to the closest upper 25px - not pixel perfect but close for similar sized screens
  const roundTo = 25
  const newWidth = Math.ceil(width / roundTo) * roundTo
  if (newWidth > 0) {
    width = newWidth
  }

  if (!imageIsVisible.value) {
    return
  }
  nextTick(() => {
    all_done = true
    show_image.value = getImageUrl(width)
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
  src.value = urlGetter.getUrl(props.imageHash, props.field, props.width, props.aspect, props.extension || 'jpg')
})
</script>
