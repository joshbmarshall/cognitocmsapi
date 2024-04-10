<template>
  <div v-if="has_payment">
    <cgn-alert-success v-if="payment_ok">
      Payment Successful
      Please check your email for your receipt
    </cgn-alert-success>
    <cgn-alert-danger v-else>
      Payment Failed
    </cgn-alert-danger>
  </div>
  <cgn-spinner v-else-if="loading" />
  <div v-else>
    <div class="mb-2 text-right">
      <cgn-button v-if="buy_gift_voucher_mode" color-brand @click="buy_gift_voucher_mode = false">
        Redeem a gift voucher
      </cgn-button>
      <cgn-button v-else color-brand @click="buy_gift_voucher_mode = true">
        Buy a gift voucher
      </cgn-button>
    </div>
    <form v-if="buy_gift_voucher_mode" @submit.prevent="submitPayment">
      <div class="mb-2 grid-cols-2 gap-2 md:grid">
        <div>
          <cgn-form-dropdown
            v-model="formValues.theme_id"
            label="Gift Voucher Theme" :options="voucherThemes.map(e => {
              return { name: e.name, value: e.id }
            })" hide-select
          />
          <cgn-form-dropdown v-model="amount" label="Gift Voucher Amount" :options="dropdown_amounts" required />
          <cgn-form-input-currency v-if="props.templatevar.allow_custom_amounts && amount == '-1'" v-model="custom_amount" label="Custom Amount" />
        </div>
        <cgn-lazy-image v-if="selectedTheme" :image="selectedTheme.image" class="rounded-lg" />
      </div>
      <cgn-alert-danger v-if="errorMessage">
        {{ errorMessage }}
      </cgn-alert-danger>
      <cgn-button v-if="price > 0" color-brand fullwidth class="font-bold">
        Pay ${{ price.toFixed(2) }} Now
      </cgn-button>
    </form>
    <form v-else @submit.prevent="redeemVoucher">
      <div class="text-xl">
        Redeem gift voucher
      </div>
      <cgn-form-input-text v-model="redeem_code" label="Code" />
      <cgn-alert-danger v-if="errorMessage">
        {{ errorMessage }}
      </cgn-alert-danger>
      <cgn-button color-brand fullwidth class="font-bold">
        Redeem Now
      </cgn-button>
    </form>
  </div>
</template>

<script lang="ts">
import { gql } from 'graphql-request'
import type { CognitoImage } from '~cognito/models/Cognito/Image'
import { CognitoPayment } from '~cognito/models/Cognito/Payment'
import { $axios, requireLoggedIn } from '~cognito/plugins/axios'

class Templatevars {
  amounts?: string
  allow_custom_amounts: boolean

  constructor() {
    this.allow_custom_amounts = true
  }
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})

const router = useRouter()
const loading = ref(false)
const buy_gift_voucher_mode = ref(true)
const redeem_code = ref('')
const has_payment = ref(false)
const payment_ok = ref(false)
const custom_amount = ref('0')
const amount = ref('0')
const voucherThemes = ref<{
  id: number
  name: string
  image: CognitoImage
}[]>([])
const errorMessage = ref('')

const formValues = ref({
  theme_id: 0,
  amount: 0,
  url: '',
})

const selectedTheme = computed(() => {
  return voucherThemes.value.find(e => e.id == formValues.value.theme_id)
})

const dropdown_amounts = computed(() => {
  if (!props.templatevar?.amounts) {
    return []
  }
  const amounts = props.templatevar.amounts.split('|').map((e) => {
    return { name: `$${Number.parseFloat(e).toFixed(2)}`, value: e }
  })

  if (!props.templatevar.allow_custom_amounts) {
    return amounts
  }

  return [...amounts, { name: 'Custom Amount', value: -1 }]
})

const price = computed<number>(() => {
  if (amount.value == '-1') {
    return Number.parseFloat(custom_amount.value)
  }
  return Number.parseFloat(amount.value)
})

const submitPayment = async () => {
  formValues.value.amount = price.value
  formValues.value.url = btoa(location.href)
  const result = (await $axios.post('/api/v1/cognito/giftVoucher/payNow', formValues.value)).data
  errorMessage.value = result.message
  if (result.success) {
    window.location = result.payment
  }
}

const redeemVoucher = async () => {
  const result = (await $axios.post('/api/v1/cognito/giftVoucher/redeem', { code: redeem_code.value })).data
  errorMessage.value = result.message
  if (result.success) {
    router.push('/profile')
  }
}

onMounted(async () => {
  requireLoggedIn()
  loading.value = true
  const payment = await new CognitoPayment().checkSuccessful()
  has_payment.value = payment.has_payment
  payment_ok.value = payment.success

  const data = await $axios.graphql(gql`{
    cognitoGiftVoucherThemes {
      id
      name
        image(image_width: 400, image_aspect: "16x9") {
          url
          width
          height
        }
    }
  }`)

  voucherThemes.value = data.cognitoGiftVoucherThemes
  formValues.value.theme_id = voucherThemes.value[0].id

  loading.value = false
})
</script>
