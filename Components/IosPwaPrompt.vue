<template>
  <div v-if="showAndroidPrompt" class="sticky bottom-0 p-2 text-gray-900 dark:bg-darkbg-800 dark:text-white">
    <div class="text-xl">
      {{ copyTitle }}
    </div>
    <div class="pb-2 text-lg">
      {{ copyBody }}
    </div>
    <div>
      Select the “Install app” button under the browser menu ( ⋮ ) in the upper right corner.
    </div>
  </div>

  <div v-if="showIOSPrompt" class="sticky bottom-0 bg-gray-800 p-2 dark:text-white">
    <div class="text-xl">
      {{ copyTitle }}
    </div>
    <div class="pb-2 text-lg">
      {{ copyBody }}
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col items-center">
        {{ copyShareButtonLabel }}
        <!-- Share icon -->
        <svg v-if="isiOS13AndUp" class="w-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 566 670">
          <g fill="currentColor">
            <path
              d="M255 12c4-4 10-8 16-8s12 3 16 8l94 89c3 4 6 7 8 12 2 6 0 14-5 19-7 8-20 9-28 2l-7-7-57-60 2 54v276c0 12-10 22-22 22-12 1-24-10-23-22V110l1-43-60 65c-5 5-13 8-21 6a19 19 0 0 1-16-17c-1-7 2-13 7-18l95-91z"
            />
            <path
              d="M43 207c16-17 40-23 63-23h83v46h-79c-12 0-25 3-33 13-8 9-10 21-10 33v260c0 13 0 27 6 38 5 12 18 18 30 19l14 1h302c14 0 28 0 40-8 11-7 16-21 16-34V276c0-11-2-24-9-33-8-10-22-13-34-13h-78v-46h75c13 0 25 1 37 4 16 4 31 13 41 27 11 17 14 37 14 57v280c0 20-3 41-15 58a71 71 0 0 1-45 27c-11 2-23 3-34 3H109c-19-1-40-4-56-15-14-9-23-23-27-38-4-12-5-25-5-38V270c1-22 6-47 22-63z"
            />
          </g>
        </svg>
        <svg v-else class="w-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 169">
          <g fill="currentColor">
            <path
              d="M60 0l28 28-2 2a586 586 0 0 0-4 4L64 15v90h-8V15L38 34l-4-4-2-2L60 0z"
            />
            <path d="M0 49h44v8H8v104h104V57H76v-8h44v120H0V49z" />
          </g>
        </svg>
      </div>
      <div class="flex flex-col items-center justify-between">
        {{ copyAddHomeButtonLabel }}
        <!-- Add to home icon -->
        <svg v-if="isiOS13AndUp" class="w-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 578 584">
          <g fill="currentColor">
            <path
              d="M101 35l19-1h333c12 0 23 0 35 3 17 3 34 12 44 27 13 16 16 38 16 58v329c0 19 0 39-8 57a65 65 0 0 1-37 37c-18 7-38 7-57 7H130c-21 1-44 0-63-10-14-7-25-20-30-34-6-15-8-30-8-45V121c1-21 5-44 19-61 13-16 33-23 53-25m7 46c-10 1-19 6-24 14-7 8-9 20-9 31v334c0 12 2 25 10 34 9 10 23 12 35 12h336c14 1 30-3 38-15 6-9 8-20 8-31V125c0-12-2-24-10-33-9-9-22-12-35-12H121l-13 1z"
            />
            <path
              d="M271 161c9-11 31-10 38 4 3 5 3 11 3 17v87h88c7 0 16 1 21 7 6 6 7 14 6 22a21 21 0 0 1-10 14c-5 4-11 5-17 5h-88v82c0 7-1 15-6 20-10 10-29 10-37-2-3-6-4-13-4-19v-81h-87c-8-1-17-3-23-9-5-6-6-15-4-22a21 21 0 0 1 11-14c6-3 13-3 19-3h84v-88c0-7 1-14 6-20z"
            />
          </g>
        </svg>
        <svg
          v-else
          class="w-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="55.99425507 31.98999977 157.76574707 157.76371765"
        >
          <g fill="currentColor">
            <path
              d="M90.49 32.83a54.6 54.6 0 019.55-.84c23.98.03 47.96 0 71.94.01 8.5.07 17.3 1.74 24.4 6.65 10.94 7.28 16.52 20.54 17.35 33.3.06 26.03 0 52.06.03 78.08 0 10.16-3.59 20.56-10.95 27.73-7.93 7.61-18.94 11.43-29.79 11.98-25.71.03-51.42 0-77.12.01-10.37-.11-21.01-3.77-28.17-11.48-8.22-8.9-11.72-21.29-11.73-33.21.01-23.03-.03-46.05.02-69.07-.01-9.14 1.33-18.71 6.65-26.4 6.21-9.4 16.97-14.79 27.82-16.76m38.18 41.09c-.05 10.25.01 20.5 0 30.75-9.58-.03-19.16.02-28.75-.04-2.27.08-4.98-.25-6.68 1.61-2.84 2.34-2.75 7.12.01 9.48 1.8 1.69 4.46 1.57 6.75 1.64 9.56-.04 19.12-.01 28.67-.03.02 10.24-.06 20.48.01 30.72-.14 2.66 1.36 5.4 3.95 6.3 3.66 1.66 8.52-1.13 8.61-5.23.26-10.59.02-21.2.09-31.79 9.88 0 19.76.02 29.64.01 2.74.12 5.85-.67 7.14-3.34 2.23-3.75-.61-9.34-5.08-9.29-10.57-.14-21.14-.01-31.7-.04-.01-10.25.04-20.49 0-30.74.3-3.5-2.66-7.09-6.3-6.79-3.65-.33-6.66 3.26-6.36 6.78z"
            />
            <path
              fill="transparent"
              d="M128.67 73.92c-.3-3.52 2.71-7.11 6.36-6.78 3.64-.3 6.6 3.29 6.3 6.79.04 10.25-.01 20.49 0 30.74 10.56.03 21.13-.1 31.7.04 4.47-.05 7.31 5.54 5.08 9.29-1.29 2.67-4.4 3.46-7.14 3.34-9.88.01-19.76-.01-29.64-.01-.07 10.59.17 21.2-.09 31.79-.09 4.1-4.95 6.89-8.61 5.23-2.59-.9-4.09-3.64-3.95-6.3-.07-10.24.01-20.48-.01-30.72-9.55.02-19.11-.01-28.67.03-2.29-.07-4.95.05-6.75-1.64-2.76-2.36-2.85-7.14-.01-9.48 1.7-1.86 4.41-1.53 6.68-1.61 9.59.06 19.17.01 28.75.04.01-10.25-.05-20.5 0-30.75z"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $axios } from '~cognito/plugins/axios'

