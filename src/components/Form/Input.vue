<template>
  <div>
    <label class="c-pl-1 c-text-sm c-text-gray-800 dark:c-text-gray-200">{{ label }}</label>

    <div class="c-relative c-rounded-md c-shadow-sm c-my-1">
      <div
        v-if="type === 'password'"
        class="c-absolute c-inset-y-0 c-left-0 c-pl-1 c-flex c-items-center c-cursor-pointer c-text-gray-500 dark:c-text-white"
        @click="toggleVisible()"
      >
        <i-heroicons-solid:eye v-if="showPassword" />
        <i-heroicons-solid:eye-off v-else />
      </div>
      <div
        v-if="type === 'email'"
        class="c-absolute c-inset-y-0 c-left-0 c-pl-1 c-flex c-items-center c-text-gray-500 dark:c-text-white"
      >
        <i-heroicons-solid:mail />
      </div>
      <div
        v-if="type === 'phone'"
        class="c-absolute c-inset-y-0 c-left-0 c-pl-1 c-flex c-items-center c-text-gray-500 dark:c-text-white"
      >
        <i-heroicons-solid:phone />
      </div>
      <input
        v-maska="maska"
        :min="minAmount"
        :max="maxAmount"
        :value="modelValue"
        :type="inputType"
        :placeholder="placeholder"
        :required="required"
        class="c-appearance-none c-block c-rounded-md c-px-2 c-py-2 c-w-full c-shadow-md dark:c-shadow-inner c-placeholder-gray-400 focus:c-ring-indigo-500 focus:c-border-indigo-500 sm:c-text-sm dark:c-bg-slate-600"
        :class="hasIcon ? 'c-pl-7' : ''"
        @input="handleInput"
      >
    </div>
    <label
      v-if="type === 'password' && suggestPassword"
      class="c-pl-1 c-text-sm c-text-gray-800 dark:c-text-gray-200 c-cursor-pointer"
      @click="setPassword()"
    >
      <span class="c-text-xs c-font-medium">Suggested password:</span>
      {{ generated_password }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { maska as vMaska } from 'maska'
const props = defineProps({
  suggestPassword: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
  },
  placeholder: {
    type: String,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  minAmount: {
    type: [String, Number],
  },
  maxAmount: {
    type: [String, Number],
  },
  type: {
    type: String,
    default: 'text',
  },
  required: {
    type: Boolean,
    default: false,
  },
  inputmask: {
    type: String,
  },
})
const maska = ref<any>(props.inputmask)
if (props.inputmask === 'date') {
  maska.value = {
    mask: 'D#/M#/Y###',
    tokens: {
      D: { pattern: /[0-3]/ },
      M: { pattern: /[0-1]/ },
      Y: { pattern: /[1-2]/ },
    },
  }
}

const emit = defineEmits(['update:modelValue'])
const handleInput = e => emit('update:modelValue', e.currentTarget.value)

const showPassword = ref(false)
const generated_password = ref('')

const generatePassword = () => {
  const length = 8
  const charset
    = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  for (let i = 0, n = charset.length; i < length; ++i) {
    generated_password.value += charset.charAt(Math.floor(Math.random() * n))
  }
}

const setPassword = () => {
  emit('update:modelValue', generated_password.value)
}

const toggleVisible = () => {
  showPassword.value = !showPassword.value
}
const hasIcon = computed(() => {
  if (props.type === 'password') {
    return true
  }
  if (props.type === 'email') {
    return true
  }
  if (props.type === 'phone') {
    return true
  }
  return false
})

const inputType = computed(() => {
  if (props.type !== 'password') {
    return props.type
  }
  if (showPassword.value) {
    return 'text'
  }
  return 'password'
})

onMounted(() => {
  generatePassword()
})
</script>
