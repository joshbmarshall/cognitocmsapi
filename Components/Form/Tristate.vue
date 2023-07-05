<template>
  <cgn-form-dropdown :options="options" />
</template>

<script setup lang="ts">
const options = [
  {
    name: 'No',
    value: 0,
  },
  {
    name: 'Yes',
    value: 1,
  },
]
</script>
