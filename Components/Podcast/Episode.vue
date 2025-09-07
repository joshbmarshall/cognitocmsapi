<template>
  <div>
    <h1 class="text-lg font-bold">
      {{ episode.episode }}
      {{ episode.name }}
    </h1>
    <time :datetime="episode.display_start_time.toISO8601String()" class="text-muted text-sm">
      {{ episode.display_start_time.toHumanDateString(true) }}
    </time>
    <cgn-lazy-image :image="episode.cover_art" class="mx-auto w-96" />

    <p class="prose mb-4 mt-1 max-w-none dark:prose-invert" v-html="episode.description" />
    <cgn-audio-player :media="episode.media_url" :title="`${episode.episode}: ${episode.name}`" />
  </div>
</template>

<script lang="ts">
import { PodcastEpisode } from '~cognito/models/Podcast/Episode'

class Templatevars {
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
})
const episode = ref<PodcastEpisode>(new PodcastEpisode())

async function loadEpisode(url: string) {
  episode.value.name = ''
  const data = await new PodcastEpisode().find_one_mapped({
    url,
  })
  episode.value = data
}
watch(() => props.item, (newUrl) => {
  loadEpisode(newUrl)
})
onMounted(() => {
  loadEpisode(props.item)
})
onServerPrefetch(async () => {
  await loadEpisode(props.item)
})
</script>
