<template>
  <div>
    <div class="cgn-input-label">
      {{ label }}
      <span v-if="required" class="text-red-500 text-sm" title="Required">
        *
      </span>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

/* tailwind.css
.cgn-input-label {
  @apply text-base
}
*/
</script>
