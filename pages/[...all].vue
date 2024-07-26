<template>
  <cgn-page-builder-router v-if="!config.listPageContentFeature" :page="props.all" />
  <cgn-page-builder-list-router v-else :page="props.all" />
</template>

<script setup lang="ts">
import { config } from '~/config'

const props = defineProps({
  all: {
    type: String,
    required: true,
  },
})
</script>
