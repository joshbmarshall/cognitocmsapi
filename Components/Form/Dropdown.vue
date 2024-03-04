<template>
  <div>
    <cgn-form-label class="cgn-input-wrapper" :label="label" :required="required">
      <select
        v-model="curval" :required="required" class="cgn-input-field block w-full bg-white p-2"
        :class="inputClass" @change="handleInput"
      >
        <option v-if="!hideSelect" value="">
          {{ prompt }}
        </option>
        <option v-for="option in dropdownOptions" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </select>
    </cgn-form-label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
  },
  prompt: {
    type: String,
    default: '-- Select --',
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
  inputClass: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'input'])
const curval = ref('')
const dropdownOptions = ref(props.options)

function handleInput() {
  emit('change')
  emit('update:modelValue', curval.value)
}

function formatOptions() {
  if (!dropdownOptions.value) {
    curval.value = ''
    handleInput()
    return
  }
  for (let index = 0; index < dropdownOptions.value.length; index++) {
    const dropdownOption = dropdownOptions.value[index]
    if (typeof (dropdownOption) == 'string') {
      dropdownOptions.value[index] = {
        id: dropdownOption,
        name: dropdownOption,
      }
    } else {
      if (!dropdownOption.id) {
        dropdownOptions.value[index].id = dropdownOption.value
      }
      if (!dropdownOption.id) {
        dropdownOptions.value[index].id = index
      }
      if (!dropdownOption.name) {
        dropdownOptions.value[index].name = dropdownOption.label
      }
    }
  }

  // Does the current value exist in the dropdown Options?
  for (let index = 0; index < dropdownOptions.value.length; index++) {
    const element = dropdownOptions.value[index]
    if (curval.value == element.value) {
      return
    }
  }
  curval.value = ''
  handleInput()
}

watch(() => props.modelValue, () => {
  curval.value = props.modelValue
})

watch(() => props.options, () => {
  dropdownOptions.value = props.options
  formatOptions()
})

onMounted(() => {
  curval.value = props.modelValue
  formatOptions()
})
</script>
