<template>
  <div>
    <cgn-form-label :label="label" :required="required"></cgn-form-label>
    <select v-model="curval" :required="required" class="block w-full bg-white cgn-input-field"
      :class="inputClass" @change="handleInput">
      <option v-if="!hideSelect" value>
        {{ prompt }}
      </option>
      <option v-for="option in dropdownOptions" :key="option.id" :value="option.id">
        {{ option.name }}
      </option>
    </select>
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
  }
})

const curval = ref('')
const dropdownOptions = ref(props.options)

const emit = defineEmits(['update:modelValue', 'change', 'input'])
const handleInput = () => {
  emit('change')
  emit('update:modelValue', curval.value)
}

const formatOptions = () => {
  if (!dropdownOptions.value) {
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
        dropdownOptions.value[index].id = index
      }
      if (!dropdownOption.name) {
        dropdownOptions.value[index].name = dropdownOption.label
      }
    }
  }
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
  if (!curval.value) {
    curval.value = ''
  }
  formatOptions()
})
</script>
