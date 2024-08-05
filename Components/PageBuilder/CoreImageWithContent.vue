<template>
  <div>
    <div class="gap-4 sm:flex">
      <div class="sm:w-2/5" :class="{ 'sm:order-last': props.templatevar.image_align == 'right' }">
        <cgn-image v-if="props.templatevar.image_hashes?.image" :image-hash="props.templatevar.image_hashes.image" :width="100" aspect="4x3" class="w-full rounded-md" />
        <cgn-lazy-image v-else-if="props.templatevar.image" :image="props.templatevar.image" class="rounded-md" />
      </div>
      <div class="flex flex-col pt-2 sm:w-3/5 sm:pt-0">
        <div v-if="props.templatevar.heading" class="cgn-heading cgn-heading-1 font-display text-black dark:text-white">
          {{ props.templatevar.heading }}
        </div>
        <div class="prose max-w-none dark:prose-invert prose-p:mt-0" v-html="props.templatevar.html" />
      </div>
    </div>
    <div class="pt-1">
      <cgn-button v-if="props.templatevar.button_text" color-brand size-large fullwidth :url="props.templatevar.button_link">
        {{ props.templatevar.button_text }}
      </cgn-button>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { CognitoImage } from '~cognito/models/Cognito/Image'

class Templatevars {
  heading?: string
  html?: string
  image?: CognitoImage
  image_hashes?: { image: string }
  image_align?: string
  button_link?: string
  button_text?: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Object as PropType<Templatevars>,
    required: true,
  },
})
</script>
