<template>
  <div>
    <label v-if="radioOptions?.length > 0" class="block text-xl font-medium select-none">{{ label }}</label>
    <div v-for="option in radioOptions" :key="option.id" class="mt-1">
      <label
        class="block bg-white dark:bg-slate-600 border-2 rounded-lg shadow-sm px-6 py-4 cursor-pointer sm:flex sm:justify-between"
        :class="curval === option.id ? 'border-indigo-500' : 'border-gray-300 dark:border-gray-700'"
      >
        <div class="flex items-center">
          <input v-model="curval" type="radio" class="mr-2" :value="option.id" @change="handleInput">
          <div class="text-sm">{{ option.name }}</div>
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

const curval = ref('')
const radioOptions = ref(props.options)

const emit = defineEmits(['update:modelValue', 'change', 'input'])
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
      if (!radioOption.id) {
        radioOptions.value[index].id = index
      }
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
  if (!curval.value) {
    curval.value = ''
  }
  formatOptions()
})
</script>
