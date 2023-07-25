<template>
  <div v-if="props.heading" class="prose mx-auto max-w-6xl dark:prose-dark">
    <h1>{{ props.heading }}</h1>
    <p v-if="props.subheading">
      {{ props.subheading }}
    </p>
  </div>
  <div class="mx-auto grid max-w-6xl grid-cols-2 gap-5 p-5 md:grid-cols-3">
    <div v-for="slide in slides" :key="slide.id" class="group relative overflow-hidden bg-black shadow-md transition-shadow hover:shadow-lg">
      <cgn-link :to="slide.link">
        <div class="mx-auto space-y-2 text-white lg:col-start-1 lg:row-start-1 lg:max-w-none">
          <div :class="outerClass(slide)" class="relative aspect-square">
            <div class="absolute inset-0 bg-cover bg-center transition-opacity duration-300" :class="[{ 'group-hover:opacity-50': showHeading }, imageClass(slide)]" :style="{ 'background-image': `url(${slide.image.url})` }" />
          </div>
        </div>
        <div v-if="showHeading" class="absolute bottom-0 right-0 translate-y-full p-2 text-right text-white transition-transform duration-300 group-hover:translate-y-0">
          <div class="font-display text-2xl font-semibold">
            {{ slide.heading }}
          </div>
          <div v-if="slide.sub_heading" class="font-display font-semibold">
            {{ slide.sub_heading }}
          </div>
        </div>
      </cgn-link>
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
