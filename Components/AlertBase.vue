<template>
  <div
    class="
      w-full
      bg-white
      dark:bg-slate-700
      shadow
      rounded
      flex
      items-center
      flex-row
      justify-between
    "
  >
    <div class="flex flex-row">
      <div
        v-if="props.type == 'danger'"
        class="mr-3 p-2 bg-red-400 rounded-l text-white"
      >
        <i-heroicons-solid:exclamation />
      </div>
      <div
        v-if="props.type == 'success'"
        class="mr-3 p-2 bg-green-400 rounded-l text-white"
      >
        <i-heroicons-solid:check />
      </div>
      <p class="mr-2 my-1 text-sm dark:text-gray-300 text-gray-600 text-left">
        <slot />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: 'danger',
  },
})
</script>
