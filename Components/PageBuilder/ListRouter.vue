<template>
  <div v-if="loading" />
  <div v-else-if="not_found" class="min-h-screen w-full">
    <notFound />
  </div>
  <div v-else>
    <div v-if="pageStore.currentPage.url">
      <div
        v-for="widget in pageStore.currentPage.pageContents" :key="widget.name"
        class="space-y-2 text-gray-900 dark:text-gray-200"
      >
        <cgn-page-builder-wrapper :widget="widget" :url-parts="urlParts" />
      </div>
      <div
        v-if="pageStore.currentPage.content"
        class="prose-brand prose mx-auto space-y-2 p-6 text-gray-500 dark:prose-dark dark:text-gray-200 sm:p-12 lg:max-w-none"
        v-html="pageStore.currentPage.content"
      />
    </div>
    <div v-else>
      <cgn-spinner />
    </div>
  </div>
  <cgn-back-to-top v-if="config.show_back_to_top" />
  <cgn-keep-awake />
</template>

<script setup lang="ts">
import { config } from '~/config'
import { CognitoUrlParts } from '~cognito/models/Cognito/Page'
import { logout } from '~cognito/plugins/axios'
import { redirects } from '~/initialData.json'

const props = defineProps({
  page: {
    type: String,
    required: true,
  },
})
const pageStore = useListPageStore()
const router = useRouter()
const loading = ref(true)
const not_found = computed(() => {
  return !pageStore.currentPage.id
})
const urlParts = ref(new CognitoUrlParts())

async function loadPageContent(url: string | string[]) {
  pageStore.loadPage(url)
  urlParts.value = new CognitoUrlParts().parse(url)
}

watch(() => props, () => {
  loading.value = true
  nextTick(() => {
    // Load on next tick to refresh blocks on page change
    loadPageContent(props.page)
    loading.value = false
  })
}, {
  deep: true,
})

onMounted(() => {
  loadPageContent(props.page)
  loading.value = false
  if (props.page == 'cms') {
    router.push(`${config.baseURL}/cms`)
  }
  if (props.page == 'logout') {
    logout()
    router.push('/')
  }
  const redirect = redirects.data.find(redirect => redirect.from == props.page)
  if (redirect) {
    router.replace(`/${redirect.to}`)
  }
})

onServerPrefetch(async () => {
  await loadPageContent(props.page)
  loading.value = false
})
</script>
