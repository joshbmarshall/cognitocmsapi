<template>
  <div>
    <div class="border-b border-gray-300 dark:border-gray-600">
      <nav aria-label="Breadcrumb" class="mx-auto max-w-7xl px-1 sm:px-6 lg:px-8">
        <div class="items-center py-4 sm:flex sm:space-x-3">
          <div>
            <div class="flex items-center">
              <router-link
                to="/"
                class="pl-7 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200 sm:pl-0"
              >
                Home
              </router-link>
            </div>
          </div>

          <div v-for="link in links" :key="link.url">
            <div class="text-sm">
              <div class="flex items-center">
                <i-heroicons-solid:chevron-right class="text-gray-300 dark:text-gray-600" />
                <router-link
                  :to="link.url"
                  aria-current="page"
                  class="ml-3 truncate font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {{ link.name }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  links: {
    type: Array,
  },
})
</script>
