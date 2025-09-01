<template>
  <div v-if="pageCount > 1">
    <div class="flex items-center justify-center py-10">
      <div class="flex w-full items-center justify-between">
        <div class="flex items-center pt-3 text-gray-600">
          <router-link v-if="showFirstLink()" class="hover:text-brand-700" :to="firstLink()">
            <i-heroicons-solid:chevron-double-left />
          </router-link>
          <router-link
            v-if="showPreviousLink()"
            class="ml-3 hover:text-brand-700"
            :to="previousLink()"
          >
            <i-heroicons-solid:chevron-left />
          </router-link>
        </div>
        <div class="mx-2 flex">
          <router-link
            v-if="currentPageNumber > 2"
            class="flex border-t border-transparent text-gray-600 hover:border-brand-400 hover:text-brand-700 sm:hidden"
            :to="pageLink(1)"
          >
            <p class="px-3 pt-3 text-sm font-medium leading-none">
              1
            </p>
            <p class="px-3 pl-0 pt-3 text-sm font-medium leading-none">
              ...
            </p>
          </router-link>
          <span v-for="pageNum in pageCount" :key="pageNum">
            <router-link v-if="showPageLink(pageNum)" :to="pageLink(pageNum)">
              <p
                v-if="pageNum === currentPageNumber"
                class="cursor-pointer border-t border-brand-400 px-3 pt-3 text-sm font-medium leading-none text-brand-600"
              >{{ pageNum }}</p>
              <p
                v-else
                class="cursor-pointer border-t border-transparent px-3 pt-3 text-sm font-medium leading-none text-gray-600 hover:border-brand-400 hover:text-brand-700 dark:text-gray-400"
                :class="pageNum < currentPageNumber + 2 && pageNum > currentPageNumber - 2 ? '' : 'hidden sm:block'"
              >{{ pageNum }}</p>
            </router-link>
          </span>
          <router-link
            v-if="currentPageNumber < pageCount - 1"
            class="flex border-t border-transparent text-gray-600 hover:border-brand-400 hover:text-brand-700 sm:hidden"
            :to="pageLink(pageCount)"
          >
            <p class="px-3 pr-0 pt-3 text-sm font-medium leading-none">
              ...
            </p>
            <p class="px-3 pt-3 text-sm font-medium leading-none">
              {{ pageCount }}
            </p>
          </router-link>
        </div>
        <div class="flex items-center pt-3 text-gray-600">
          <router-link v-if="showNextLink()" class="mr-3 hover:text-brand-700" :to="nextLink()">
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
const currentPageNumber = computed(() => Number.parseInt(props.currentPage) || 1)

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
