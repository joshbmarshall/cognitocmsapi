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
  new CognitoInvoice().getInvoicePdfUrl(props.id)
    .then((url) => {
      window.location = url
    })
}
onMounted(() => {
  loadInvoice()
})
</script>
