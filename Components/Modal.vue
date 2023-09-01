<template>
  <div
    v-if="modelValue"
  >
    <div class="fixed inset-0 z-[9999] h-screen w-screen bg-gray-500/75 transition-opacity dark:bg-gray-700/75" @click="close()" />
    <div
      class="fixed inset-x-0 top-0 z-[9999] mx-auto my-8 inline-block w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-700"
    >
      <div
        class="absolute right-0 top-0 h-10 w-10 select-none p-2.5 text-lg hover:bg-gray-100 dark:hover:bg-gray-600"
        @click="close()"
      >
        <i-heroicons-solid:x />
      </div>
      <div class="overflow-y-scroll overscroll-contain px-4 py-5 sm:p-6" :class="{ 'max-h-[500px]': !props.fullheight }">
        <div class="flex items-start">
          <div>
            <slot name="icon" />
          </div>
          <div class="ml-4 text-left">
            <slot name="content" />
          </div>
        </div>
        <div class="text-left">
          <slot name="clean-content" />
        </div>
      </div>
      <div class="bg-gray-50 dark:bg-gray-700 sm:flex sm:flex-row-reverse">
        <slot name="button-footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
  },
  timeout: {
    type: Number,
  },
  fullheight: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const timeoutID = ref(0)

function close() {
  emit('update:modelValue', false)
  emit('close')
}

watch(() => props.modelValue, (newval) => {
  if (!newval) {
    clearTimeout(timeoutID.value)
    return
  }
  if (!props.timeout) {
    return
  }
  timeoutID.value = setTimeout(() => close(), props.timeout)
})
</script>
