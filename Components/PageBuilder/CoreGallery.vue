<template>
  <div>
    <cgn-gallery-slider v-if="props.templatevar.type == 'slider'" :gallery="gallery" />
    <cgn-gallery-grid v-else-if="props.templatevar.type == 'grid'" :gallery="gallery" />
  </div>
</template>

<script lang="ts">
import { CognitoGallery } from '~cognito/models/Cognito/Gallery'
class Templatevars {
  heading?: string
  subheading?: string
  gallery?: number
  type?: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})

const gallery = ref(new CognitoGallery())
const loadGallery = async () => {
  if (props.templatevar.gallery) {
    const data = await new CognitoGallery().find_one({
      id: props.templatevar.gallery,
      image_aspect: '16x9',
      image_width: 1920,
    })
    gallery.value = data
  }
}
onMounted(() => {
  loadGallery()
})
onServerPrefetch(async () => {
  await loadGallery()
})
</script>
