<template>
  <cgn-spinner v-if="props.loading" />
  <slot v-else />
</template>

<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean,
  },
})
</script>
