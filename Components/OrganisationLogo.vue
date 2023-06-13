<template>
  <cgn-lazy-image :image="logo" />
</template>

<script setup lang="ts">
const lightLogo = computed(() => {
  return usePagesStore().currentDomain.organisation_logo
})
const darkLogo = computed(() => {
  return usePagesStore().currentDomain.organisation_logo_dark
})
const logo = computed(() => {
  if (isDark.value && darkLogo.value) {
    return darkLogo.value
  }
  return lightLogo.value
})
</script>
