<template>
  <div v-if="show" class="fixed bottom-16 left-4 z-10" @click="stayawake">
    <i-humbleicons:activity />
  </div>
</template>

<script setup lang="ts">
const wakeLock = reactive(useWakeLock())
const stayawake = () => {
  wakeLock.request('screen')
}
const show = computed(() => {
  if (!import.meta.env.DEV) {
    return false
  }
  if (!wakeLock.isSupported) {
    return false
  }
  if (wakeLock.isActive) {
    return false
  }
  return true
})
</script>
