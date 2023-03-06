<template>
  <router-link
    :to="to"
    class="
      text-sm
      font-medium
      text-brand-600
      hover:text-brand-500
      cursor-pointer
      "
  >
    <slot />
  </router-link>
</template>

<script setup lang="ts">
defineProps({
  to: {
    type: String,
  },
})
</script>
