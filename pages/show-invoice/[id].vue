<template>
  <div class="py-6">
    <div class="max-w-3xl w-full mx-auto bg-white text-black shadow">
      <div v-html="invoice" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CognitoInvoice } from '~cognito/models/Cognito/Invoice'

const props = defineProps({
  id: {
    type: String,
  },
})
const invoice = ref('')
function loadInvoice() {
  new CognitoInvoice().getInvoiceById(props.id)
    .then((data) => {
      invoice.value = data.invoiceText
    })
}
watch(() => props.id, () => {
  loadInvoice()
})
onMounted(() => {
  loadInvoice()
})
</script>
