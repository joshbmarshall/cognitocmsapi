<template>
  <div class="m-4">
    <label v-if="label" class="block font-medium text-base select-none">{{ label }}</label>
    <div
      class="border border-gray-100 rounded-lg p-2 cursor-pointer"
      :class="selected_id == -1 ? 'bg-white shadow divide-y-2 divide-gray-200' : 'bg-blue-50 shadow-inner'"
    >
      <div v-for="select in props.options" :key="select.id" @click="pickOption(select)">
        <slot v-if="selected_id == -1 || selected(select.id)" :select="select" :selected="selected(select.id)">
          <div class="flex gap-4 flex-row p-2">
            <span class="flex w-full flex-col py-1 select-none">
              <span class="text-xl font-semibold capitalize">{{ select.name }}</span>
              {{ select.subname }}
            </span>
            <span v-if="!selected(select.id)" class="flex justify-end">
              <i-heroicons-outline:cursor-click />
            </span>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  options: {
    type: Array,
  },
  label: {
    type: String,
  },
  modelValue: {
    type: Object,
  },
  autoSelect: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'input'])

const selected_id = ref(-1)

const pickOption = (option: object, bypass: false) => {
  if (selected_id.value === option.id && !bypass) {
    selected_id.value = -1
    emit('change')
    emit('update:modelValue', {})
    return
  }
  selected_id.value = option.id
  emit('change')
  emit('update:modelValue', option)
}

const selected = (id: number) => {
  return selected_id.value === id
}

const chooseOneOption = () => {
  if (!props.autoSelect) {
    return
  }
  if (props.options?.length > 1) {
    return
  }
  pickOption(props.options[0], true)
}
watch(() => props.options, () => {
  chooseOneOption()
})

watch(() => props.modelValue, () => {
  selected_id.value = props.modelValue.id || -1
})

onMounted(() => {
  chooseOneOption()
})
</script>
