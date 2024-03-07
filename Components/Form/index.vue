<template>
  <pre>{{ form }}</pre>
</template>

<script setup lang="ts">
import { CognitoForm } from '~cognito/models/Cognito/Form'
import { $axios } from '~cognito/plugins/axios'

const props = defineProps({
  url: {
    type: String,
  },
})

const payment_ok = ref(null)
const payment = ref(null)

const form = ref<CognitoForm>(null)

const loadform = async () => {
  const data = await new CognitoForm().find_one({ url: props.url })
  form.value = data
}

watch(() => props, loadform, { deep: true })

onMounted(async () => {
  const payum_token = new URL(location.href).searchParams.get('payum_token')
  const url = btoa(location.href)

  if (payum_token) {
    const data = await $axios.get(`/api/v1/cognito/payment/checkPaid?url=${url}&payum_token=${payum_token}`)

    payment_ok.value = data.success
    payment.value = data.payment
  }
  loadform()
})
</script>
