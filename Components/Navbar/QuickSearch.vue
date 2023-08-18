<template>
  <span>
    <span class="cursor-pointer" @click="dropdownToggle()">
      <i-heroicons-solid:search />
    </span>
    <div class="relative">
      <div
        v-if="dropdown"
        ref="quicksearch"
        class="absolute top-6 z-50 w-72 overflow-hidden rounded-md bg-white text-gray-700 drop-shadow-xl dark:bg-darkbg-900 dark:text-gray-300 md:w-96"
        :class="props.dropdownRight ? 'left-0' : 'right-0'"
      >
        <div class="flex flex-row items-center bg-gray-100 px-4 py-2 dark:bg-darkbg-800">
          <div class="font-bold text-gray-700 dark:text-gray-300">Search</div>
          <span
            v-if="search.length > 0"
            class="pl-2 text-sm text-gray-600 dark:text-gray-400"
          >Found {{ searchresults?.found }} results</span>
          <div class="flex flex-1 cursor-pointer justify-end" @click="dropdownToggle()">
            <i-heroicons-solid:x />
          </div>
        </div>
        <cgn-form-input-text
          v-model="search"
          class="-mt-6 border-b-2 border-gray-100 px-4 py-1 dark:border-darkbg-800"
        />
        <router-link
          v-for="result, index in searchresults?.hits"
          :key="index"
          :to="`/product/${result.document.url}`"
        >
          <div
            class="flex flex-row gap-2 p-4 pb-2"
            :class="index % 2 ? 'bg-gray-100 dark:bg-darkbg-800' : 'bg-white dark:bg-darkbg-900'"
          >
            <cgn-lazy-image
              class="aspect-square h-full max-h-[2.5rem] w-full max-w-[2.5rem] overflow-hidden rounded-md dark:bg-white"
              :placeholder="result.document.image_url"
              :url="result.document.image_url"
              :webp="result.document.image_url"
            />
            <div class="flex grow flex-col">
              <div class="flex justify-between">
                <div>
                  {{ result.document.name }}
                  <div
                    class="block text-xs text-gray-600 dark:text-gray-400"
                    v-html="result.document.blurb"
                  />
                </div>
              </div>
            </div>
          </div>
        </router-link>
        <div class="flex flex-row justify-end bg-gray-50 p-4 dark:bg-darkbg-800">
          <router-link
            v-if="searchresults?.found > 5"
            class="flex flex-row items-center"
            :to="`/search/${search}`"
          >
            <i-heroicons-outline:search />
            <span class="pl-1">View all</span>
          </router-link>
        </div>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { CognitoCTypesense } from '~cognito/models/Cognito/CTypesense'

const props = defineProps({
  dropdownRight: {
    type: Boolean,
    default: false,
  },
})

const searchresults = ref<CognitoCTypesense>()
const page = ref(1)
const per_page = ref(5)
const search = ref('')

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

const dropdown = ref(false)
function dropdownToggle() {
  dropdown.value = !dropdown.value
}

const router = useRouter()
router.beforeEach(() => {
  dropdown.value = false
})

watch(() => search.value, () => {
  doSearch()
})

const quicksearch = ref(null)
onClickOutside(quicksearch, (event) => {
  dropdown.value = false
})

onMounted(() => {
})
</script>
