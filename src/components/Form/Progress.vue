<template>
  <div class="w-full">
    <div class="flex justify-between items-center pb-1">
      <p
        tabindex="0"
        class="focus:outline-none text-sm text-indigo-700 dark:text-indigo-600 font-bold"
      >
        {{ progress }}% Complete
      </p>
    </div>
    <div class="h-1 bg-gray-300 dark:bg-slate-600 rounded">
      <div
        class="bg-indigo-700 dark:bg-indigo-600 h-1 rounded relative"
        :style="'width: ' + progress + '%'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
})
</script>
