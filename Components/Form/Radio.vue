<template>
  <div>
    <label v-if="props.label" class="pl-1 text-sm text-gray-800 dark:text-gray-200">{{ props.label }}</label>
    <div v-for="option in radioOptions" :key="option.id">
      <label>
        <input v-model="curval" type="radio" :value="option.id" @change="handleInput">
        {{ option.name }}
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
      if (radioOption.label) {
        radioOptions.value[index].id = radioOption.value
        radioOptions.value[index].name = radioOption.label
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
