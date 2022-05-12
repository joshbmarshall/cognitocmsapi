<template>
  <div v-if="props.pageCount > 1">
    <div class="flex items-center justify-center py-10">
      <div class="w-full flex items-center justify-between">
        <div class="flex items-center pt-3 text-gray-600">
          <router-link v-if="showFirstLink()" class="hover:text-indigo-700" :to="firstLink()">
            <i-heroicons-solid:chevron-double-left />
          </router-link>
          <router-link
            v-if="showPreviousLink()"
            class="hover:text-indigo-700 ml-3"
            :to="previousLink()"
          >
            <i-heroicons-solid:chevron-left />
          </router-link>
        </div>
        <div class="flex mx-2">
          <router-link
            v-if="props.currentPage > 2"
            class="flex sm:hidden hover:text-indigo-700 border-t border-transparent text-gray-600 hover:border-indigo-400"
            :to="pageLink(1)"
          >
            <p class="text-sm font-medium leading-none pt-3 px-3">
              1
            </p>
            <p class="text-sm font-medium leading-none pt-3 px-3 pl-0">
              ...
            </p>
          </router-link>
          <span v-for="pageNum in props.pageCount" :key="pageNum">
            <router-link v-if="showPageLink(pageNum)" :to="pageLink(pageNum)">
              <p
                v-if="pageNum == props.currentPage"
                class="text-sm font-medium leading-none cursor-pointer text-indigo-700 border-t border-indigo-400 pt-3 px-3"
              >{{ pageNum }}</p>
              <p
                v-else
                class="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 px-3"
                :class="pageNum < parseInt(props.currentPage) + 2 && pageNum > parseInt(props.currentPage) - 2 ? '' : 'hidden sm:block'"
              >{{ pageNum }}</p>
            </router-link>
          </span>
          <router-link
            v-if="props.currentPage < props.pageCount - 1"
            class="flex sm:hidden hover:text-indigo-700 border-t border-transparent text-gray-600 hover:border-indigo-400"
            :to="pageLink(props.pageCount)"
          >
            <p class="text-sm font-medium leading-none pt-3 px-3 pr-0">
              ...
            </p>
            <p class="text-sm font-medium leading-none pt-3 px-3">
              {{ props.pageCount }}
            </p>
          </router-link>
        </div>
        <div class="flex items-center pt-3 text-gray-600">
          <router-link v-if="showNextLink()" class="hover:text-indigo-700 mr-3" :to="nextLink()">
            <i-heroicons-solid:chevron-right />
          </router-link>
          <router-link v-if="showLastLink()" class="hover:text-indigo-700" :to="lastLink()">
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
    type: Number,
    default: 1,
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
const firstLink = () => {
  return pageLink(1)
}
const previousLink = () => {
  return pageLink(parseInt(props.currentPage) - 1)
}
const nextLink = () => {
  return pageLink(parseInt(props.currentPage) + 1)
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
  return props.currentPage > 1
}
const showPreviousLink = () => {
  return props.currentPage > 1
}
const showNextLink = () => {
  return props.currentPage < props.pageCount
}
const showLastLink = () => {
  return props.currentPage < props.pageCount
}
</script>