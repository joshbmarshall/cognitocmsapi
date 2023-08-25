<template>
  <div class="mx-auto flex max-w-6xl flex-wrap justify-center p-2">
    <div v-for="slide in props.gallery.slides" :key="slide.id" class="group relative w-1/3 overflow-hidden p-1">
      <div class="mx-auto space-y-2 text-white lg:max-w-none">
        <cgn-lazy-image :image="slide.image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CognitoGallery } from '~cognito/models/Cognito/Gallery'

const props = defineProps({
  gallery: {
    type: CognitoGallery,
    required: true,
  },
})
</script>
