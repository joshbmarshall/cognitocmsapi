<template>
  <div class="prose dark:prose-invert max-w-none" v-html="templatevar.html" />
</template>

<script lang="ts">
class Templatevars {
  html?: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})
</script>
