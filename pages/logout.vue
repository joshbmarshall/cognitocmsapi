<template>
  <div />
</template>

<script setup lang="ts">
import { logout } from '~cognito/plugins/axios'

const router = useRouter()
onMounted(() => {
  logout()
  setTimeout(() => {
    router.replace('/')
  }, 500)
})
</script>
