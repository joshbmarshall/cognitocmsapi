<template>
  <div class="gap-4 sm:flex">
    <div class="sm:w-2/5" :class="{ 'sm:order-last': templatevar.image_align == 'right' }">
      <cgn-lazy-image v-if="templatevar.image" :image="templatevar.image" class="rounded-md" />
    </div>
    <div class="flex flex-col sm:w-3/5">
      <div v-if="templatevar.heading" class="cgn-heading cgn-heading-1 font-display text-black dark:text-white">
        {{ templatevar.heading }}
      </div>
      <div class="prose max-w-none dark:prose-invert" v-html="templatevar.html" />
      <cgn-button v-if="templatevar.button_text" color-brand size-large :url="templatevar.button_link">
        {{ templatevar.button_text }}
      </cgn-button>
    </div>
  </div>
</template>

<script lang="ts">
import type { CognitoImage } from '~cognito/models/Cognito/Image'

class Templatevars {
  heading?: string
  html?: string
  image?: CognitoImage
  image_align?: string
  button_link?: string
  button_text?: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})
</script>
