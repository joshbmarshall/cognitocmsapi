<template>
  <div
    v-if="modelValue"
    class="fixed w-full h-full z-10 inset-0 overflow-y-auto"
    style="z-index: 9999"
  >
    <div class="place-content-center min-h-screen pt-4 px-4 pb-20 text-center block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-700 dark:bg-opacity-75 bg-opacity-75 transition-opacity" @click="close()" />
      <div
        class="inline-block bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-xl transform w-full my-8 max-w-4xl"
      >
        <div
          class="absolute top-0 right-0 w-10 h-10 select-none hover:bg-gray-100 dark:hover:bg-gray-600 text-lg p-2.5"
          @click="close()"
        >
          <i-heroicons-solid:x />
        </div>
        <div class="px-4 py-5 sm:p-6">
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
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  timeout: {
    type: Number,
  },
})

const emit = defineEmits(['update:modelValue'])

const timeoutID = ref(0)

const close = () => {
  emit('update:modelValue', false)
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
