<template>
  <div>
    <label class="pl-1 text-sm text-gray-800 dark:text-gray-200">{{ props.label }}</label>
    <textarea
      :value="props.modelValue"
      type="text"
      :placeholder="props.placeholder"
      :required="props.required"
      :rows="props.rows"
      class="block rounded-md rounded-br-none p-1.5 mb-1 w-full shadow-md dark:shadow-inner placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-slate-600"
      @input="handleInput"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 3,
  },
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])
const handleInput = e => emit('update:modelValue', e.currentTarget.value)
</script>
