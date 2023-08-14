<template>
  <div>
    <div class="mb-16 md:flex">
      <div class="pt-4 md:w-1/3">
        <cgn-lazy-image :image="podcast.cover_art" />
      </div>
      <div class="p-2 md:w-2/3">
        <div class="mb-5 mt-2 grid-cols-8 space-x-4">
          <a v-if="podcast.amazon_url" :href="podcast.amazon_url" target="_blank" title="Listen on Amazon Music">
            <i-simple-icons:amazon class="inline-block h-10 w-10" />
          </a>
          <a v-if="podcast.itunes_url" :href="podcast.itunes_url" target="_blank" title="Listen on iTunes">
            <i-simple-icons:itunes class="inline-block h-10 w-10" />
          </a>
          <a v-if="podcast.spotify_url" :href="podcast.spotify_url" target="_blank" title="Listen on Spotify">
            <i-simple-icons:spotify class="inline-block h-10 w-10" />
          </a>
          <a v-if="podcast.google_podcast_url" :href="podcast.google_podcast_url" target="_blank" title="Listen on Google">
            <i-simple-icons:google class="inline-block h-10 w-10" />
          </a>
          <a v-if="podcast.deezer_url" :href="podcast.deezer_url" target="_blank" title="Listen on Deezer">
            <i-simple-icons:deezer class="inline-block h-10 w-10" />
          </a>
          <a v-if="podcast.tune_in_url" :href="podcast.tune_in_url" target="_blank" title="Listen on TuneIn">
            <i-simple-icons:tunein class="inline-block h-10 w-10" />
          </a>
          <a v-if="podcast.iheart_url" :href="podcast.iheart_url" target="_blank" title="Listen on iHeart Radio">
            <i-simple-icons:iheartradio class="inline-block h-10 w-10" />
          </a>
          <a v-if="podcast.samsung_cast_url" :href="podcast.samsung_cast_url" target="_blank" title="Listen on Samsung Cast">
            <i-simple-icons:samsung class="inline-block h-10 w-10" />
          </a>
        </div>
        <div class="mb-2 text-2xl">
          {{ podcast.title }}
        </div>
        <div class="prose dark:prose-invert" v-html="podcast.description" />
      </div>
    </div>
    <div v-for="episode in podcast.episodes" :key="episode.id">
      <div class="m-4">
        <div class="relative float-left mt-2 cursor-pointer md:mr-2 md:w-1/5" @click="selectEpisode(episode)">
          <cgn-lazy-image :image="episode.cover_art" />
          <i-heroicons-solid:play class="absolute left-1 top-1 text-5xl" />
        </div>
        <div class="pb-2 md:ml-2">
          <div class="text-2xl">
            {{ episode.name }}
          </div>
          <div class="mb-1 text-xs">
            {{ episode.display_start_time.toHumanDateString(true) }}
          </div>
          <div class="prose mb-2 max-w-none dark:prose-invert" :class="episode.notclamped ? '' : 'line-clamp-4'" v-html="episode.description" />
          <div v-if="!episode.notclamped" class="cursor-pointer" @click="episode.notclamped = true">
            Read More
          </div>
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
          <audio slot="media" :src="selected_episode.media_url" :autoplay="autoplay" />
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
const autoplay = ref(false)

const selectEpisode = (episode: PodcastEpisode) => {
  selected_episode.value = new PodcastEpisode()
  autoplay.value = true
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
