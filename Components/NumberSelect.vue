<template>
  <div class="text-center">
    <i-heroicons-solid:chevron-up @click="inc" />
    {{ inputValue }}
    <i-heroicons-solid:chevron-down @click="dec" />
  </div>
</template>

<script setup lang="ts">
const {
  min,
  max,
} = defineProps<{
  min: number
  max: number
}>()

const inputValue = defineModel<any>()

const inc = () => {
  inputValue.value++
  if (inputValue.value >= max) {
    inputValue.value = max
  }
}
const dec = () => {
  inputValue.value--
  if (inputValue.value <= min) {
    inputValue.value = min
  }
}
</script>
