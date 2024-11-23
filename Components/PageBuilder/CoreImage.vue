<template>
  <cgn-link :to="props.templatevar.link_to_url || ''">
    <cgn-image v-if="props.templatevar.image_hashes?.image" :image-hash="props.templatevar.image_hashes.image" :width="props.templatevar.initial_width" :aspect="props.templatevar.aspect" class="w-full" />
    <cgn-lazy-image v-else-if="props.templatevar.image" :image="props.templatevar.image" />
  </cgn-link>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { CognitoImage } from '~cognito/models/Cognito/Image'

class Templatevars {
  image?: CognitoImage
  image_hashes?: { image: string }
  initial_width?: number
  aspect?: string
  link_to_url?: string
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
