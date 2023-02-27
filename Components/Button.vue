<template>
  <div class="my-2 text-white">
    <router-link
      v-if="url" :to="url" :type="submit ? 'submit' : undefined" class="
        block
        shadow
        py-1.5
        px-4
        rounded-lg
        text-center
        bg-brand-500
        dark:bg-brand-500
      " :class="`${locked
        ? 'cursor-not-allowed opacity-50'
        : 'hover:bg-brand-600 dark:hover:bg-brand-400'
        } ${extraClasses}`
      "
    >
      <slot />
    </router-link>
    <button
      v-else :type="submit ? 'submit' : undefined" class="
        shadow
        py-1.5
        px-4
        rounded-lg
        text-center
        select-none
        bg-brand-500
        dark:bg-brand-500
      " :class="`${locked
        ? 'cursor-not-allowed opacity-50'
        : 'cursor-pointer hover:bg-brand-600 dark:hover:bg-brand-400'
        } ${extraClasses}`
    "
    >
      <slot />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  url: {
    type: String,
  },
  extraClasses: {
    type: String,
    default: '',
  },
  locked: {
    type: Boolean,
    default: false,
  },
  submit: {
    type: Boolean,
    default: false,
  },
})
// TODO colour selector with computed
// TODO option to open in new tab for link buttons
</script>
