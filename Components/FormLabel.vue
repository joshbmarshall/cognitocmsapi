<template>
  <div>
    <div>
      {{ label }}
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
  },
})
</script>
