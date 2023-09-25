<template>
  <cgn-lazy-image :image="logo" />
</template>

<script setup lang="ts">
const props = defineProps({
  forcedark: {
    type: Boolean,
    default: false,
  },
})
const lightLogo = computed(() => {
  return usePagesStore().currentDomain.organisation_logo
})
const darkLogo = computed(() => {
  return usePagesStore().currentDomain.organisation_logo_dark
})
const logo = computed(() => {
  if (props.forcedark) {
    return darkLogo.value
  }
  if (isDark.value && darkLogo.value) {
    return darkLogo.value
  }
  return lightLogo.value
})
</script>
