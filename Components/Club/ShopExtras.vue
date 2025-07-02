<template>
  <div v-if="payment_ok">
    <cgn-alert-success class="mx-auto my-2 w-full max-w-2xl">
      Payment Successful.
      Please check your email for your receipt
    </cgn-alert-success>
  </div>
  <div v-else class="flex flex-col">
    <form @submit.prevent="purchase">
      <div v-if="extras.length">
        <div class="w-full pt-2 text-center text-2xl">
          Purchase
        </div>
        <div v-for="extra in extras" :key="extra.id">
          <cgn-form-checkbox v-if="extra.max_qty == 1" v-model="extra.qty" :label="extra.name" />
          <div v-else>
            <div class="text-2xl">
              {{ extra.name }}
            </div>
            <div v-html="extra.content" />
            <cgn-form-input v-model="extra.qty" type="number" :min-amount="0" :max-amount="extra.max_qty" />
          </div>
        </div>
      </div>
      <cgn-button v-if="totalPrice > 0">
        Pay ${{ totalPrice.toFixed(2) }} Now
      </cgn-button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { $axios } from '~cognito/plugins/axios'

const payment_ok = ref(false)
const payment = ref()
const extras = ref<{
  id: number
  name: string
  content: string
  max_qty: number
  cost: number
  qty: number
}[]>([])

const totalPrice = computed(() => {
  let total = 0
  extras.value.forEach((e) => {
    if (!e.qty) {
      e.qty = 0
    }
    total += e.qty * e.cost
  })
  return total
})

const purchase = () => {
  useGql<{
    clubPurchaseExtra: {
      success: boolean
      error: string
      redirect: string
    }
  }>(gql`mutation($url: String!, $extras: [clubPurchaseExtraType] ) {
    clubPurchaseExtra(url: $url, extras: $extras) {
      success
      error
      redirect
    }
	}`, {
    extras: extras.value.map((e) => {
      return {
        id: e.id,
        qty: e.qty,
      }
    }),
    url: btoa(location.href),
  }).then((res) => {
    console.log(res)
    if (res.clubPurchaseExtra.redirect) {
      location.href = res.clubPurchaseExtra.redirect
    }
    if (res.clubPurchaseExtra.error) {
      useToastStore().addToast(res.clubPurchaseExtra.error, 'danger', 5000)
    }
  })
}

const { data } = useGqlStatic<{
  clubExtras: {
    id: number
    name: string
    content: string
    max_qty: number
    cost: number
    qty: number
  }[]
}>(gql`{
    clubExtras {
      id
      name
      content
      cost
      max_qty
    }
  }
`)

watch(data, () => {
  if (!data.value) {
    return
  }
  extras.value = data.value?.clubExtras
})

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
        payment.value = res.data.payment
      })
  }
})
</script>
