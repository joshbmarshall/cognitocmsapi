<template>
  <div class="cgn-tab-wrapper">
    <div class="flex overflow-hidden text-center flex-col md:flex-row cgn-tab-main">
      <div v-for="tab in props.tabs" :key="tab?.name" class="cursor-pointer cgn-tab" :class="{ 'cgn-tab-active': activeTab == tab?.name }" @click="activeTab = tab?.name">
        {{ tab?.name }}
      </div>
    </div>

    <div class="cgn-tab-content">
      <slot :selected_tab="activeTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  tabs: {
    type: Array,
  },
})

const activeTab = ref('')

function selectFirstTab() {
  activeTab.value = props.tabs?.find(tab => tab !== undefined)?.name
}

watch(() => props, () => {
  selectFirstTab()
}, {
  deep: true,
})

onMounted(() => {
  selectFirstTab()
})
/* tailwind.css
.cgn-tab-wrapper {
  @apply mt-4
}

.cgn-tab-main {
  @apply mb-1 md:px-2 md:gap-6 bg-gray-50 dark:bg-slate-700 md:bg-transparent md:dark:bg-transparent rounded-md md:rounded-none divide-y-2 md:divide-y-0 divide-gray-300 dark:divide-gray-500 md:border-b-2 border-gray-300 dark:border-gray-500
}

.cgn-tab-content {
  @apply p-2
}

.cgn-tab {
  @apply p-2
}

.cgn-tab-active {
  @apply bg-gray-200 md:bg-gray-300 dark:bg-gray-600 md:rounded-t-md
}
*/
</script>
