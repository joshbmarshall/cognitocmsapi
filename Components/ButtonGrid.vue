<template>
  <div>
    <div v-if="warnText">
      <span v-if="warn" class="text-xs font-light text-red-500">
        {{ warnText }} </span>
    </div>
    <div
      class="grid grid-cols-1 gap-4 w-full select-none mt-1"
      :class="gridWidth ? 'sm:grid-cols-3' : 'sm:grid-cols-2'"
    >
      <div
        v-for="button in buttons"
        :key="button.id"
        class="
          relative
          rounded-lg
          bg-white
          dark:bg-slate-600
          px-6
          py-5
          shadow-md
          dark:shadow-inner
          flex
          items-center
          space-x-3
          cursor-pointer
        "
        :class="[
          warn
            ? 'border-red-300 hover:border-red-400 ring-2 ring-offset-2 ring-red-500'
            : '',
          modelValue == button.id ? 'ring-2 ring-offset-2 ring-brand-500' : '',
        ]"
      >
        <div class="flex-1 min-w-0" @click="chooseButton(button.id)">
          <span class="absolute inset-0" aria-hidden="true" />
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {{ button.name }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 truncate" />
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
