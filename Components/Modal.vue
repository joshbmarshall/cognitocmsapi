<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-10 h-full w-full overflow-y-auto"
    style="z-index: 9999"
  >
    <div class="block min-h-screen place-content-center px-4 pb-20 pt-4 text-center sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-700 dark:bg-opacity-75" @click="close()" />
      <div
        class="my-8 inline-block w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-700"
      >
        <div
          class="absolute right-0 top-0 h-10 w-10 select-none p-2.5 text-lg hover:bg-gray-100 dark:hover:bg-gray-600"
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
  },
  timeout: {
    type: Number,
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
