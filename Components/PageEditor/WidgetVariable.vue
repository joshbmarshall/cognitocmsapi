<template>
  <div>
    <cgn-form-input-text
      v-if="props.templateField.type == 'string'" v-model="modelValue"
      :label="props.templateField.display_name" class="!my-0"
    />
    <div v-else-if="props.templateField.type == 'html'">
      <cgn-form-label :label="props.templateField.display_name" />
      <cgn-tip-tap v-model="modelValue" />
    </div>
    <cgn-form-checkbox
      v-else-if="props.templateField.type == 'bool'" v-model="modelValue"
      :label="props.templateField.display_name"
    />
    <cgn-form-dropdown
      v-else-if="props.templateField.type == 'select'" v-model="modelValue"
      :options="optionsArray" :label="props.templateField.display_name"
    />
    <div v-else>
      {{ props.templateField.display_name }}
      <div class="text-muted text-sm">
        Unknkown type: '{{ props.templateField.type }}'
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  templateField: {
    type: Object as PropType<{
      name: string
      display_name: string
      type: string
      default_value: any
      description: string
      options: string
    }>,
    required: true,
  },
})
const modelValue = defineModel({ type: String || Number })

const optionsArray = computed(() => {
  return props.templateField.options.split('|').map((option) => {
    const optionFields = option.split('=')
    return { id: optionFields[0], name: optionFields[1] }
  })
})
</script>
