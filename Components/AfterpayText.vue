<template>
  <div v-if="amount > 0">
    Or 4 payments of ${{ amount.toFixed(2) }} with <cgn-afterpay-logo width="100" class="inline-block" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
})
const amount = computed(() => {
  return props.total / 4
})
</script>
