<template>
  <cgn-account-forgot-password />
</template>

<script setup lang="ts">
const start = () => {
  usePageStore().setSEO({
    title: 'Forgot Password',
    canonical: '/forgotpassword',
  })
}
onMounted(start)
onServerPrefetch(start)
</script>
