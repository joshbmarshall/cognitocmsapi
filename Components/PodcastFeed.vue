<template>
  <div>
    <div class="md:flex">
      <div class="md:w-1/3">
        <img :src="feed.image">
      </div>
      <div class="p-2 md:w-2/3">
        <div class="mb-2 text-2xl">
          {{ feed.title }}
        </div>
        <div class="whitespace-pre-line" v-html="feed.description" />
      </div>
    </div>
    <div v-for="item in feed.items" :key="item.id">
      <div class="m-4 md:flex">
        <div class="md:w-1/5">
          <img :src="item.itunes_image?.href">
        </div>
        <div class="p-2 md:w-2/5">
          <div class="mb-2 text-2xl">
            {{ item.title }}
          </div>
          <div class="mb-2 whitespace-pre-line" v-html="item.description" />
          <div v-for="enclosure in item.enclosures" :key="enclosure.url">
            <media-controller audio>
              <audio slot="media" :src="enclosure.url" preload="none" />
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'media-chrome'
import { PodcastFeed } from '~cognito/models/Podcast/Feed'

const props = defineProps({
  feed: {
    type: String,
    required: true,
  },
})

const feed = ref(new PodcastFeed())

onMounted(async () => {
  feed.value = await new PodcastFeed().fetchFeed(props.feed)
})
</script>
