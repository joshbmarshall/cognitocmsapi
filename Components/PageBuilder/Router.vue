<template>
  <div v-if="loading" />
  <div v-else-if="not_found" class="bg-gray-200 dark:bg-gray-800 w-full min-h-screen">
    <notFound />
  </div>
  <div v-else>
    <div v-if="currentPage.slug">
      <page-builder-content :pagebuilder-rows="currentPage.rows" />
      <div
        v-if="currentPage.content"
        class="p-6 sm:p-12 space-y-2 prose prose-brand dark:prose-dark text-gray-500 dark:text-gray-200 mx-auto lg:max-w-none lg:row-start-1 lg:col-start-1"
        v-html="currentPage.content"
      />
    </div>
    <div v-else>
      <cgn-spinner />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { baseURL, siteURL } from '~/config'

const props = defineProps({
  page: {
    type: String,
    required: true,
  },
})
const pageStore = usePageStore()
const { currentPage } = storeToRefs(pageStore)
const loading = ref(true)
const not_found = computed(() => {
  return !currentPage.value.updated_at
})

useHead({
  title: () => `${usePagesStore().currentDomain.seo_title_prefix} ${currentPage.value.title} ${usePagesStore().currentDomain.seo_title_suffix}`,
  meta: [
    {
      name: 'description',
      content: computed(() => currentPage.value.meta_description || ''),
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: computed(() => {
        if (currentPage.value.slug == 'home') {
          return siteURL
        }
        return `${siteURL}/${currentPage.value.slug}`
      }),
    },
  ],
})

async function loadPageContent(url: string | string[]) {
  pageStore.loadPage(url)
}

watch(() => props.page, (newUrl) => {
  loadPageContent(newUrl)
}, {
  deep: true,
})
onMounted(() => {
  loadPageContent(props.page)
  loading.value = false
  if (props.page == 'cms') {
    window.location = `${baseURL}/cms`
  }
})
onServerPrefetch(async () => {
  await loadPageContent(props.page)
})
</script>
