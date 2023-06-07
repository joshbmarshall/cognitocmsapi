<template>
  <span>
    <span class="cursor-pointer" @click="dropdownToggle()">
      <i-heroicons-solid:search />
    </span>
    <div class="relative">
      <div
        v-if="dropdown"
        ref="quicksearch"
        class="absolute w-72 md:w-96 drop-shadow-xl top-6 rounded-md overflow-hidden text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 z-50"
        :class="props.dropdownRight ? 'left-0' : 'right-0'"
      >
        <div class="flex flex-row items-center px-4 py-2 bg-gray-100 dark:bg-gray-800">
          <div class="font-bold text-gray-700 dark:text-gray-300">Search</div>
          <span
            v-if="search.length > 0"
            class="text-sm text-gray-600 dark:text-gray-400 pl-2"
          >Found {{ searchresults?.found }} results</span>
          <div class="flex justify-end flex-1 cursor-pointer" @click="dropdownToggle()">
            <i-heroicons-solid:x />
          </div>
        </div>
        <cgn-form-input-text
          v-model="search"
          class="px-4 py-1 -mt-6 border-b-2 border-gray-100 dark:border-gray-800"
        />
        <router-link
          v-for="result, index in searchresults?.hits"
          :key="index"
          :to="`/product/${result.document.url}`"
        >
          <div
            class="flex flex-row gap-2 p-4 pb-2"
            :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'"
          >
            <cgn-lazy-image
              class="aspect-square rounded-md overflow-hidden w-full h-full max-w-[2.5rem] max-h-[2.5rem] dark:bg-white"
              :placeholder="result.document.image_url"
              :url="result.document.image_url"
              :webp="result.document.image_url"
            />
            <div class="flex flex-col flex-grow">
              <div class="flex justify-between">
                <div>
                  {{ result.document.name }}
                  <div
                    class="text-xs text-gray-600 dark:text-gray-400 block"
                    v-html="result.document.blurb"
                  />
                </div>
              </div>
            </div>
          </div>
        </router-link>
        <div class="flex flex-row justify-end p-4 bg-gray-50 dark:bg-gray-800">
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
