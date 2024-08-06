<template>
  <div class="mx-auto space-y-2 lg:col-start-1 lg:row-start-1 lg:max-w-none">
    <div :class="outerClass" class="relative overflow-hidden">
      <cgn-background-image
        v-if="props.templatevar.image_hashes && !templatevar.background_video?.file"
        class="absolute inset-0" :class="imageClass" :parallax="props.templatevar.parallax == 1"
        :image-hash="props.templatevar.image_hashes.background_image"
      />
      <div v-else-if="!templatevar.background_video?.file" class="absolute inset-0 bg-cover bg-center" :class="imageClass" :style="{ 'background-image': `url(${templatevar.background_image?.url})` }" />
      <div v-else class="absolute inset-0">
        <video
          :poster="templatevar.background_video.slate"
          autoplay
          loop
          muted
          playsinline
          class="inset-0 z-10 size-full object-cover object-center"
          :class="imageClass"
        >
          <source
            :src="templatevar.background_video?.file"
            type="video/mp4"
          >
        </video>
      </div>
      <div class="relative flex h-[500px] flex-col p-8" :class="textClass">
        <cgn-image v-if="props.templatevar.image_hashes?.overlay_image" :image-hash="props.templatevar.image_hashes.overlay_image" class="h-16 p-2" :width="100" aspect="raw" />
        <cgn-lazy-image v-else-if="templatevar.overlay_image" class="h-16 p-2" :image="templatevar.overlay_image" />
        <div class="font-title pb-2 text-2xl font-semibold md:text-4xl">
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
import type { CognitoVideo } from '~cognito/models/Cognito/Video'

class Templatevars {
  heading?: string
  subheading?: string
  html?: string
  overlay_image?: CognitoImage
  background_image?: CognitoImage
  image_hashes?: { overlay_image?: string, background_image?: string }
  background_video?: CognitoVideo
  overlay_colour?: string
  image_opacity?: string
  image_saturation?: string
  text_colour?: string
  parallax?: number
  button_link?: string
  button_text?: string
  button_colour?: string
  text_justify?: string
  text_align?: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Object as PropType<Templatevars>,
    required: true,
  },
})

const outerClass = computed(() => {
  return [
    { name: 'bg-white', id: 'wht' },
    { name: 'bg-black', id: 'blk' },
    { name: 'bg-brand-500', id: 'bnd' },
    { name: 'bg-success-500', id: 'suc' },
    { name: 'bg-info-500', id: 'inf' },
    { name: 'bg-warning-500', id: 'wrn' },
    { name: 'bg-danger-500', id: 'dng' },
    { name: '', id: '' },
  ].find(e => e.id === props.templatevar.overlay_colour)?.name
})

const textClass = computed(() => {
  let classes = ''

  classes += [
    { name: 'text-left items-start', id: 'left' },
    { name: 'text-center items-center', id: 'center' },
    { name: 'text-right items-end', id: 'right' },
  ].find(e => e.id === props.templatevar.text_justify)?.name

  classes += ` ${[
    { name: 'justify-start', id: 'top' },
    { name: 'justify-center', id: 'center' },
    { name: 'justify-end', id: 'bottom' },
  ].find(e => e.id === props.templatevar.text_align)?.name}`

  if (!props.templatevar.text_justify) {
    classes += ' text-center items-center justify-center'
  }

  classes += ` ${[
  { name: 'text-white', id: 'wht' },
  { name: 'text-black', id: 'blk' },
  { name: 'text-brand-500', id: 'bnd' },
  { name: 'text-success-500', id: 'suc' },
  { name: 'text-info-500', id: 'inf' },
  { name: 'text-warning-500', id: 'wrn' },
  { name: 'text-danger-500', id: 'dng' },
  ].find(e => e.id === props.templatevar.text_colour)?.name}`

  if (props.templatevar.parallax == 1) {
    classes += ' sm:bg-fixed'
  }

  return classes
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
</script>
