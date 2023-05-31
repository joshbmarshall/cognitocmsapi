<template>
  <cgn-page-builder-router :page="props.all" />
</template>

<script setup lang="ts">
const props = defineProps({
  all: {
    type: String,
    required: true,
  },
})
</script>
