<template>
  <div />
</template>

<script setup lang="ts">
import { logout } from '~cognito/plugins/axios'

const router = useRouter()
logout()
nextTick(() => {
  router.push('/')
})
</script>
