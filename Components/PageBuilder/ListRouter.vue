<template>
  <div v-if="loading" />
  <div v-else-if="not_found" class="min-h-screen w-full">
    <notFound />
  </div>
  <div v-else>
    <div v-if="pageStore.currentPage.url">
      <template v-for="widget in pageStore.currentPage.pageContents" :key="widget.name">
        <div v-if="!widget.deleted" class="space-y-2 text-gray-900 dark:text-gray-200">
          <cgn-page-builder-list-wrapper :widget="widget" :url-parts="urlParts" />
        </div>
      </template>
      <div
        v-if="pageContent.length"
        class="prose-brand prose mx-auto space-y-2 p-6 text-gray-500 dark:prose-dark dark:text-gray-200 sm:p-12 lg:max-w-none"
        v-html="pageContent"
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
    type: String || Array<string>,
    required: true,
  },
})

const pageStore = useListPageStore()
const router = useRouter()

const loading = ref(true)
const urlParts = ref(new CognitoUrlParts())

const not_found = computed(() => {
  return !pageStore.currentPage.id
})

const pageContent = computed(() => {
  return JSON.parse(pageStore.currentPage.content)
})

async function loadPageContent(url: string | string[]) {
  pageStore.loadPage(url)
  urlParts.value = new CognitoUrlParts().parse(url)
}

watch(() => props.page, () => {
  loading.value = true
  nextTick(() => {
    // Load on next tick to refresh blocks on page change
    loadPageContent(props.page)
    loading.value = false
  })
}, { deep: true })

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

  // handle redirects
  const redirectList: { from: string, to: string }[] = redirects.data
  const redirect = redirectList.find(redirect => redirect.from == props.page)
  if (redirect) {
    router.replace(`/${redirect.to}`)
  }
})

onServerPrefetch(async () => {
  await loadPageContent(props.page)
  loading.value = false
})
</script>
