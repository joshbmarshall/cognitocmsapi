<template>
  <div class="flex flex-row gap-2 p-6">
    <cgn-spinner />
    Please wait, loading invoice...
  </div>
</template>

<script setup lang="ts">
import { SellInvoice } from '~cognito/models/Sell/Invoice'

const props = defineProps({
  id: {
    type: String,
  },
})
function loadInvoice() {
  new SellInvoice({
    id: props.id,
  }).invoiceText()
    .then((data) => {
      window.location = data.pdf
    })
}
onMounted(() => {
  loadInvoice()
})
</script>
