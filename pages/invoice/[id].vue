<template>
  <div class="py-6">
    <div class="max-w-3xl w-full mx-auto bg-white text-black shadow">
      <div v-html="invoice" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SellInvoice } from '~cognito/models/Sell/Invoice'

const props = defineProps({
  id: {
    type: String,
  },
})
const invoice = ref('')
function loadInvoice() {
  new SellInvoice({
    id: props.id,
  }).invoiceText()
    .then((data) => {
      invoice.value = data.invoice_text
    })
}
watch(() => props.id, () => {
  loadInvoice()
})
onMounted(() => {
  loadInvoice()
})
</script>
