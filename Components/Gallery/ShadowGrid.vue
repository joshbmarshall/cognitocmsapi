<template>
  <div v-if="props.heading" class="prose dark:prose-dark mx-auto max-w-6xl">
    <h1>{{ props.heading }}</h1>
    <p v-if="props.subheading">
      {{ props.subheading }}
    </p>
  </div>
  <div class="grid grid-cols-2 md:grid-cols-3 max-w-6xl p-5 mx-auto gap-5">
    <div v-for="slide in slides" :key="slide.id" class="group bg-black overflow-hidden relative shadow-md hover:shadow-lg transition-shadow">
      <div class="space-y-2 text-white mx-auto lg:max-w-none lg:row-start-1 lg:col-start-1">
        <div :class="outerClass(slide)" class="relative aspect-square">
          <div class="absolute inset-0 bg-center bg-cover transition-opacity duration-300" :class="[{ 'group-hover:opacity-50': showHeading }, imageClass(slide)]" :style="{ 'background-image': `url(${slide.image.url})` }" />
        </div>
      </div>
      <div v-if="showHeading" class="absolute right-0 bottom-0 p-2 text-right translate-y-full group-hover:translate-y-0 text-white transition-transform duration-300">
        <div class="text-2xl font-semibold font-display">
          {{ slide.heading }}
        </div>
        <div v-if="slide.sub_heading" class="font-semibold font-display">
          {{ slide.sub_heading }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CognitoGallery } from '~cognito/models/Cognito/Gallery'
import { CognitoSlide } from '~cognito/models/Cognito/Slide'

const props = defineProps({
  gallery: {
    type: CognitoGallery,
    required: true,
  },
  heading: {
    type: String,
  },
  subheading: {
    type: String,
  },
  showHeading: {
    type: Boolean,
  },
  limitSlides: {
    type: Number,
  },
})

const slides = computed(() => {
  if (props.limitSlides > 0) {
    return props.gallery.slides.slice(0, props.limitSlides)
  }
  return props.gallery.slides
})

function outerClass(slide: CognitoSlide) {
  return new CognitoSlide(slide).outerClass()
}
function imageClass(slide: CognitoSlide) {
  return new CognitoSlide(slide).imageClass()
}
</script>