const props = defineProps({
  debugIOS: {
    type: Boolean,
    default: false,
  },
  debugAndroid: {
    type: Boolean,
    default: false,
  },
  copyTitle: {
    type: String,
    default: 'Install',
  },
  copyBody: {
    type: String,
    default: 'Install this app to your phone',
  },
  copyShareButtonLabel: {
    type: String,
    default: '1) Press the "Share" button',
  },
  copyAddHomeButtonLabel: {
    type: String,
    default: '2) Press "Add to Home Screen"',
  },
})

const isiOS13AndUp = computed(() => {
  if ($axios.isSSR()) {
    return false
  }
  return /OS (13|14)/.test(window.navigator.userAgent)
})

const isStandalone = computed(() => {
  if ($axios.isSSR()) {
    return false
  }
  return window.matchMedia('(display-mode: standalone)').matches
})

const deviceok = computed(() => {
  if ($axios.isSSR()) {
    return false
  }
  if (isStandalone.value) {
    return false
  }
  const isiOS = /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase(),
  )
  const isiPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1

  return (isiOS || isiPadOS)
})

const deviceandroid = computed(() => {
  if ($axios.isSSR()) {
    return false
  }
  if (isStandalone.value) {
    return false
  }
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('android')
})

const showIOSPrompt = computed(() => {
  if (props.debugIOS) {
    return true
  }
  return deviceok.value
})

const showAndroidPrompt = computed(() => {
  if (props.debugAndroid) {
    return true
  }
  return deviceandroid.value
})
</script>
