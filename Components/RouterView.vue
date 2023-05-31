<template>
  <router-view />
</template>

<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
import appleTouchIconUrl from '~/assets/pwa-192x192.png'
import safariPinnedTabUrl from '~/assets/safari-pinned-tab.svg'
import { baseURL } from '~/config'

useHead({
  meta: [
    {
      name: 'theme-color',
      content: () => isDark.value ? usePagesStore().currentDomain.dark_theme_colour : usePagesStore().currentDomain.theme_colour,
    },
    {
      name: 'msapplication-TileColor',
      content: () => isDark.value ? usePagesStore().currentDomain.dark_theme_colour : usePagesStore().currentDomain.theme_colour,
    },
  ],
  link: [
    {
      rel: 'preconnect',
      href: baseURL,
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: () => usePagesStore().currentDomain.favicon.url,
    },
    {
      rel: 'apple-touch-icon',
      href: appleTouchIconUrl,
    },
    {
      rel: 'mask-icon',
      href: safariPinnedTabUrl,
      color: () => isDark.value ? usePagesStore().currentDomain.dark_theme_colour : usePagesStore().currentDomain.theme_colour,
    },
  ],
})

async function loadDomain() {
  useGroupStore().loadGroups()
  usePagesStore().loadPages()
}

onMounted(() => {
  loadDomain()
})
onServerPrefetch(async () => {
  await loadDomain()
})
</script>
