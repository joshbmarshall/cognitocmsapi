<template>
  <template v-if="widgetvar">
    <cgn-form-input v-if="widgetvar.type == 'string'" v-model="thisval" type="text" :label="props.varName" />
    <cgn-form-input v-if="widgetvar.type == 'html'" v-model="thisval" type="text" :label="props.varName" />
  </template>
</template>

<script setup lang="ts">
import type { CognitoWidget, CognitoWidgetField } from '~cognito/models/Cognito/Widget'

const props = defineProps({
  widgetName: {
    type: String,
    required: true,
  },
  varName: {
    type: String,
    required: true,
  },
  widgets: {
    type: Array<CognitoWidget>,
  },
  modelValue: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])
const thisval = ref<string>(props.modelValue)
watch (() => thisval.value, () => {
  emit('update:modelValue', thisval.value)
})

const widgetvar = computed((): CognitoWidgetField | null => {
  const field = props.widgets?.find(e => e.name == props.widgetName)?.fields[props.varName]
  console.log(props.widgets)
  if (field.tab == 'Visibility') {
    return null
  }
  if (field.tab == 'Advanced') {
    return null
  }
  return field
})
</script>
