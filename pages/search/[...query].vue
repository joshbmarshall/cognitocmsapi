<template>
  <div class="relative">
    <div class="sm:flex pt-16 pb-20 px-4 sm:px-6 lg:pt-12 lg:pb-28 lg:px-8 gap-10">
      <div class="relative max-w-7xl mx-auto w-full">
        <div class="text-center">
          <h2
            class="text-3xl tracking-tight font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl flex flex-row justify-center gap-2 items-end"
          >
            <div class="font-bold text-gray-700 dark:text-gray-300">
              Search
              <span v-if="search.length > 0">:</span>
            </div>
            <div class="text-brand-500 dark:text-brand-400">
              {{ search }}
            </div>
          </h2>
          <div
            v-if="search.length > 0"
            class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center"
          >
            Found {{ searchresults?.found }} results
          </div>
          <div
            v-if="page_count > 0"
            class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center"
          >
            Page
            {{ page }}
            of
            {{ page_count }}
          </div>
        </div>
        <cgn-form-input-text v-model="search" label="Search" />
        <div
          v-if="search"
          class="mt-12 max-w-lg mx-auto grid gap-5 md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
        >
          <router-link
            v-for="result, index in searchresults?.hits"
            :key="index"
            :to="`/product/${result.document.url}`"
            class="flex flex-col rounded-lg shadow-lg overflow-hidden"
          >
            <div class="flex-shrink-0">
              <cgn-lazy-image
                class="w-full bg-white"
                :placeholder="result.document.image_url"
                :url="result.document.image_url"
                :webp="result.document.image_url"
              />
            </div>
            <div class="flex-1 bg-white dark:bg-gray-800 p-6 flex flex-row gap-2 justify-between">
              <div class="flex flex-1 flex-col">
                <p
                  class="text-xl font-semibold text-gray-900 dark:text-gray-100"
                >
                  {{ result.document.name }}
                </p>
                <div
                  class="mt-2 text-base text-gray-400 dark:text-gray-300"
                  v-html="result.document.blurb"
                />
              </div>
              <div class="flex items-baseline gap-2 justify-end">
                <cgn-button>Details</cgn-button>
              </div>
            </div>
          </router-link>
        </div>
        <div class="flex flex-grow justify-center py-5">
          <PaginateModel v-model="page" :page-count="page_count" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CognitoCTypesense } from '~cognito/models/Cognito/CTypesense'

const props = defineProps({
  query: {
    type: String,
    required: true,
  },
})
const searchresults = ref<CognitoCTypesense>()
const page = ref(1)
const per_page = ref(20)
const search = ref('')

const page_count = computed(() => {
  return Math.ceil(searchresults.value?.found / per_page.value)
})
function doSearch() {
  searchresults.value = new CognitoCTypesense()
  if (search.value.length < 3) {
    return
  }
  new CognitoCTypesense().search({
    collectionName: 'sellproduct',
    query: search.value,
    query_by: 'skus,name,categories,content,blurb',
    page: page.value,
    per_page: per_page.value,
  }).then((data) => {
    searchresults.value = data
    window.scrollTo(0, 0)
  })
}

watch(() => search.value, () => {
  doSearch()
})

watch(() => page.value, () => {
  doSearch()
})

const start = () => {
  usePageStore().setSEO({
    title: 'Search',
    canonical: '/search',
  })
  search.value = props.query
  doSearch()
}
onMounted(() => {
  start()
})
onServerPrefetch(() => {
  start()
})
</script>
