<template>
  <a
    v-if="to.startsWith('http')"
    :href="to"
    class="
      cursor-pointer
      text-sm
      font-medium
      text-brand-600
      hover:text-brand-500
      dark:text-brand-400
      dark:hover:text-brand-300
      "
    :target="noblanktarget ? '' : '_blank'"
  >
    <slot />
  </a>
  <router-link
    v-else
    :to="to"
    class="
      cursor-pointer
      text-sm
      font-medium
      text-brand-600
      hover:text-brand-500
      dark:text-brand-400
      dark:hover:text-brand-300
      "
  >
    <slot />
  </router-link>
</template>

<script setup lang="ts">
defineProps({
  to: {
    type: String,
    required: true,
  },
  noblanktarget: {
    type: Boolean,
    default: false,
  },
})
</script>
