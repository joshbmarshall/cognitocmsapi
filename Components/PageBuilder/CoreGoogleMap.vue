<template>
  <iframe
    class="cgembgm"
    :width="templatevar.width"
    :height="templatevar.height"
    frameborder="0"
    scrolling="no"
    marginheight="0"
    marginwidth="0"
    :src="iframesrc"
  />
</template>

<script lang="ts">
class Templatevars {
  width?: string
  height?: string
  zoom?: string
  location?: string
  show_sign?: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})
const iframesrc = computed(() => {
  const location = props.templatevar.location?.replaceAll(' ', '+')
  const show_sign = props.templatevar.show_sign ? '' : '&iwloc=near'
  return `//maps.google.com.au/maps?f=q&source=s_q&hl=en&geocode=&q=${location}&z=${props.templatevar.zoom}&output=embed${show_sign}`
})
</script>
