<template>
  <router-view />
</template>

<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
import { baseURL, siteURL } from '~/config'

function favicon() {
  if (isDark.value && usePagesStore().currentDomain.favicon_dark) {
    return usePagesStore().currentDomain.favicon_dark.url
  }
  return usePagesStore().currentDomain.favicon?.url
}
useHead({
  title: () => `${usePagesStore().currentDomain.seo_title_prefix} ${usePageStore().title} ${usePagesStore().currentDomain.seo_title_suffix}`,
  meta: [
    {
      name: 'theme-color',
      content: () => isDark.value ? usePagesStore().currentDomain.dark_theme_colour : usePagesStore().currentDomain.theme_colour,
    },
    {
      name: 'msapplication-TileColor',
      content: () => isDark.value ? usePagesStore().currentDomain.dark_theme_colour : usePagesStore().currentDomain.theme_colour,
    },
    {
      name: 'description',
      content: () => usePageStore().metaDescription,
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
      href: favicon,
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon-180x180.png',
    },
    {
      rel: 'mask-icon',
      href: '/maskable-icon-512x512.png',
      color: () => isDark.value ? usePagesStore().currentDomain.dark_theme_colour : usePagesStore().currentDomain.theme_colour,
    },
    {
      rel: 'canonical',
      href: () => `${siteURL}${usePageStore().canonical}`,
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
