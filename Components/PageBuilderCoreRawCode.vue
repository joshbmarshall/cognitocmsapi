<template>
  <div class="prose" v-html="templatevar.raw_html" />
</template>

<script lang="ts">
class Templatevars {
  raw_html?: string
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
