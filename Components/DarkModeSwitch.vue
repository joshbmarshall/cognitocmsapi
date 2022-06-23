<template>
  <div class="cursor-pointer" @click="toggleDark()">
    <i-heroicons-solid:moon v-if="isDark" />
    <i-heroicons-solid:sun v-else />
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
