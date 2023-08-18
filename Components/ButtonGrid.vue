<template>
  <div>
    <div v-if="warnText">
      <span v-if="warn" class="text-xs font-light text-red-500">
        {{ warnText }} </span>
    </div>
    <div
      class="mt-1 grid w-full select-none grid-cols-1 gap-4"
      :class="gridWidth ? 'sm:grid-cols-3' : 'sm:grid-cols-2'"
    >
      <div
        v-for="button in buttons"
        :key="button.id"
        class="
          relative
          flex
          cursor-pointer
          items-center
          space-x-3
          rounded-lg
          bg-white
          px-6
          py-5
          shadow-md
          dark:bg-slate-600
          dark:shadow-inner
        "
        :class="[
          warn
            ? 'border-red-300 ring-2 ring-red-500 ring-offset-2 hover:border-red-400'
            : '',
          modelValue == button.id ? 'ring-2 ring-brand-500 ring-offset-2' : '',
        ]"
      >
        <div class="min-w-0 flex-1" @click="chooseButton(button.id)">
          <span class="absolute inset-0" aria-hidden="true" />
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {{ button.name }}
          </p>
          <p class="truncate text-sm text-gray-500 dark:text-gray-400" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {},
  buttons: {
    type: Array,
    required: true,
  },
  warn: {
    type: Boolean,
  },
  warnText: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue'])

const gridWidth = computed(() => {
  return Number.isInteger(props.buttons.length / 3) || props.buttons.length > 6
})

const chooseButton = (id: number) => {
  emit('update:modelValue', 0)
  nextTick(() => {
    emit('update:modelValue', id)
  })
}
</script>
