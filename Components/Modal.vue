<template>
  <div
    v-if="modelValue"
  >
    <div class="fixed inset-0 z-[9999] h-screen w-screen bg-gray-500/75 transition-opacity dark:bg-black/60" @click="close()" />
    <div class="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div
        class="dark:bg-darkbg-700 pointer-events-auto relative flex max-h-[85dvh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
      >
        <div
          class="dark:hover:bg-darkbg-600 absolute right-0 top-0 size-10 select-none p-2.5 text-lg hover:bg-gray-100"
          @click="close()"
        >
          <i-heroicons-solid:x />
        </div>
        <div class="min-h-0 flex-1 overflow-y-scroll overscroll-contain break-words px-4 py-5 sm:p-6" :class="{ 'max-h-[500px]': !props.fullheight }">
          <div class="flex items-start">
            <div>
              <slot name="icon" />
            </div>
            <div class="ml-4 min-w-0 text-left">
              <slot name="content" />
            </div>
          </div>
          <div class="text-left">
            <slot name="clean-content" />
          </div>
        </div>
        <div class="dark:bg-darkbg-700 shrink-0 bg-gray-50 sm:flex sm:flex-row-reverse">
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
