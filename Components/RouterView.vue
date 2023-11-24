<template>
  <router-view />
  <cgn-reload-pwa />
</template>

<script setup lang="ts">
import { config } from '~/config'
import initialData from '~/initialData.json'
import { CognitoDomain } from '~cognito/models/Cognito/Domain'
import { CognitoTime } from '~cognito/models/Cognito/Time'
import { $axios } from '~cognito/plugins/axios'

function favicon() {
  if (isDark.value && usePagesStore().currentDomain.favicon_dark) {
    return usePagesStore().currentDomain.favicon_dark.url
  }
  return usePagesStore().currentDomain.favicon?.url
}

const router = useRouter()
const sitemapData = ref(initialData.sitemap)
const nextUpdateInitialData = ref(new CognitoTime())

const sitemapPage = computed((): {
  url: string
  seo_title: string
  seo_meta_description: string
} => {
  const url = router?.currentRoute?.value?.path || ''
  const page = sitemapData.value.find(e => e.url == url)
  if (page) {
    return page
  }
  if (!$axios.isSSR()) {
    if (nextUpdateInitialData.value.isPast()) {
      // Get details from server
      new CognitoDomain().getInitialData().then((data) => {
        sitemapData.value = data.sitemap
        // Do not update initial data for at least a minute
        nextUpdateInitialData.value = new CognitoTime().addMinutes(1)
      })
    }
  }
  return {
    url: '/',
    seo_title: '',
    seo_meta_description: '',
  }
})

// https://github.com/vueuse/head
useHead({
  title: () => sitemapPage.value?.seo_title || '',
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
      content: () => sitemapPage.value?.seo_meta_description || '',
    },
  ],
  link: [
    {
      rel: 'preconnect',
      href: config.baseURL,
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
      href: () => config.siteURL + (sitemapPage.value?.url || ''),
    },
  ],
})

async function loadDomain() {
  await useGroupStore().loadGroups()
  await usePagesStore().loadPages()
}

onMounted(() => {
  loadDomain()
})
onServerPrefetch(async () => {
  await loadDomain()
})
</script>
