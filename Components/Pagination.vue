<template>
  <div v-if="pageCount > 1">
    <div class="flex items-center justify-center py-10">
      <div class="w-full flex items-center justify-between">
        <div class="flex items-center pt-3 text-gray-600">
          <router-link v-if="showFirstLink()" class="hover:text-brand-700" :to="firstLink()">
            <i-heroicons-solid:chevron-double-left />
          </router-link>
          <router-link
            v-if="showPreviousLink()"
            class="hover:text-brand-700 ml-3"
            :to="previousLink()"
          >
            <i-heroicons-solid:chevron-left />
          </router-link>
        </div>
        <div class="flex mx-2">
          <router-link
            v-if="currentPageNumber > 2"
            class="flex sm:hidden hover:text-brand-700 border-t border-transparent text-gray-600 hover:border-brand-400"
            :to="pageLink(1)"
          >
            <p class="text-sm font-medium leading-none pt-3 px-3">
              1
            </p>
            <p class="text-sm font-medium leading-none pt-3 px-3 pl-0">
              ...
            </p>
          </router-link>
          <span v-for="pageNum in pageCount" :key="pageNum">
            <router-link v-if="showPageLink(pageNum)" :to="pageLink(pageNum)">
              <p
                v-if="pageNum === currentPageNumber"
                class="text-sm font-medium leading-none cursor-pointer text-brand-600 border-t border-brand-400 pt-3 px-3"
              >{{ pageNum }}</p>
              <p
                v-else
                class="text-sm font-medium leading-none cursor-pointer text-gray-600 dark:text-gray-400 hover:text-brand-700 border-t border-transparent hover:border-brand-400 pt-3 px-3"
                :class="pageNum < currentPageNumber + 2 && pageNum > currentPageNumber - 2 ? '' : 'hidden sm:block'"
              >{{ pageNum }}</p>
            </router-link>
          </span>
          <router-link
            v-if="currentPageNumber < pageCount - 1"
            class="flex sm:hidden hover:text-brand-700 border-t border-transparent text-gray-600 hover:border-brand-400"
            :to="pageLink(pageCount)"
          >
            <p class="text-sm font-medium leading-none pt-3 px-3 pr-0">
              ...
            </p>
            <p class="text-sm font-medium leading-none pt-3 px-3">
              {{ pageCount }}
            </p>
          </router-link>
        </div>
        <div class="flex items-center pt-3 text-gray-600">
          <router-link v-if="showNextLink()" class="hover:text-brand-700 mr-3" :to="nextLink()">
            <i-heroicons-solid:chevron-right />
          </router-link>
          <router-link v-if="showLastLink()" class="hover:text-brand-700" :to="lastLink()">
            <i-heroicons-solid:chevron-double-right />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  pageCount: {
    type: Number,
    required: true,
  },
  urlPrefix: {
    type: String,
    required: true,
  },
  group: {
    type: String,
  },
  currentPage: {
    default: '1',
  },
})
const pageLink = (pageNum: number) => {
  const group = props.group || 'page'
  let url = `/${props.urlPrefix}`
  if (pageNum === 1) {
    if (group === 'page') {
      return url
    }
  }
  url += `/${group}`
  if (pageNum > 1) {
    url += `/${pageNum}`
  }
  return url
}
const currentPageNumber = computed(() => parseInt(props.currentPage))

const firstLink = () => {
  return pageLink(1)
}
const previousLink = () => {
  return pageLink(currentPageNumber.value - 1)
}
const nextLink = () => {
  return pageLink(currentPageNumber.value + 1)
}
const lastLink = () => {
  return pageLink(props.pageCount)
}

const showPageLink = (page: number) => {
  if (page < 1) {
    return false
  }
  if (page > props.pageCount) {
    return false
  }
  return true
}

const showFirstLink = () => {
  return currentPageNumber.value > 1
}
const showPreviousLink = () => {
  return currentPageNumber.value > 1
}
const showNextLink = () => {
  return currentPageNumber.value < props.pageCount
}
const showLastLink = () => {
  return currentPageNumber.value < props.pageCount
}
</script>
