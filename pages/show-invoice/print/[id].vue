<template>
  <div class="flex flex-row gap-2 p-6">
    <cgn-spinner />
    Please wait, loading invoice...
  </div>
</template>

<script setup lang="ts">
import { CognitoInvoice } from '~cognito/models/Cognito/Invoice'

const props = defineProps({
  id: {
    type: String,
  },
})
function loadInvoice() {
  new CognitoInvoice().getInvoiceById(props.id)
    .then((data) => {
      window.location = data.pdf
    })
}
onMounted(() => {
  loadInvoice()
})
</script>
