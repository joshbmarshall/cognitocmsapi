<template>
  <div>
    <div v-if="label" class="cgn-input-label">
      {{ label }}
      <span v-if="required" class="text-sm text-red-500" title="Required">
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
