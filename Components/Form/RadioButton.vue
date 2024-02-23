<template>
  <div>
    <label v-if="radioOptions?.length > 0" class="block select-none text-xl font-medium">{{ label }}</label>
    <div v-for="option in radioOptions" :key="option.id" class="mt-1">
      <label
        :class="curval === option.id ? 'cgn-radio-button-label-active' : 'cgn-radio-button-label'"
      >
        <div class="cgn-radio-button flex items-start gap-1 text-sm">
          <input v-if="!option.disabled" v-model="curval" type="radio" class="my-auto mr-2" :value="option.id" @change="handleInput">
          <div>
            <div :class="option.class">{{ option.name }}</div>
            <div v-if="option.content" class="cgn-radio-button-content text-xs" v-html="option.content" />
          </div>
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
