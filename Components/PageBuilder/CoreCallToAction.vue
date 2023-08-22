<template>
  <div class="mx-auto space-y-2 lg:col-start-1 lg:row-start-1 lg:max-w-none">
    <div class="flex flex-col items-center justify-center gap-2 md:flex-row">
      <cgn-lazy-image v-if="templatevar.left_image" :image="templatevar.left_image_rendered" class="w-full md:w-1/2" />
      <div class="w-full p-4 md:w-1/2 md:p-8">
        <div class="pb-2 font-display text-xl font-semibold xl:text-4xl">
          {{ templatevar.heading }}
        </div>
        <div v-if="templatevar.subheading" class="mb-2 font-display text-xl font-semibold">
          {{ templatevar.subheading }}
        </div>
        <div v-if="templatevar.html" class="prose-invert max-w-none pb-2" v-html="templatevar.html" />
        <cgn-button v-if="templatevar.button_link" :url="templatevar.button_link" :templatevar-colour="templatevar.button_colour">
          {{ templatevar.button_text }}
        </cgn-button>
      </div>
      <cgn-lazy-image v-if="templatevar.right_image" :image="templatevar.right_image_rendered" />
    </div>
  </div>
</template>

<script lang="ts">
import type { CognitoImage } from '~cognito/models/Cognito/Image'

class Templatevars {
  heading?: string
  subheading?: string
  html?: string
  left_image?: string
  left_image_rendered?: CognitoImage
  right_image?: string
  right_image_rendered?: CognitoImage
  button_link?: string
  button_text?: string
  button_colour?: string
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
