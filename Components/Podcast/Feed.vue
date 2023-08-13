<template>
  <div>
    <div class="md:flex">
      <div class="md:w-1/3">
        <cgn-lazy-image :image="podcast.cover_art" />
      </div>
      <div class="p-2 md:w-2/3">
        <div class="mb-2 text-2xl">
          {{ podcast.title }}
        </div>
        <div class="prose dark:prose-invert" v-html="podcast.description" />
      </div>
    </div>
    <div v-for="episode in podcast.episodes" :key="episode.id">
      <div class="m-4 md:flex">
        <div class="relative cursor-pointer md:w-1/5" @click="selectEpisode(episode)">
          <cgn-lazy-image :image="episode.cover_art" />
          <i-heroicons-solid:play class="absolute left-1 top-1 text-3xl" />
        </div>
        <div class="py-2 md:ml-2 md:w-4/5">
          <div class="mb-2 text-2xl">
            {{ episode.name }}
          </div>
          <div class="prose mb-2 max-w-none dark:prose-invert" v-html="episode.description" />
        </div>
      </div>
    </div>
    <teleport
      to="body"
    >
      <div v-if="selected_episode?.id" class="fixed bottom-0 min-h-[100px] w-full bg-darkbg-800 p-3 text-white">
        <div class="mb-2">
          Ep: {{ selected_episode.episode }}
          -
          {{ selected_episode.name }}
        </div>
        <media-controller audio>
          <audio slot="media" :src="selected_episode.media_url" autoplay />
          <media-control-bar>
            <media-play-button />
            <media-seek-backward-button seekoffset="10" />
            <media-seek-forward-button seekoffset="10" />

            <media-time-display />

            <media-time-range />
            <media-playback-rate-button />
            <media-mute-button />
            <media-volume-range />
          </media-control-bar>
        </media-controller>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import 'media-chrome'
import { PodcastChannel } from '~cognito/models/Podcast/Channel'
import { PodcastEpisode } from '~cognito/models/Podcast/Episode'

const props = defineProps({
  channel: {
    type: Number,
    required: true,
  },
})

const podcast = ref<PodcastChannel>(new PodcastChannel())
const selected_episode = ref<PodcastEpisode>(new PodcastEpisode())

const selectEpisode = (episode: PodcastEpisode) => {
  selected_episode.value = new PodcastEpisode()
  nextTick(() => {
    selected_episode.value = episode
  })
}
const loadChannel = async () => {
  const data = await new PodcastChannel().find_one_mapped({ id: props.channel })
  podcast.value = data
  selected_episode.value = podcast.value.episodes.at(0)
}
onMounted(() => {
  loadChannel()
})
onServerPrefetch(async () => {
  await loadChannel()
})
</script>
