<template>
  <div>
    <cgn-form-input
      v-bind="$attrs"
      :model-value="props.modelValue"
      type="date"
      @update:model-value="handleInput($event)"
    />
    <cgn-form-checkbox
      v-if="showAge"
      :label="`I am ${age} years old`"
      required
    />
  </div>
</template>

<script setup lang="ts">
import { CognitoTime } from '~cognito/models/Cognito/Time'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])
const showAge = ref(false)

const handleInput = (e) => {
  showAge.value = e != props.modelValue
  emit('update:modelValue', e)
}

const age = computed(() => {
  return new CognitoTime(props.modelValue).age()
})
</script>
