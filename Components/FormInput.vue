<template>
  <cgn-form-label :label="label">
    <div class="relative" :class="wrapClass">
      <div v-if="type === 'readonly'">
        <div :class="inputClass">
          <slot />
        </div>
      </div>
      <div v-else-if="type === 'btnlink'">
        <div :class="inputClass">
          <router-link
            ref="inputel"
            type="submit"
            class="appearance-none block px-2 w-full text-center"
            :to="url"
          >
            <slot />
          </router-link>
        </div>
      </div>
      <div v-else-if="type === 'submit'">
        <div :class="inputClass">
          <button
            ref="inputel"
            type="submit"
            class="appearance-none block px-2 w-full"
            @input="handleInput"
          >
            <slot />
          </button>
        </div>
      </div>
      <div v-else-if="type === 'textarea'">
        <textarea
          ref="inputel"
          :class="textareaClass"
          :value="modelValue"
          @input="handleInput"
        />
      </div>
      <div v-else>
        <div
          v-if="type === 'password'"
          class="absolute inset-y-0 left-0 pl-1 flex items-center cursor-pointer"
          :class="iconClass"
          @click="toggleVisible()"
        >
          <i-heroicons-solid:eye v-if="showPassword" />
          <i-heroicons-solid:eye-off v-else />
        </div>
        <div
          v-if="type === 'email'"
          class="absolute inset-y-0 left-0 pl-1 flex items-center"
          :class="iconClass"
        >
          <i-heroicons-solid:mail />
        </div>
        <div
          v-if="type === 'phone'"
          class="absolute inset-y-0 left-0 pl-1 flex items-center"
          :class="iconClass"
        >
          <i-heroicons-solid:phone />
        </div>
        <input
          ref="inputel"
          v-maska="maska"
          :min="minAmount"
          :max="maxAmount"
          :value="modelValue"
          :type="inputType"
          :placeholder="placeholder"
          :required="required"
          class="appearance-none block px-2 py-2 w-full"
          :class="inputClass + (hasIcon ? ' pl-7' : '')"
          @input="handleInput"
        >
      </div>
      <label
        v-if="type === 'password' && suggestPassword"
        class="pl-1 text-sm cursor-pointer"
        @click="setPassword()"
      >
        <span class="text-xs font-medium">Suggested password:</span>
        {{ generated_password }}
      </label>
    </div>
  </cgn-form-label>
</template>

<script setup>
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
  url: {
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
  focussed: {
    type: Boolean,
    default: false,
  },
  inputmask: {
    type: String,
  },
  inputClass: {
    type: String,
  },
  textareaClass: {
    type: String,
  },
  wrapClass: {
    type: String,
  },
  iconClass: {
    type: String,
  },
})
const emit = defineEmits(['update:modelValue'])
const maska = ref(props.inputmask)
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

const inputel = ref(null)

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

watch(() => props.focussed, () => {
  if (props.focussed) {
    inputel.value.focus()
  }
})

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
  if (props.focussed) {
    inputel.value.focus()
  }
})
</script>
