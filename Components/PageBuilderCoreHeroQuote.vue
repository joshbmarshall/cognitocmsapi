<template>
  <div class="space-y-2 text-white mx-auto lg:max-w-none lg:row-start-1 lg:col-start-1">
    <div :class="outerClass" class="relative">
      <div class="absolute inset-0 bg-center bg-cover" :class="imageClass" :style="imageStyle" />
      <div class="relative p-8 text-center flex flex-col justify-center items-center h-[500px]" :class="textClass">
        <h1 class="text-2xl md:text-4xl font-semibold font-display pb-2">
          {{ templatevar.heading }}
        </h1>
        <h2 v-if="templatevar.subheading" class="text-xl font-semibold font-display">
          {{ templatevar.subheading }}
        </h2>
        <div v-if="templatevar.html" class="prose-invert max-w-none pb-2" v-html="templatevar.html" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CognitoImage } from '~cognito/models/Cognito/Image'
class Templatevars {
  heading?: string
  subheading?: string
  html?: string
  background_image?: string
  overlay_colour?: string
  image_opacity?: string
  image_saturation?: string
  text_colour?: string
  parallax?: number
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})

const outerClass = computed(() => {
  if (props.templatevar.overlay_colour == 'wht') {
    return 'bg-white-500'
  }
  if (props.templatevar.overlay_colour == 'blk') {
    return 'bg-black-500'
  }
  if (props.templatevar.overlay_colour == 'bnd') {
    return 'bg-brand-500'
  }
  if (props.templatevar.overlay_colour == 'suc') {
    return 'bg-success-500'
  }
  if (props.templatevar.overlay_colour == 'inf') {
    return 'bg-info-500'
  }
  if (props.templatevar.overlay_colour == 'wrn') {
    return 'bg-warning-500'
  }
  if (props.templatevar.overlay_colour == 'dng') {
    return 'bg-danger-500'
  }
  return ''
})

const textClass = computed(() => {
  if (props.templatevar.text_colour == 'wht') {
    return 'text-white'
  }
  if (props.templatevar.text_colour == 'blk') {
    return 'text-black'
  }
  return ''
})

const imageClass = computed(() => {
  let string = `opacity-${props.templatevar.image_opacity} saturate-${props.templatevar.image_saturation}`
  if (props.templatevar.parallax == 1) {
    string += ' bg-fixed'
  }
  return string
})
const imageStyle = computed(() => {
  return { 'background-image': `url(${url.value})` }
})

const url = ref('')
const loadImage = async () => {
  if (props.templatevar.background_image) {
    await new CognitoImage().find_one({
      url: props.templatevar.background_image,
      image_aspect: '16x9',
      image_width: 1920,
    })
      .then((data) => {
        url.value = data.url
      })
  }
}
onMounted(() => {
  loadImage()
})
onServerPrefetch(async () => {
  await loadImage()
})
</script>
