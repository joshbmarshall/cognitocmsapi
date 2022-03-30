<template>
  <div class="c-w-full">
    <div class="c-flex c-justify-between c-items-center c-pb-1">
      <p
        tabindex="0"
        class="c-focus:outline-none c-text-sm c-text-indigo-700 c-dark:text-indigo-600 c-font-bold"
      >
        {{ progress }}% Complete
      </p>
    </div>
    <div class="c-h-1 c-bg-gray-300 c-dark:bg-slate-600 c-rounded">
      <div
        class="c-bg-indigo-700 c-dark:bg-indigo-600 c-h-1 c-rounded c-relative"
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
