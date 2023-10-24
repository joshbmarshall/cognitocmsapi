<template>
  <div class="gap-4 sm:flex">
    <cgn-lazy-image v-if="templatevar.image" :image="templatevar.image" class="sm:w-2/5" :class="{ 'sm:order-last': templatevar.image_align == 'right' }" />
    <div class="prose flex max-w-none grow flex-col dark:prose-invert" v-html="templatevar.html" />
  </div>
</template>

<script lang="ts">
import type { CognitoImage } from '~cognito/models/Cognito/Image'

class Templatevars {
  html?: string
  image?: CognitoImage
  image_align?: string
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
