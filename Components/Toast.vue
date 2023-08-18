<template>
  <div>
    <cgn-modal v-model="show" :timeout="parseInt(timeout)">
      <template #icon>
        <div
          v-if="type == 'fail'"
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-danger-100 text-danger-800 dark:bg-danger-800 dark:text-danger-100 sm:h-10 sm:w-10"
        >
          <i-heroicons-solid:exclamation />
        </div>
        <div
          v-else
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success-100 text-success-800 dark:bg-success-800 dark:text-success-100 sm:h-10 sm:w-10"
        >
          <i-heroicons-solid:check />
        </div>
      </template>
      <template #content>
        <h3 class="select-none text-lg font-medium leading-6 text-gray-900 dark:text-white">
          <span v-if="type == 'fail'">
            Failed
          </span>
          <span v-else>
            Success!
          </span>
        </h3>
        <div class="mt-2">
          <p class="select-none text-sm text-gray-500 dark:text-gray-400">
            {{ message }}
          </p>
        </div>
      </template>
      <template #button-footer>
        <div class="px-4 py-1 sm:py-0">
          <cgn-button color-primary @click="close()">
            Close
          </cgn-button>
        </div>
      </template>
    </cgn-modal>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: '',
  },
  message: {
    type: String,
  },
  timeout: {
    type: String,
    default: '3000',
  },
})

const emit = defineEmits([
  'update:modelValue',
])

const show = ref(false)

const close = () => {
  emit('update:modelValue', false)
}
watch(show, () => {
  emit('update:modelValue', show.value)
})

watch(() => props.modelValue, () => {
  show.value = props.modelValue
})
onMounted(() => {
  show.value = props.modelValue
})
// TODO replace icon colors with warning and success
</script>
