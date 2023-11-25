<template>
  <transition
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    class="transition duration-500 ease-in-out"
  >
    <div v-if="isShown" class="cgn-alert-wrapper">
      <div class="flex w-full flex-row items-stretch">
        <div
          class="mr-3 flex items-center p-2 text-white"
          :class="props.color"
        >
          <slot name="icon">
            <i-heroicons-solid:information-circle />
          </slot>
        </div>
        <div class="flex w-full items-center justify-between">
          <p class="cgn-alert-text">
            <slot />
          </p>
          <div class="mr-2">
            <slot name="btn" />
            <i-heroicons-solid:x v-if="props.dismissable" class="ml-2 inline cursor-pointer" @click="dismiss" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
  },
  dismissable: {
    type: Boolean,
    default: false,
  },
  dismissAfter: {
    type: Number,
    default: 0,
  },
})

const isShown = ref(true)
const dismiss = () => {
  isShown.value = false
}

onMounted(() => {
  if (props.dismissAfter > 0) {
    setTimeout(dismiss, props.dismissAfter)
  }
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
