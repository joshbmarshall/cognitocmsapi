<template>
  <div class="cgn-alert-wrapper">
    <div class="flex items-stretch flex-row">
      <div
        class="mr-3 p-2 text-white flex items-center"
        :class="props.color"
      >
        <slot name="icon">
          <i-heroicons-solid:information-circle />
        </slot>
      </div>
      <div class="flex items-center">
        <p class="cgn-alert-text">
          <slot />
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
  },
})

/* tailwind.css
.cgn-alert-wrapper {
  @apply bg-white dark:bg-gray-700 shadow rounded flex items-center justify-between overflow-hidden my-2
}
.cgn-alert-text {
  @apply mr-2 my-1 text-sm dark:text-gray-300 text-gray-600 text-left
}
*/
</script>
