<template>
  <cgn-alert-danger v-if="payment_failed" class="mx-auto my-20 w-full max-w-3xl text-3xl">
    Payment Failed
  </cgn-alert-danger>
  <cgn-alert-success v-if="payment_ok" class="mx-auto my-2 w-full max-w-2xl">
    Payment Successful.
    Your invoice will be emailed to you shortly.
  </cgn-alert-success>
  <slot v-else />
</template>

<script setup lang="ts">
import { CognitoPayment } from '~cognito/models/Cognito/Payment'
import { $axios } from '~cognito/plugins/axios'

const payment_ok = ref(null)
const payment_failed = ref(false)

const payment = ref(new CognitoPayment())
onMounted(() => {
  const payum_token = new URL(location.href).searchParams.get('payum_token')
  const url = btoa(location.href)

  if (payum_token) {
    $axios
      .get(
        `/api/v1/cognito/payment/checkPaid?url=${url}&payum_token=${payum_token}`,
      )
      .then((res) => {
        payment_ok.value = res.data.success
        payment_failed.value = !res.data.success
        payment.value = res.data.payment
      })
  }
})
</script>
