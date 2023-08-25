<template>
  <div>
    <cgn-gallery-slider v-if="props.templatevar.type == 'slider'" :gallery="gallery" />
    <cgn-gallery-shadow-grid v-else-if="props.templatevar.type == 'shadowgrid'" :gallery="gallery" />
    <cgn-gallery-centered-grid v-else-if="props.templatevar.type == 'centeredgrid'" :gallery="gallery" />
    <cgn-gallery-grid
      v-else-if="props.templatevar.type == 'grid'"
      :gallery="gallery"
      :heading="props.templatevar.heading"
      :subheading="props.templatevar.subheading"
      :show-heading="props.templatevar.show_heading > 0"
      :limit-slides="props.templatevar.limit_slides"
      :lightbox-aspect="props.templatevar.lightbox_aspect"
      :use-lightbox="props.templatevar.use_lightbox > 0"
    />
  </div>
</template>

<script lang="ts">
import { CognitoGallery } from '~cognito/models/Cognito/Gallery'

class Templatevars {
  heading?: string
  subheading?: string
  show_heading?: number
  use_lightbox?: number
  limit_slides?: number
  gallery?: number
  type?: string
  aspect?: string
  width?: number
  lightbox_aspect?: string
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
async function loadGallery() {
  if (props.templatevar.gallery) {
    const data = await new CognitoGallery().find_one({
      id: props.templatevar.gallery,
      image_aspect: props.templatevar.aspect,
      image_width: props.templatevar.width,
      extra_aspects: [props.templatevar.lightbox_aspect],
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
