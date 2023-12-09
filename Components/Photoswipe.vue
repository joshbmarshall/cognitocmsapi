<template>
  <div :id="props.galleryId">
    <slot>
      <a
        v-for="(image, index) in images"
        :key="index"
        :href="image.getScaledUrl(1920)"
        data-pswp-width="1920"
        :data-pswp-height="image.getScaledHeight(1920)"
        target="_blank"
        rel="noreferrer"
      >
        <cgn-lazy-image
          :image="image"
        />
      </a>
    </slot>
  </div>
</template>

<script setup lang="ts">
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { CognitoImage } from '~cognito/models/Cognito/Image'

const props = defineProps({
  images: {
    type: Array<CognitoImage>,
    default: () => [],
  },
  galleryId: {
    type: String,
    default: 'pswipe',
  },
})

let lightbox: any = null
const images = computed(() => {
  return props.images.map(e => new CognitoImage(e))
})

onMounted(() => {
  if (lightbox) {
    return
  }
  nextTick(() => {
    lightbox = new PhotoSwipeLightbox({
      gallery: `#${props.galleryId}`,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })
    lightbox.init()
  })
})

onUnmounted(() => {
  if (lightbox) {
    lightbox.destroy()
    lightbox = null
  }
})
</script>
