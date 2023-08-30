<template>
  <Swiper
    :slides-per-view="1"
    :autoplay="{
      delay: 4000,
      disableOnInteraction: false,
    }"
    :modules="swiperModules"
  >
    <SwiperSlide v-for="slide in props.gallery.slides" :key="slide.id">
      <router-link :to="slide.link" :class="{ 'pointer-events-none': !slide.link }">
        <div class="mx-auto space-y-2 text-white lg:col-start-1 lg:row-start-1 lg:max-w-none">
          <div :class="outerClass(slide)" class="relative">
            <div class="absolute inset-0 bg-cover bg-center" :class="imageClass(slide)" :style="{ 'background-image': `url(${slide.image.url})` }" />
            <div class="relative flex h-[500px] flex-col items-center justify-center p-8 text-center" :class="textClass(slide)">
              <div class="pb-2 font-title text-2xl font-semibold md:text-4xl">
                {{ slide.heading }}
              </div>
              <div v-if="slide.sub_heading" class="font-display text-xl font-semibold">
                {{ slide.sub_heading }}
              </div>
              <div v-if="slide.content" class="prose-invert max-w-none pb-2" v-html="slide.content" />
              <cgn-button v-if="slide.link_button_text && slide.link" color-brand :url="slide.link" class="pointer-events-auto w-full md:w-auto" extra-classes="w-full md:w-auto">
                {{ slide.link_button_text }}
              </cgn-button>
            </div>
          </div>
        </div>
      </router-link>
    </SwiperSlide>
  </Swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper'
import { CognitoGallery } from '~cognito/models/Cognito/Gallery'
import { CognitoSlide } from '~cognito/models/Cognito/Slide'
import 'swiper/css'

const props = defineProps({
  gallery: {
    type: CognitoGallery,
    required: true,
  },
})
const outerClass = (slide: CognitoSlide) => {
  return new CognitoSlide(slide).outerClass()
}
const imageClass = (slide: CognitoSlide) => {
  return new CognitoSlide(slide).imageClass()
}
const textClass = (slide: CognitoSlide) => {
  return new CognitoSlide(slide).textClass()
}
const swiperModules = ref([Autoplay])
</script>
