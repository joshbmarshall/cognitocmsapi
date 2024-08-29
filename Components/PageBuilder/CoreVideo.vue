<template>
  <video
    loop
    controls
    playsinline
    :src="videoUrl.getUrl(props.templatevar.video)"
  >
    <source
      type="video/mp4"
    >
  </video>
</template>

<script lang="ts">
class Templatevars {
  video?: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})
const videoUrl = useVideoUrl()
</script>
