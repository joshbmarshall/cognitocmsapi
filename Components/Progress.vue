<template>
  <div class="w-full">
    <div class="flex items-center justify-between pb-1">
      <p
        tabindex="0"
        class="text-sm font-bold focus:outline-none"
        :class="textColor"
      >
        {{ progress }}% Complete
      </p>
    </div>
    <div class="h-1 rounded bg-gray-300 dark:bg-slate-600">
      <div
        class="relative h-1 rounded"
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
    default: 'bg-brand-500',
  },
  textColor: {
    type: String,
    default: 'text-brand-500',
  },
})
</script>
