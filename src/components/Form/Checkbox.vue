<template>
  <div>
    <div class="mt-1">
      <label class="inline-block text-sm text-gray-800 dark:text-gray-200 select-none">
        <input v-model="checked" type="checkbox" :required="required" @change="handleInput">
        {{ label }}
      </label>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
  },
  modelValue: {
    type: Number,
    default: 0,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const checked = ref(props.modelValue === '1')

const emit = defineEmits(['update:modelValue'])
const handleInput = () => emit('update:modelValue', checked.value ? 1 : 0)
</script>
