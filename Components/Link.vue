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
