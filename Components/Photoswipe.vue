<template>
  <div :id="props.galleryId">
    <slot>
      <a
        v-for="(image, key) in props.images"
        :key="key"
        :href="image.largeURL"
        :data-pswp-width="image.width"
        :data-pswp-height="image.height"
        target="_blank"
        rel="noreferrer"
      >
        <img :src="image.thumbnailURL" alt="">
      </a>
    </slot>
  </div>
</template>

<script setup lang="ts">
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

const props = defineProps({
  images: {
    type: Array<{
      largeURL: string
      thumbnailURL: string
      width: number
      height: number
    }>,
    default: () => [],
  },
  galleryId: {
    type: String,
    default: 'pswipe',
  },
})

let lightbox: any = null

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
