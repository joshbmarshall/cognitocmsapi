<template>
  <div class="w-full">
    <div class="flex justify-between items-center pb-1">
      <p
        tabindex="0"
        class="focus:outline-none text-sm font-bold"
        :class="textColor"
      >
        {{ progress }}% Complete
      </p>
    </div>
    <div class="h-1 bg-gray-300 dark:bg-slate-600 rounded">
      <div
        class="h-1 rounded relative"
        :class="barColor"
        :style="`width: ${progress}%`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  progress: {
    type: Number,
    default: 0,
  },
  barColor: {
    type: String,
    default: 'bg-indigo-700 dark:bg-indigo-600',
  },
  textColor: {
    type: String,
    default: 'text-indigo-700 dark:text-indigo-600',
  },
})
</script>
