<template>
  <div v-if="props.heading" class="prose mx-auto max-w-6xl dark:prose-dark">
    <h1>{{ props.heading }}</h1>
    <p v-if="props.subheading">
      {{ props.subheading }}
    </p>
  </div>
  <div class="mx-auto grid max-w-6xl grid-cols-3 gap-2 p-2 md:grid-cols-4 lg:grid-cols-5">
    <div v-for="slide in slides" :key="slide.id" class="group relative overflow-hidden bg-black" @click="selectedSlide = slide; modal_open = true">
      <div class="mx-auto space-y-2 text-white lg:col-start-1 lg:row-start-1 lg:max-w-none">
        <div :class="outerClass(slide)" class="relative aspect-square">
          <cgn-lazy-image :image="slide.image" class="absolute inset-0 h-full object-cover object-center transition-opacity duration-300 group-hover:opacity-50" :class="[imageClass(slide)]" />
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
    </div>
  </div>
  <cgn-modal v-if="useLightbox" v-model="modal_open" fullheight>
    <template #clean-content>
      <div class="mr-4">
        <h1 class="font-display text-2xl font-semibold md:text-4xl">
          {{ selectedSlide.heading }}
        </h1>
        <div v-if="selectedSlide.sub_heading" class="font-display text-xl font-semibold">
          {{ selectedSlide.sub_heading }}
        </div>
      </div>
      <div v-if="selectedSlide.content" class="prose-invert max-w-none pb-2" v-html="selectedSlide.content" />
      <div :class="outerClass(selectedSlide)" class="relative aspect-[16/9]">
        <cgn-lazy-image :image="selectedSlide.image" :extra-aspect="props.lightboxAspect" class="w-full" />
      </div>
    </template>
    <template v-if="selectedSlide.link_button_text" #button-footer>
      <div class="w-full p-2">
        <cgn-button color-brand fullwidth :url="selectedSlide.link" :newtab="selectedSlide.link_target == 'blank'">
          {{ selectedSlide.link_button_text }}
        </cgn-button>
      </div>
    </template>
  </cgn-modal>
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
  lightboxAspect: {
    type: String,
  },
  useLightbox: {
    type: Boolean,
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

const selectedSlide = ref(new CognitoSlide())
const modal_open = ref(false)
</script>
