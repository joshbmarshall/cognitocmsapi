<template>
  <span
    class="inline-block whitespace-nowrap rounded-md p-2 text-center align-baseline text-xs font-bold leading-none"
    :class="props.color"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
  },
})
</script>
