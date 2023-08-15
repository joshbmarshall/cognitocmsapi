<template>
  <div class="md:flex">
    <div ref="sidebar" class="md:w-1/3 md:overflow-y-scroll">
      <div class="mx-auto w-full px-4 pb-4 pt-10 sm:px-6 md:border-r md:border-slate-200 md:px-4 dark:md:border-slate-700 lg:px-8 lg:py-12 xl:px-12">
        <cgn-lazy-image :image="podcast.cover_art" class="relative mx-auto block w-48 overflow-hidden rounded-lg bg-slate-200 shadow-xl shadow-slate-200 dark:bg-slate-800 dark:shadow-slate-800 sm:w-64 sm:rounded-xl lg:w-auto lg:rounded-2xl" />
        <div class="mt-10 text-center lg:mt-12 lg:text-left">
          <p class="text-xl font-bold">
            {{ podcast.title }}
          </p>
          <p class="mt-3 text-lg font-medium leading-8" v-html="podcast.description" />

          <section class="mt-10 lg:mt-12">
            <h2 class="text-muted sr-only flex items-center text-sm font-medium leading-7 lg:not-sr-only">
              <svg aria-hidden="true" viewBox="0 0 10 10" class="h-2.5 w-2.5"><path d="M0 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5Z" class="fill-indigo-300" /><path d="M6 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V1Z" class="fill-blue-300" /></svg>
              <span class="ml-2.5">Listen</span>
            </h2>
            <div class="h-px bg-gradient-to-r from-slate-200/0 via-slate-200 to-slate-200/0 lg:hidden" />

            <ul role="list" class="mt-4 flex flex-wrap justify-center gap-10 text-base font-medium leading-7 sm:gap-8 lg:flex-col lg:gap-4">
              <li v-if="podcast.amazon_url" class="flex">
                <a class="group flex items-center" aria-label="Amazon" :href="podcast.spotify_url" target="_blank">
                  <i-simple-icons:amazon class="h-8 w-8" />
                  <span class="hidden sm:ml-3 sm:block">Amazon Music</span>
                </a>
              </li>
              <li v-if="podcast.itunes_url" class="flex">
                <a class="group flex items-center" aria-label="iTunes" :href="podcast.itunes_url" target="_blank">
                  <i-simple-icons:itunes class="h-8 w-8" />
                  <span class="hidden sm:ml-3 sm:block">iTunes</span>
                </a>
              </li>
              <li v-if="podcast.spotify_url" class="flex">
                <a class="group flex items-center" aria-label="Spotify" :href="podcast.spotify_url" target="_blank">
                  <i-simple-icons:spotify class="h-8 w-8" />
                  <span class="hidden sm:ml-3 sm:block">Spotify</span>
                </a>
              </li>
              <li v-if="podcast.google_podcast_url" class="flex">
                <a class="group flex items-center" aria-label="Google Podcast" :href="podcast.google_podcast_url" target="_blank">
                  <i-simple-icons:google class="h-8 w-8" />
                  <span class="hidden sm:ml-3 sm:block">Google Podcast</span>
                </a>
              </li>
              <li v-if="podcast.deezer_url" class="flex">
                <a class="group flex items-center" aria-label="Deezer" :href="podcast.deezer_url" target="_blank">
                  <i-simple-icons:deezer class="h-8 w-8" />
                  <span class="hidden sm:ml-3 sm:block">Deezer</span>
                </a>
              </li>
              <li v-if="podcast.tune_in_url" class="flex">
                <a class="group flex items-center" aria-label="TuneIn" :href="podcast.tune_in_url" target="_blank">
                  <i-simple-icons:tunein class="h-8 w-8" />
                  <span class="hidden sm:ml-3 sm:block">TuneIn</span>
                </a>
              </li>
              <li v-if="podcast.iheart_url" class="flex">
                <a class="group flex items-center" aria-label="iHeart Radio" :href="podcast.iheart_url" target="_blank">
                  <i-simple-icons:iheartradio class="h-8 w-8" />
                  <span class="hidden sm:ml-3 sm:block">iHeart Radio</span>
                </a>
              </li>
              <li v-if="podcast.samsung_cast_url" class="flex">
                <a class="group flex items-center" aria-label="Samsung Cast" :href="podcast.samsung_cast_url" target="_blank">
                  <i-simple-icons:samsung class="h-8 w-8" />
                  <span class="hidden sm:ml-3 sm:block">Samsung Cast</span>
                </a>
              </li>
              <li class="flex">
                <a class="group flex items-center" aria-label="RSS Feed" :href="podcast.rss_url" target="_blank">
                  <i-simple-icons:rss class="h-8 w-8" />
                  <span class="hidden sm:ml-3 sm:block">RSS Feed</span>
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
    <div class="relative md:w-2/3">
      <div ref="episodelist" class="md:overflow-y-scroll">
        <svg aria-hidden="true" class="absolute left-0 top-0 h-20 w-full"><defs><linearGradient id=":S2:-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="40%" stop-color="white" />
          <stop offset="100%" stop-color="black" /></linearGradient><linearGradient id=":S2:-gradient">
          <stop offset="0%" stop-color="#4989E8" /><stop offset="50%" stop-color="#6159DA" />
          <stop offset="100%" stop-color="#FF54AD" /></linearGradient><mask id=":S2:-mask">
          <rect width="100%" height="100%" fill="url(#:S2:-pattern)" /></mask><pattern id=":S2:-pattern" width="400" height="100%" patternUnits="userSpaceOnUse">
          <rect width="2" height="83%" x="2" fill="url(#:S2:-fade)" /><rect width="2" height="99%" x="6" fill="url(#:S2:-fade)" /><rect width="2" height="52%" x="10" fill="url(#:S2:-fade)" />
          <rect width="2" height="99%" x="14" fill="url(#:S2:-fade)" /><rect width="2" height="86%" x="18" fill="url(#:S2:-fade)" /><rect width="2" height="91%" x="22" fill="url(#:S2:-fade)" />
          <rect width="2" height="92%" x="26" fill="url(#:S2:-fade)" /><rect width="2" height="75%" x="30" fill="url(#:S2:-fade)" /><rect width="2" height="51%" x="34" fill="url(#:S2:-fade)" />
          <rect width="2" height="88%" x="38" fill="url(#:S2:-fade)" /><rect width="2" height="45%" x="42" fill="url(#:S2:-fade)" /><rect width="2" height="56%" x="46" fill="url(#:S2:-fade)" />
          <rect width="2" height="80%" x="50" fill="url(#:S2:-fade)" /><rect width="2" height="44%" x="54" fill="url(#:S2:-fade)" /><rect width="2" height="93%" x="58" fill="url(#:S2:-fade)" />
          <rect width="2" height="98%" x="62" fill="url(#:S2:-fade)" /><rect width="2" height="41%" x="66" fill="url(#:S2:-fade)" /><rect width="2" height="47%" x="70" fill="url(#:S2:-fade)" />
          <rect width="2" height="87%" x="74" fill="url(#:S2:-fade)" /><rect width="2" height="67%" x="78" fill="url(#:S2:-fade)" /><rect width="2" height="73%" x="82" fill="url(#:S2:-fade)" />
          <rect width="2" height="69%" x="86" fill="url(#:S2:-fade)" /><rect width="2" height="88%" x="90" fill="url(#:S2:-fade)" /><rect width="2" height="53%" x="94" fill="url(#:S2:-fade)" />
          <rect width="2" height="69%" x="98" fill="url(#:S2:-fade)" /><rect width="2" height="75%" x="102" fill="url(#:S2:-fade)" /><rect width="2" height="86%" x="106" fill="url(#:S2:-fade)" />
          <rect width="2" height="43%" x="110" fill="url(#:S2:-fade)" /><rect width="2" height="80%" x="114" fill="url(#:S2:-fade)" /><rect width="2" height="81%" x="118" fill="url(#:S2:-fade)" />
          <rect width="2" height="78%" x="122" fill="url(#:S2:-fade)" /><rect width="2" height="56%" x="126" fill="url(#:S2:-fade)" /><rect width="2" height="47%" x="130" fill="url(#:S2:-fade)" />
          <rect width="2" height="90%" x="134" fill="url(#:S2:-fade)" /><rect width="2" height="50%" x="138" fill="url(#:S2:-fade)" /><rect width="2" height="52%" x="142" fill="url(#:S2:-fade)" />
          <rect width="2" height="77%" x="146" fill="url(#:S2:-fade)" /><rect width="2" height="81%" x="150" fill="url(#:S2:-fade)" /><rect width="2" height="98%" x="154" fill="url(#:S2:-fade)" />
          <rect width="2" height="48%" x="158" fill="url(#:S2:-fade)" /><rect width="2" height="87%" x="162" fill="url(#:S2:-fade)" /><rect width="2" height="87%" x="166" fill="url(#:S2:-fade)" />
          <rect width="2" height="55%" x="170" fill="url(#:S2:-fade)" /><rect width="2" height="41%" x="174" fill="url(#:S2:-fade)" /><rect width="2" height="42%" x="178" fill="url(#:S2:-fade)" />
          <rect width="2" height="93%" x="182" fill="url(#:S2:-fade)" /><rect width="2" height="84%" x="186" fill="url(#:S2:-fade)" /><rect width="2" height="67%" x="190" fill="url(#:S2:-fade)" />
          <rect width="2" height="68%" x="194" fill="url(#:S2:-fade)" /><rect width="2" height="55%" x="198" fill="url(#:S2:-fade)" /><rect width="2" height="57%" x="202" fill="url(#:S2:-fade)" />
          <rect width="2" height="56%" x="206" fill="url(#:S2:-fade)" /><rect width="2" height="55%" x="210" fill="url(#:S2:-fade)" /><rect width="2" height="46%" x="214" fill="url(#:S2:-fade)" />
          <rect width="2" height="67%" x="218" fill="url(#:S2:-fade)" /><rect width="2" height="69%" x="222" fill="url(#:S2:-fade)" /><rect width="2" height="79%" x="226" fill="url(#:S2:-fade)" />
          <rect width="2" height="84%" x="230" fill="url(#:S2:-fade)" /><rect width="2" height="63%" x="234" fill="url(#:S2:-fade)" /><rect width="2" height="94%" x="238" fill="url(#:S2:-fade)" />
          <rect width="2" height="90%" x="242" fill="url(#:S2:-fade)" /><rect width="2" height="51%" x="246" fill="url(#:S2:-fade)" /><rect width="2" height="73%" x="250" fill="url(#:S2:-fade)" />
          <rect width="2" height="55%" x="254" fill="url(#:S2:-fade)" /><rect width="2" height="57%" x="258" fill="url(#:S2:-fade)" /><rect width="2" height="69%" x="262" fill="url(#:S2:-fade)" />
          <rect width="2" height="88%" x="266" fill="url(#:S2:-fade)" /><rect width="2" height="84%" x="270" fill="url(#:S2:-fade)" /><rect width="2" height="49%" x="274" fill="url(#:S2:-fade)" />
          <rect width="2" height="95%" x="278" fill="url(#:S2:-fade)" /><rect width="2" height="73%" x="282" fill="url(#:S2:-fade)" /><rect width="2" height="54%" x="286" fill="url(#:S2:-fade)" />
          <rect width="2" height="57%" x="290" fill="url(#:S2:-fade)" /><rect width="2" height="72%" x="294" fill="url(#:S2:-fade)" /><rect width="2" height="51%" x="298" fill="url(#:S2:-fade)" />
          <rect width="2" height="44%" x="302" fill="url(#:S2:-fade)" /><rect width="2" height="52%" x="306" fill="url(#:S2:-fade)" /><rect width="2" height="87%" x="310" fill="url(#:S2:-fade)" />
          <rect width="2" height="93%" x="314" fill="url(#:S2:-fade)" /><rect width="2" height="46%" x="318" fill="url(#:S2:-fade)" /><rect width="2" height="47%" x="322" fill="url(#:S2:-fade)" />
          <rect width="2" height="57%" x="326" fill="url(#:S2:-fade)" /><rect width="2" height="79%" x="330" fill="url(#:S2:-fade)" /><rect width="2" height="95%" x="334" fill="url(#:S2:-fade)" />
          <rect width="2" height="54%" x="338" fill="url(#:S2:-fade)" /><rect width="2" height="65%" x="342" fill="url(#:S2:-fade)" /><rect width="2" height="90%" x="346" fill="url(#:S2:-fade)" />
          <rect width="2" height="99%" x="350" fill="url(#:S2:-fade)" /><rect width="2" height="82%" x="354" fill="url(#:S2:-fade)" /><rect width="2" height="98%" x="358" fill="url(#:S2:-fade)" />
          <rect width="2" height="93%" x="362" fill="url(#:S2:-fade)" /><rect width="2" height="60%" x="366" fill="url(#:S2:-fade)" /><rect width="2" height="50%" x="370" fill="url(#:S2:-fade)" />
          <rect width="2" height="69%" x="374" fill="url(#:S2:-fade)" /><rect width="2" height="77%" x="378" fill="url(#:S2:-fade)" /><rect width="2" height="93%" x="382" fill="url(#:S2:-fade)" />
          <rect width="2" height="44%" x="386" fill="url(#:S2:-fade)" /><rect width="2" height="51%" x="390" fill="url(#:S2:-fade)" /><rect width="2" height="96%" x="394" fill="url(#:S2:-fade)" />
          <rect width="2" height="60%" x="398" fill="url(#:S2:-fade)" /></pattern></defs><rect width="100%" height="100%" fill="url(#:S2:-gradient)" mask="url(#:S2:-mask)" opacity="0.25" />
        </svg>
        <div class="pb-12 pt-16 sm:pb-4 lg:pt-12">
          <div class="lg:px-8">
            <div class="lg:max-w-4xl">
              <div class="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
                <h1 class="text-2xl font-bold leading-7">
                  Episodes
                </h1>
              </div>
            </div>
          </div>
          <div class="divide-y divide-slate-100 dark:divide-slate-800 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100 dark:lg:border-slate-800">
            <article v-for="episode in podcast.episodes" :key="episode.id" :aria-labelledby="episode.name" class="py-10 sm:py-12">
              <div class="lg:px-8">
                <div class="lg:max-w-4xl">
                  <div class="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
                    <div class="">
                      <cgn-lazy-image :image="episode.cover_art" class="mx-auto w-48 md:float-right md:ml-2" />
                      <time :datetime="episode.display_start_time.toISO8601String()" class="text-muted text-sm">
                        {{ episode.display_start_time.toHumanDateString(true) }}
                      </time>
                      <h2 class="text-lg font-bold">
                        <router-link :to="`/listen/${episode.url}`">
                          {{ episode.episode }}
                          {{ episode.name }}
                        </router-link>
                      </h2>
                      <div>
                        <p class="prose mt-1 max-w-none dark:prose-invert" :class="episode.notclamped ? '' : 'line-clamp-4'" v-html="episode.description" />
                      </div>
                      <div class="mt-4 flex justify-between gap-4">
                        <button type="button" :aria-label="`Play episode ${episode.episode}: ${episode.name}`" class="flex items-center gap-x-3 text-sm font-bold leading-6 text-brand-500 hover:text-brand-700 active:text-brand-900" @click="selectEpisode(episode)">
                          <i-humbleicons:play />
                          <span aria-hidden="true">Listen</span>
                        </button>
                        <span v-if="!episode.notclamped" class="cursor-pointer" title="Read More" @click="episode.notclamped = true"><i-humbleicons:chevron-down /></span>
                        <span v-else class="cursor-pointer" title="Read Less" @click="episode.notclamped = false"><i-humbleicons:chevron-up /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
      <cgn-audio-player ref="audioPlayer" :media="selected_episode.media_url" :title="`${selected_episode.episode}: ${selected_episode.name}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PodcastChannel } from '~cognito/models/Podcast/Channel'
import { PodcastEpisode } from '~cognito/models/Podcast/Episode'

const props = defineProps({
  channel: {
    type: Number,
    required: true,
  },
})

const audioPlayer = ref()
const sidebar = ref()
const episodelist = ref()
const { width, height } = useWindowSize()
const { top } = useElementBounding(sidebar)
const { y } = useWindowScroll()
const podcast = ref<PodcastChannel>(new PodcastChannel())
const selected_episode = ref<PodcastEpisode>(new PodcastEpisode())

const pageHeight = computed(() => {
  return height.value - top.value - y.value
})
const setHeight = () => {
  if (!episodelist.value) {
    return
  }
  if (!sidebar.value) {
    return
  }
  if (width.value > 700) {
    episodelist.value.style.height = `${pageHeight.value - 100}px`
    sidebar.value.style.height = `${pageHeight.value}px`
  } else {
    episodelist.value.style.height = 'auto'
    sidebar.value.style.height = 'auto'
  }
}
watch (() => pageHeight.value, () => {
  setHeight()
})

const selectEpisode = (episode: PodcastEpisode) => {
  selected_episode.value = episode
  nextTick(() => {
    audioPlayer.value.stop()
    audioPlayer.value.play()
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
