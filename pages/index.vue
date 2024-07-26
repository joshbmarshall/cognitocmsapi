<template>
  <cgn-page-builder-router v-if="!config.listPageContentFeature" page="home" />
  <cgn-page-builder-list-router v-else page="home" />
</template>

<script setup lang="ts">
import { config } from '~/config'
</script>
