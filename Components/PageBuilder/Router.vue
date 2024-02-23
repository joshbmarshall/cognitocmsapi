<template>
  <div v-if="loading" />
  <div v-else-if="not_found" class="min-h-screen w-full">
    <notFound />
  </div>
  <div v-else>
    <div v-if="currentPage.slug">
      <div v-for="row in currentPage.rows" :key="row.id" class="space-y-2 text-gray-900 dark:text-gray-200 lg:col-start-1 lg:row-start-1" :class="{ 'grid grid-cols-12': row.row_type == 'columns' }">
        <div v-if="row.row_type == 'tabs'">
          <cgn-tabs v-slot="tabData" :tabs="generateTabs(row.blocks)">
            <div v-for="block in row.blocks" v-show="tabData.selected_tab == block.title" :key="block.id" :style="`grid-column: span ${block.width} / span ${block.width}`">
              <div v-for="widget, index in block.widgets" :key="index">
                <cgn-page-builder-wrapper :widget="widget" :url-parts="urlParts" />
              </div>
            </div>
          </cgn-tabs>
        </div>
        <div v-for="block in row.blocks" v-show="row.row_type == 'columns'" :key="block.id" :style="`grid-column: span ${block.width} / span ${block.width}`">
          <div v-for="widget, index in block.widgets" :key="index">
            <cgn-page-builder-wrapper :widget="widget" :url-parts="urlParts" />
          </div>
        </div>
      </div>
      <div
        v-if="currentPage.content"
        class="prose-brand prose mx-auto space-y-2 p-6 text-gray-500 dark:prose-dark dark:text-gray-200 sm:p-12 lg:col-start-1 lg:row-start-1 lg:max-w-none"
        v-html="currentPage.content"
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
import { storeToRefs } from 'pinia'
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
const pageStore = usePageStore()
const { currentPage } = storeToRefs(pageStore)
const loading = ref(true)
const not_found = computed(() => {
  return !currentPage.value.id
})
const urlParts = ref(new CognitoUrlParts())

function generateTabs(blocks) {
  const tab_list = []
  blocks.forEach((block) => {
    tab_list.push({ name: block.title, id: block.id })
  })
  return tab_list
}

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
    window.location = `${config.baseURL}/cms`
  }
  if (props.page == 'logout') {
    logout()
    useRouter().push('/')
  }
  const redirect = redirects.data.find(e => e.from == props.page)
  if (redirect) {
    useRouter().replace(`/${redirect.to}`)
  }
})
onServerPrefetch(async () => {
  await loadPageContent(props.page)
  loading.value = false
})
</script>
