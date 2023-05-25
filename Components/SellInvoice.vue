<template>
  <div>
    <cgn-alert-danger v-if="notfound">
      Could not load the invoice
    </cgn-alert-danger>
    <div v-html="invoice_text" />
  </div>
</template>

<script setup lang="ts">
import { SellInvoice } from '~cognito/models/Sell/Invoice'

const props = defineProps({
  payment: {
    type: String,
    required: true,
  },
})
const invoice_text = ref('')
const notfound = ref(false)
onMounted(() => {
  new SellInvoice().display(props.payment)
    .then((data) => {
      invoice_text.value = data.invoice_text
    })
    .catch(() => {
      notfound.value = true
    })
})
</script>
