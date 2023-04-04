<template>
  <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 max-w-6xl p-2 mx-auto gap-2">
    <div v-for="slide in props.gallery.slides" :key="slide.id" @click="selectedSlide = slide; modal_open = true">
      <div class="space-y-2 text-white mx-auto lg:max-w-none lg:row-start-1 lg:col-start-1">
        <div :class="new CognitoSlide(slide).outerClass()" class="relative aspect-square">
          <div class="absolute inset-0 bg-center bg-cover" :class="new CognitoSlide(slide).imageClass()" :style="{ 'background-image': `url(${slide.image.url})` }" />
        </div>
      </div>
    </div>
  </div>
  <cgn-modal v-model="modal_open">
    <template #clean-content>
      <div class="mr-4">
        <h1 class="text-2xl md:text-4xl font-semibold font-display">
          {{ selectedSlide.heading }}
        </h1>
        <h2 v-if="selectedSlide.sub_heading" class="text-xl font-semibold font-display">
          {{ selectedSlide.sub_heading }}
        </h2>
      </div>
      <div v-if="selectedSlide.content" class="prose-invert max-w-none pb-2" v-html="selectedSlide.content" />
      <div :class="new CognitoSlide(selectedSlide).outerClass()" class="relative aspect-[16/9]">
        <div class="absolute inset-0 bg-center bg-cover" :class="new CognitoSlide(selectedSlide).imageClass()" :style="{ 'background-image': `url(${selectedSlide.image.url})` }" />
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
})

const selectedSlide = ref(new CognitoSlide())
const modal_open = ref(false)
</script>
