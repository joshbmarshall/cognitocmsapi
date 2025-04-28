<template>
  <iframe
    v-if="video?.youtube_id"
    class="aspect-video w-full"
    :src="`https://www.youtube.com/embed/${video.youtube_id}`"
  />
  <video
    v-else
    controls
    playsinline
    :src="videoUrl.getUrl(props.templatevar.video || '')"
    class="w-full"
  >
    <source
      type="video/mp4"
    >
  </video>
</template>

<script lang="ts">
import { gql } from 'graphql-request'
import { $axios } from '~cognito/plugins/axios'

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

const video = ref<{ youtube_id?: string }>()
const loadVideo = async () => {
  const data = await $axios.graphql(gql`query ($id: ID) {
      cognitoVideo(id: $id) {
        youtube_id
      }
    }`, {
    id: props.templatevar.video,
  })
  return (data.cognitoVideo)
}
onMounted(async () => video.value = await loadVideo())
watch(() => props.templatevar.video, async () => video.value = await loadVideo())
</script>
