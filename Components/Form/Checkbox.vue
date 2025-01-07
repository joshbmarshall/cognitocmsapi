<template>
  <div>
    <div class="mt-1">
      <label class="inline-block select-none text-sm text-gray-800 dark:text-gray-200">
        <input v-model="checked" type="checkbox" :required="required" @change="handleInput">
        {{ label }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const modelValue = defineModel({ type: Number || String || Boolean, default: 0 })

const checked = ref(true) // workaround sometimes not checking by default

const handleInput = () => {
  modelValue.value = checked.value ? 1 : 0
}

const setChecked = () => {
  if (typeof modelValue.value == 'string') {
    modelValue.value = Number.parseInt(modelValue.value)
  }
  checked.value = !!modelValue.value
}

watch(modelValue, setChecked)
watch(() => props, () => {
  setChecked()
}, {
  deep: true,
})

onMounted(() => {
  setChecked()
})
</script>
