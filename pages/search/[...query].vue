<template>
  <div class="relative">
    <div class="gap-10 px-4 pb-20 pt-16 sm:flex sm:px-6 lg:px-8 lg:pb-28 lg:pt-12">
      <div class="relative mx-auto w-full max-w-7xl">
        <div class="text-center">
          <h2
            class="flex flex-row items-end justify-center gap-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl"
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
            class="text-center text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Found {{ searchresults?.found }} results
          </div>
          <div
            v-if="page_count > 0"
            class="text-center text-sm font-medium text-gray-700 dark:text-gray-300"
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
          class="mx-auto mt-12 grid max-w-lg gap-5 md:max-w-none md:grid-cols-2 lg:grid-cols-3"
        >
          <router-link
            v-for="result, index in searchresults?.hits"
            :key="index"
            :to="`/product/${result.document.url}`"
            class="flex flex-col overflow-hidden rounded-lg shadow-lg"
          >
            <div class="shrink-0">
              <cgn-lazy-image
                class="w-full bg-white"
                :placeholder="result.document.image_url"
                :url="result.document.image_url"
                :webp="result.document.image_url"
              />
            </div>
            <div class="flex flex-1 flex-row justify-between gap-2 bg-white p-6 dark:bg-gray-800">
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
              <div class="flex items-baseline justify-end gap-2">
                <cgn-button>Details</cgn-button>
              </div>
            </div>
          </router-link>
        </div>
        <div class="flex grow justify-center py-5">
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

onMounted(() => {
  search.value = props.query
  doSearch()
})
</script>
