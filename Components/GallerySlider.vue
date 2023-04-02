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
        <div class="space-y-2 text-white mx-auto lg:max-w-none lg:row-start-1 lg:col-start-1">
          <div :class="new CognitoSlide(slide).outerClass()" class="relative">
            <div class="absolute inset-0 bg-center bg-cover" :class="new CognitoSlide(slide).imageClass()" :style="{ 'background-image': `url(${slide.image.url})` }" />
            <div class="relative p-8 text-center flex flex-col justify-center items-center h-[500px]" :class="new CognitoSlide(slide).textClass()">
              <h1 class="text-2xl md:text-4xl font-semibold font-display pb-2">
                {{ slide.heading }}
              </h1>
              <h2 v-if="slide.sub_heading" class="text-xl font-semibold font-display">
                {{ slide.sub_heading }}
              </h2>
              <div v-if="slide.content" class="prose-invert max-w-none pb-2" v-html="slide.content" />
              <cgn-button v-if="slide.link_button_text && slide.link" color-brand :url="slide.link" class="w-full md:w-auto pointer-events-auto" extra-classes="w-full md:w-auto">
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
const swiperModules = ref([Autoplay])
</script>
