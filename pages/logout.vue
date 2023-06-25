<template>
  <div />
</template>

<script setup lang="ts">
import { logout } from '~cognito/plugins/axios'

const router = useRouter()
onMounted(() => {
  logout()
  setTimeout(() => {
    router.push('/')
  }, 500)
})
</script>
