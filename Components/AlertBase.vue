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
      overflow-hidden
      cgn-alert-wrapper
    "
  >
    <div class="flex flex-row">
      <div
        v-if="props.type == 'danger'"
        class="mr-3 p-2 bg-red-400 text-white"
      >
        <i-heroicons-solid:exclamation />
      </div>
      <div
        v-if="props.type == 'warning'"
        class="mr-3 p-2 bg-amber-400 text-white"
      >
        <i-heroicons-solid:information-circle />
      </div>
      <div
        v-if="props.type == 'success'"
        class="mr-3 p-2 bg-green-400 text-white"
      >
        <i-heroicons-solid:check />
      </div>
      <p class="mr-2 my-1 text-sm dark:text-gray-300 text-gray-600 text-left cgn-alert-text">
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
// TODO change red / amber / green to danger / warning / success colors
// TODO remove all classes that are already defined in the tailwind.css

/* tailwind.css
.cgn-alert-wrapper {
  @apply bg-white dark:bg-gray-700 shadow rounded flex items-center justify-between overflow-hidden my-2
}
.cgn-alert-text {
  @apply mr-2 my-1 text-sm dark:text-gray-300 text-gray-600 text-left
}
*/
</script>
