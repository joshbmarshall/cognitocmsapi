<template>
  <div>
    <div class="fixed inset-x-0 bottom-0 z-10 md:relative">
      <div class="flex h-[150px] items-start gap-6 bg-white p-4 shadow shadow-slate-200/80 ring-1 ring-slate-900/5 backdrop-blur-sm dark:bg-darkbg-900 dark:shadow-darkbg-500/80 md:h-[100px] md:items-center md:px-6">
        <div class="hidden md:block">
          <button
            v-if="isPlaying"
            type="button" class="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 md:h-14 md:w-14" aria-label="Pause" @click="pause"
          >
            <div class="absolute -inset-3 md:hidden" />
            <i-humbleicons:pause class="h-10 w-10 text-white" />
          </button>
          <button
            v-else type="button"
            class="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 md:h-14 md:w-14" aria-label="Play" @click="play"
          >
            <div class="absolute -inset-3 md:hidden" />
            <i-humbleicons:play class="h-10 w-10 text-white" />
          </button>
        </div>
        <div class="mb-[env(safe-area-inset-bottom)] flex flex-1 flex-col gap-3 overflow-hidden p-1">
          <div class="truncate text-center text-sm font-bold leading-6 md:text-left">
            {{ props.title }}
          </div>
          <div class="flex justify-between gap-6">
            <div class="flex items-center md:order-3">
              <div class="flex items-center">
                <div class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm bg-slate-700 text-[0.7rem] text-white">
                  <span v-if="currentSpeed == 1.0" @click="setSpeed(1.25)">
                    1x
                  </span>
                  <span v-if="currentSpeed == 1.25" @click="setSpeed(1.5)">
                    1&#188;
                  </span>
                  <span v-if="currentSpeed == 1.5" @click="setSpeed(2.0)">
                    1&#189;
                  </span>
                  <span v-if="currentSpeed == 2.0" @click="setSpeed(1.0)">
                    2x
                  </span>
                </div>
              </div>
            </div>
            <div class="flex flex-none items-center gap-4">
              <button type="button" class="group relative rounded-full focus:outline-none" aria-label="Rewind 10 seconds" @click="rewind()">
                <div class="absolute -inset-4 -right-2 md:hidden" />
                <i-humbleicons:arrow-go-back class="text-slate-500" />
              </button>
              <div class="md:hidden">
                <button
                  v-if="isPlaying"
                  type="button" class="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 md:h-14 md:w-14" aria-label="Play" @click="pause"
                >
                  <div class="absolute -inset-3 md:hidden" />
                  <i-humbleicons:pause class="h-8 w-8 text-white" />
                </button>
                <button
                  v-else type="button"
                  class="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 md:h-14 md:w-14" aria-label="Play" @click="play"
                >
                  <div class="absolute -inset-3 md:hidden" />
                  <i-humbleicons:play class="h-8 w-8 text-white" />
                </button>
              </div><button type="button" class="group relative rounded-full focus:outline-none" aria-label="Fast-forward 10 seconds" @click="fastforward()">
                <div class="absolute -inset-4 -left-2 md:hidden" />
                <i-humbleicons:arrow-go-forward class="text-slate-500" />
              </button>
            </div>
            <div id="react-aria5117808045-:r0:" role="group" aria-labelledby="react-aria5117808045-:r1:" class="absolute inset-x-0 bottom-full flex flex-auto touch-none items-center gap-6 md:relative">
              <label id="react-aria5117808045-:r1:" class="sr-only">Current time</label>
              <input
                v-model="seekValue"
                type="range"
                min="0"
                max="100"
                step="1"
                class="h-[6px] w-full cursor-pointer appearance-none rounded-sm border-transparent bg-slate-300 dark:bg-slate-600"
                @change="onSeek"
              >
              <div class="hidden items-center gap-2 md:flex">
                <output for="react-aria5117808045-:r1:-0" aria-live="off" class="hidden rounded-md px-1 py-0.5 text-sm leading-6 text-slate-500 md:block">{{ currentTimeDisplay }}</output>
                <span class="text-sm leading-6 text-slate-300" aria-hidden="true">/</span>
                <span class="hidden rounded-md px-1 py-0.5 text-sm leading-6 text-slate-500 md:block">{{ totalTimeDisplay }}</span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audioPlayer"
      :src="props.media"
      @timeupdate="onPlaying"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  media: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

const audioPlayer = ref()
const currentTime = ref(0)
const totalTime = ref(0)
const seekValue = ref(0)
const isPlaying = ref(false)
const currentSpeed = ref(1.0)

const play = () => {
  audioPlayer.value.play()
  isPlaying.value = true
}

const stop = () => {
  audioPlayer.value.currentTime = 0
  isPlaying.value = false
}

defineExpose({
  stop,
  play,
})

const pause = () => {
  isPlaying.value = false
}

const setSpeed = (speed: number) => {
  currentSpeed.value = speed
}

const rewind = () => {
  audioPlayer.value.currentTime -= 10
}

const fastforward = () => {
  audioPlayer.value.currentTime += 10
}

const onSeek = () => {
  const seekto = audioPlayer.value.duration * (seekValue.value / 100)
  audioPlayer.value.currentTime = seekto
}

const onPlaying = () => {
  if (!audioPlayer.value) {
    return
  }
  if (!isPlaying.value) {
    audioPlayer.value.pause()
  }
  audioPlayer.value.playbackRate = currentSpeed.value
  currentTime.value = audioPlayer.value.currentTime
  totalTime.value = audioPlayer.value.duration
  seekValue.value = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100
}

const formatTime = (seconds: number) => {
  if (!seconds) {
    seconds = 0
  }
  const display_hours = Math.floor(seconds / 3600)
  const display_minutes = Math.floor((seconds / 60) % 60)
  const display_seconds = Math.floor(seconds % 60)
  return `${display_hours.toString().padStart(2, '0')
  }:${display_minutes.toString().padStart(2, '0')
  }:${display_seconds.toString().padStart(2, '0')}`
}

const totalTimeDisplay = computed(() => {
  return formatTime(totalTime.value)
})

const currentTimeDisplay = computed(() => {
  return formatTime(currentTime.value)
})

watch(() => props.media, (newVal, oldVal) => {
  if (oldVal) {
    nextTick(() => {
      stop()
      play()
    })
  }
})
</script>
