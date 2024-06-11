<template>
  <cgn-form-label class="cgn-input-wrapper" :label="label" :required="required || fakeRequired">
    <div class="relative" :class="wrapClass">
      <div v-if="type === 'readonly'">
        <div :class="inputClass" class="cgn-input-field bg-white p-2">
          <slot>{{ modelValue }}</slot>
        </div>
      </div>
      <div v-else-if="type === 'btnlink'">
        <div :class="inputClass" class="cgn-input-field bg-white p-2">
          <router-link ref="inputel" type="submit" class="block w-full appearance-none px-2 text-center" :to="url">
            <slot />
          </router-link>
        </div>
      </div>
      <div v-else-if="type === 'submit'">
        <div :class="inputClass" class="cgn-input-field bg-white p-2">
          <button ref="inputel" type="submit" class="block w-full appearance-none px-2" @input="handleInput">
            <slot />
          </button>
        </div>
      </div>
      <div v-else-if="type === 'textarea'">
        <textarea
          ref="inputel"
          :class="textareaClass" class="cgn-input-textarea-field block w-full appearance-none"
          :value="modelValue"
          :required="required"
          :placeholder="placeholder"
          @input="handleInput"
        />
      </div>
      <div v-else>
        <div
          v-if="type === 'password'" class="absolute inset-y-0 left-0 flex cursor-pointer items-center pl-1"
          :class="iconClass" @click="toggleVisible()"
        >
          <i-heroicons-solid:eye v-if="showPassword" />
          <i-heroicons-solid:eye-off v-else />
        </div>
        <div v-if="type === 'email'" class="absolute inset-y-0 left-0 flex items-center pl-1" :class="iconClass">
          <i-heroicons-solid:mail />
        </div>
        <div v-if="type === 'phone'" class="absolute inset-y-0 left-0 flex items-center pl-1" :class="iconClass">
          <i-heroicons-solid:phone />
        </div>
        <div v-if="type === 'currency'" class="absolute inset-y-0 left-1 flex items-center pl-1" :class="iconClass">
          $
        </div>
        <div v-if="type === 'percent'" class="absolute inset-y-0 right-1 flex items-center pl-1" :class="iconClass">
          %
        </div>
        <div class="flex">
          <input
            ref="inputel" v-maska:[maska] :min="minAmount" :max="maxAmount" :value="modelValue" :type="inputType"
            :step="step"
            :placeholder="placeholder" :required="required" class="cgn-input-field block w-full appearance-none p-2"
            :class="inputClass + (hasIcon ? ' pl-7' : '')"
            :autocomplete="autocomplete"
            :inputmode="props.inputmode"
            @input="handleInput"
            @blur="blurInput"
          >
          <div v-if="showButton" class="cgn-button ml-1 bg-brand-500 text-on-brand hover:bg-brand-600 dark:hover:bg-brand-400" @click="buttonClick">
            <slot />
          </div>
        </div>
      </div>
    </div>
    <cgn-form-label
      v-if="type === 'password' && suggestPassword" class="cursor-pointer text-sm"
      :label="`Suggested password: ${generated_password}`" @click="setPassword()"
    />
    <cgn-alert-warning v-if="validationError">
      {{ validationError }}
    </cgn-alert-warning>
  </cgn-form-label>
</template>

<script setup>
import { vMaska } from 'maska'

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
  autocomplete: {
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
  step: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  required: {
    type: Boolean,
    default: false,
  },
  fakeRequired: {
    // Only shows red asterisk
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
  inputmode: {
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
  showButton: {
    type: Boolean,
    default: false,
  },
  buttonColorBrand: {
    type: Boolean,
    default: false,
  },
  validationError: {
    type: String,
  },
})
const emit = defineEmits(['update:modelValue', 'blur', 'buttonClick'])
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
const blurInput = _e => emit('blur')
const buttonClick = _e => emit('buttonClick')

const showPassword = ref(false)
const generated_password = ref('')

function generatePassword() {
  const length = 8
  const charset
    = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  for (let i = 0, n = charset.length; i < length; ++i) {
    generated_password.value += charset.charAt(Math.floor(Math.random() * n))
  }
}

function setPassword() {
  emit('update:modelValue', generated_password.value)
}

watch(() => props.focussed, () => {
  if (props.focussed) {
    inputel.value.focus()
  }
})

function toggleVisible() {
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
  if (props.type === 'currency') {
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

/* tailwind.css
.cgn-input-wrapper {
  @apply my-2
}
.cgn-input-textarea-field {
  @apply rounded-md p-2 shadow-md dark:shadow-inner placeholder-gray-400 focus:ring-brand-500 focus:border-brand-500 sm:text-sm dark:bg-slate-600
}
.cgn-input-field {
  @apply rounded-md shadow-md dark:shadow-inner placeholder-gray-400 focus:ring-brand-500 focus:border-brand-500 sm:text-sm dark:bg-slate-600
}
*/
</script>
