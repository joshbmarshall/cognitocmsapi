<template>
  <div v-if="props.total >= props.minimumAmount">
    Or 4 payments of ${{ amount.toFixed(2) }} with <cgn-afterpay-logo width="100" class="inline-block" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  minimumAmount: {
    type: Number,
    required: false,
    default: 0,
  },
})
const amount = computed(() => {
  return props.total / 4
})
</script>
