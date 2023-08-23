<template>
  <div class="mx-auto space-y-2 lg:col-start-1 lg:row-start-1 lg:max-w-none">
    <div :class="outerClass" class="relative">
      <div class="absolute inset-0 bg-cover bg-center" :class="imageClass" :style="{ 'background-image': `url(${url})` }" />
      <div class="relative flex h-[500px] flex-col items-center justify-center p-8 text-center" :class="textClass">
        <div class="pb-2 font-display text-2xl font-semibold md:text-4xl">
          {{ templatevar.heading }}
        </div>
        <div v-if="templatevar.subheading" class="mb-2 font-display text-xl font-semibold">
          {{ templatevar.subheading }}
        </div>
        <div v-if="templatevar.html" class="prose-invert max-w-none pb-2" v-html="templatevar.html" />
        <cgn-button v-if="templatevar.button_link" :url="templatevar.button_link" :templatevar-colour="templatevar.button_colour">
          {{ templatevar.button_text }}
        </cgn-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { CognitoImage } from '~cognito/models/Cognito/Image'

class Templatevars {
  heading?: string
  subheading?: string
  html?: string
  background_image?: CognitoImage
  overlay_colour?: string
  image_opacity?: string
  image_saturation?: string
  text_colour?: string
  parallax?: number
  button_link?: string
  button_text?: string
  button_colour?: string
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
    return 'bg-white'
  }
  if (props.templatevar.overlay_colour == 'blk') {
    return 'bg-black'
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
  let classes = ''

  classes += [
    { name: 'opacity-10', id: '10' },
    { name: 'opacity-30', id: '30' },
    { name: 'opacity-50', id: '50' },
    { name: 'opacity-70', id: '70' },
    { name: 'opacity-90', id: '90' },
    { name: 'opacity-100', id: '100' },
  ].find(e => e.id === props.templatevar.image_opacity)?.name

  classes += ` ${[
  { name: 'saturate-0', id: '0' },
  { name: 'saturate-50', id: '50' },
  { name: 'saturate-100', id: '100' },
].find(e => e.id === props.templatevar.image_saturation)?.name}`

  if (props.templatevar.parallax == 1) {
    classes += ' sm:bg-fixed'
  }

  return classes
})

const url = ref('')
const loadImage = () => {
  if (props.templatevar.background_image) {
    url.value = props.templatevar.background_image.url
  }
}
onMounted(() => {
  loadImage()
})
onServerPrefetch(async () => {
  await loadImage()
})
</script>
