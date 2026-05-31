<template>
  <cgn-form-input ref="inputRef" type="text" v-bind="$attrs" />
</template>

<script setup>
const inputRef = ref()
defineExpose({ focus: () => inputRef.value?.focus() })
</script>
