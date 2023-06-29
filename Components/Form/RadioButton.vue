<template>
  <div>
    <label v-if="radioOptions?.length > 0" class="block text-xl font-medium select-none">{{ label }}</label>
    <div v-for="option in radioOptions" :key="option.id" class="mt-1">
      <label
        class="block bg-white dark:bg-slate-600 border-2 rounded-lg shadow-sm px-6 py-4 cursor-pointer sm:flex sm:justify-between"
        :class="curval === option.id ? 'border-brand-500' : 'border-gray-300 dark:border-gray-700'"
      >
        <div class="cgn-radio-button text-sm">
          <div class="flex items-center">
            <input v-if="!option.disabled" v-model="curval" type="radio" class="mr-2" :value="option.id" @change="handleInput">
            <div>{{ option.name }}</div>
          </div>
          <div v-if="option.content" class="cgn-radio-button-content text-xs" v-html="option.content" />
        </div>
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
    type: [String, Number],
    default: '',
  },
  hideSelect: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'input'])

const curval = ref('')
const radioOptions = ref(props.options)

const handleInput = () => {
  emit('change')
  emit('update:modelValue', curval.value)
}

const formatOptions = () => {
  if (!radioOptions.value) {
    return
  }
  for (let index = 0; index < radioOptions.value.length; index++) {
    const radioOption = radioOptions.value[index]
    if (typeof (radioOption) == 'string') {
      radioOptions.value[index] = {
        id: radioOption,
        name: radioOption,
      }
    } else {
      if (!radioOption.name) {
        radioOptions.value[index].name = radioOption.label
      }
    }
  }
}

watch(() => props.modelValue, () => {
  curval.value = props.modelValue
})

watch(() => props.options, () => {
  radioOptions.value = props.options
  formatOptions()
})

onMounted(() => {
  curval.value = props.modelValue
  formatOptions()
})
/* tailwind.css
.cgn-radio-button {
  @apply text-sm
}

.cgn-radio-button-content {
  @apply text-xs
}
*/
</script>
