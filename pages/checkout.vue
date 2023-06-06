<template>
  <div v-if="payment_ok && payment" class="py-2">
    <cgn-alert-success class="max-w-2xl w-full mx-auto mb-2">
      Order Placed
    </cgn-alert-success>
    <div class="max-w-3xl w-full mx-auto bg-white text-black shadow">
      <cgn-sell-invoice :payment="payment.id" />
    </div>
  </div>
  <div
    v-if="!payum_token"
    class="flex justify-center items-center 2xl:container 2xl:mx-auto lg:py-16 md:py-12 py-9 px-4 md:px-6 lg:px-20 xl:px-44"
  >
    <div
      class="flex w-full sm:w-9/12 lg:w-full flex-col lg:flex-row justify-center items-top lg:space-x-10 2xl:space-x-36 space-y-12 lg:space-y-0"
    >
      <div class="flex w-full flex-col justify-start items-start">
        <div>
          <p
            class="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800"
          >
            Check out
          </p>
        </div>
        <div class="mt-2 mb-4">
          <router-link
            to="/cart"
            class="text-base dark:text-gray-400 dark:hover:text-gray-200 leading-4 hover:text-gray-800 text-gray-600 hover:underline decoration-2 decoration-gray-600 dark:decoration-gray-400 hover:decoration-solid flex flex-row gap-2 items-center pt-2"
          >
            <i-heroicons-solid:arrow-left />Back to cart
          </router-link>
        </div>
        <form class="w-full" @submit.prevent="selectAddress">
          <cgn-form-dropdown
            v-model="cartStore.shipping_address"
            label="Address"
            prompt="New Address"
            :options="addresses"
            class="w-full"
          />
          <div v-if="!cartStore.shipping_address">
            <div class="mt-8 flex flex-col justify-start items-start w-full space-y-4">
              <div class="flex flex-col sm:flex-row w-full gap-2">
                <cgn-form-input-text
                  v-model="address.first_name"
                  label="First Name"
                  class="w-full sm:w-1/2"
                  required
                />
                <cgn-form-input-text
                  v-model="address.last_name"
                  label="Last Name"
                  class="w-full sm:w-1/2"
                  required
                />
              </div>
              <cgn-address-lookup
                v-model="address"
                here-api-key="GOBLSSIkkrgjhMahFmXPramj-95rVXZYpj-0pj7DsFU"
                label="Search address"
              />
              <div class="space-y-2 w-full">
                <cgn-form-input-text v-model="address.line1" label="Address" class="w-full" required />
                <cgn-form-input-text v-model="address.line2" label="Address (line 2)" class="w-full" />
                <div class="grid grid-cols-2 sm:grid-cols-3 w-full gap-2">
                  <cgn-form-input-text v-model="address.city" label="Suburb" class="w-full" required />
                  <cgn-form-input-text v-model="address.state" label="State" class="w-full" required />
                  <cgn-form-input-text v-model="address.postcode" label="Postcode" class="w-full" required />
                  <cgn-form-input-text
                    v-model="address.country"
                    label="Country"
                    class="w-full sm:col-span-3"
                    required
                  />
                </div>
              </div>
              <cgn-form-input-email v-model="address.email" label="Email" class="w-full" required />
              <cgn-form-input-phone v-model="address.phone" label="Phone" class="w-full" required />
            </div>
            <cgn-button
              color-brand
              fullwidth
              submit
              class="my-2"
            >
              <cgn-spinner v-if="savingAddressSpinner" class="pr-2" />
              <span>Use this address</span>
            </cgn-button>
          </div>
        </form>
        <div v-if="cartStore.shipping_address" class="w-full mt-4">
          <cgn-form-radio-button v-model="cartStore.shipping_type" label="Shipping" :options="shippingQuotes" />
        </div>
        <div v-if="showShippingQuote" class="mt-4">
          <div>
            Sorry, we don't have a price to ship to your address.
          </div>
          <div>
            If you can't pick up, I can email you a shipping quote.
          </div>
          <cgn-button color-brand class="my-2" @click="requestShippingQuote">
            Request a shipping quote
          </cgn-button>
          <cgn-spinner v-if="gettingShippingQuote" />
          <cgn-alert-success v-if="gotShippingQuote">
            Shipping quote requested. I'll get back to you as soon as I can
          </cgn-alert-success>
        </div>
        <div v-else-if="noShippingQuotes" class="mt-4">
          Sorry, we can't ship to that address
        </div>
      </div>
      <div class="flex flex-col justify-start items-start w-full">
        <CartList class="w-full mt-4 lg:mb-4 lg:mt-0" />
        <div class="order-first lg:order-last w-full">
          <div class="flex flex-row gap-2 items-baseline">
            <span class="text-2xl font-semibold leading-6">Order Summary</span>
            <span
              class="text-sm text-gray-600 dark:text-gray-200"
            >({{ cartStore.cartitemCount }} Items)</span>
          </div>
          <div class="flex mt-7 flex-col items-end w-full space-y-6">
            <div class="flex justify-between w-full items-center">
              <p class="text-lg dark:text-gray-300 leading-4 text-gray-600">
                Sub total
              </p>
              <p
                class="text-lg dark:text-gray-300 font-semibold leading-4 text-gray-600"
              >
                ${{ cartStore.cartSubtotal.toFixed(2) }}
              </p>
            </div>
            <div v-if="shippingQuotes" class="flex justify-between w-full items-center">
              <p class="text-lg dark:text-gray-300 leading-4 text-gray-600">
                Shipping
                <span
                  v-if="selectedShippingQuote"
                  class="text-sm"
                >({{ selectedShippingQuote.name }})</span>
              </p>
              <p class="text-lg dark:text-gray-300 font-semibold leading-4 text-gray-600">
                <span v-if="isNaN(cartStore.shipping_amount)">-</span>
                <span v-else>${{ cartStore.shipping_amount.toFixed(2) }}</span>
              </p>
            </div>
            <div v-if="cartStore.discount_amount" class="flex justify-between w-full items-center">
              <p class="text-lg dark:text-gray-300 leading-4 text-gray-600">
                Discount
              </p>
              <p
                class="text-lg dark:text-gray-300 font-semibold leading-4 text-gray-600"
              >
                ${{ (0 - cartStore.discount_amount).toFixed(2) }}
              </p>
            </div>
          </div>
          <div class="flex justify-between w-full items-center mt-10">
            <p class="text-xl dark:text-white font-semibold leading-4 text-gray-800">
              Total
            </p>
            <p class="text-lg dark:text-white font-semibold leading-4 text-gray-800">
              <span v-if="isNaN(cartStore.total_amount)">-</span>
              <span v-else>${{ cartStore.total_amount.toFixed(2) }}</span>
            </p>
          </div>
          <div v-if="hasLaybuy" class="text-xs mt-3">
            Or 6 payments of
            ${{ (cartStore.total_amount / 6).toFixed(2) }}
            with
            <a href="https://www.laybuy.com/how-it-works" target="_blank">
              <cgn-laybuy-logo class="inline" />
                  &nbsp;
              <i-heroicons-solid:question-mark-circle class="inline" />
            </a>
          </div>
          <cgn-form-input-text v-model="cartStore.promotion_code" class="mt-2" label="Promotion Code" />
          <cgn-form-input-textarea v-model="note" class="mt-2" label="Special instructions" small />
          <cgn-form-radio-button
            v-if="!isNaN(cartStore.total_amount)"
            v-model="selectedPaymentMethod"
            label="Payment"
            :options="paymentMethods"
          />
          <cgn-alert-danger
            v-if="!selectedShippingQuote && shippingQuotes.length > 0"
            class="mt-3"
          >
            Choose shipping type
          </cgn-alert-danger>
          <cgn-alert-danger
            v-if="selectedPaymentMethod == '' && canCheckout"
            class="mt-3"
          >
            Choose payment method
          </cgn-alert-danger>
          <cgn-alert-danger
            v-if="cartStore.shipping_address == 0"
            class="mt-3"
          >
            Select or make a new shipping address
          </cgn-alert-danger>
          <cgn-button
            v-if="canCheckout"
            color-brand
            class="my-2"
            :locked="selectedPaymentMethod == ''"
            @click="payNow()"
          >
            Pay now
          </cgn-button>
          <cgn-alert-danger v-if="!cartStore.all_in_stock" class="mt-3">
            Insufficient Stock
          </cgn-alert-danger>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $axios } from '~cognito/plugins/axios'
import { SellCart } from '~cognito/models/Sell/Cart'
import type { CognitoPayment } from '~cognito/models/Cognito/Payment'

const userStore = useUserStore()
const cartStore = useCartStore()
const address = ref({
  first_name: userStore.user.first_name,
  last_name: userStore.user.last_name,
  email: userStore.user.email,
  phone: userStore.user.phone,
  company: '',
  line1: '',
  line2: '',
  city: '',
  postcode: '',
  state: '',
  country: '',
})
const savingAddressSpinner = ref(false)
const shippingQuotes = ref([])
const noShippingQuotes = ref(false)

const addresses = computed(() => {
  const addresses = []
  for (let index = 0; index < cartStore.addresses.length; index++) {
    const address = cartStore.addresses[index]
    addresses.push({
      id: address.id,
      name: address.display_name,
    })
    cartStore.shipping_address = address.id
  }
  return addresses
})

// Shipping quote
const showShippingQuote = computed(() => {
  if (!shippingQuotes.value.length) {
    return false
  }
  for (let index = 0; index < shippingQuotes.value.length; index++) {
    const shippingQuote = shippingQuotes.value[index]
    if (shippingQuote.is_pick_up) {
      continue
    }
    return false
  }
  return true
})
const gettingShippingQuote = ref(false)
const gotShippingQuote = ref(false)

const selectedAddress = computed(() => {
  for (let index = 0; index < cartStore.addresses.length; index++) {
    const address = cartStore.addresses[index]
    if (address.id === cartStore.shipping_address) {
      return address
    }
  }
  return null
})

function requestShippingQuote() {
  gettingShippingQuote.value = true
  cartStore.requestShippingQuote(selectedAddress.value)
    .then(() => {
      gotShippingQuote.value = true
      gettingShippingQuote.value = false
    })
}
async function getShippingQuote() {
  if (!selectedAddress.value) {
    return
  }
  shippingQuotes.value = await cartStore.getShippingQuotesFromSelectedAddress(selectedAddress.value)
  noShippingQuotes.value = shippingQuotes.value.length == 0
}

const selectedShippingQuote = computed(() => {
  const shippingQuote = shippingQuotes.value.find(quote => quote.id === cartStore.shipping_type)
  return shippingQuote
})

async function selectAddress() {
  savingAddressSpinner.value = true
  cartStore.shipping_address = await cartStore.saveNewAddress(
    address.value.first_name,
    address.value.last_name,
    address.value.email,
    address.value.phone,
    address.value.company,
    address.value.line1,
    address.value.line2,
    address.value.postcode,
    address.value.city,
    address.value.state,
    address.value.country,
  )
  savingAddressSpinner.value = false
  window.scrollTo(0, 0)
}
const note = ref('')

const selectedPaymentMethod = ref('')
const paymentMethods = ref<{
  id: string
  name: string
}[]>([])

const payum_token = ref('')

watch(() => cartStore.promotion_code, () => {
  cartStore.getCart()
})
watch(() => cartStore.shipping_type, () => {
  cartStore.getCart()
})
watch(() => selectedAddress.value, () => {
  getShippingQuote()
})
watch(() => cartStore.cartitemCount, () => {
  getShippingQuote()
})

const canCheckout = computed(() => {
  if (cartStore.total_amount <= 0) {
    return false
  }
  if (!cartStore.all_in_stock) {
    return false
  }
  if (cartStore.shipping_address == 0) {
    return false
  }
  return true
})

function payNow() {
  if (selectedPaymentMethod.value === '') {
    return
  }
  cartStore.submitOrder(
    cartStore.shipping_address,
    cartStore.shipping_type,
    selectedPaymentMethod.value,
    note.value,
    cartStore.promotion_code,
  )
}

const hasLaybuy = computed(() => {
  for (let index = 0; index < paymentMethods.value.length; index++) {
    const paymentMethod = paymentMethods.value[index]
    if (paymentMethod.name == 'Laybuy') {
      return true
    }
  }

  return false
})

const payment_ok = ref(null)
const payment = ref<CognitoPayment>(null)
onMounted(() => {
  payum_token.value = new URL(location.href).searchParams.get('payum_token') ?? ''
  const url = btoa(location.href)

  if (payum_token.value) {
    $axios
      .get(
        `/api/v1/cognito/payment/checkPaid?url=${url}&payum_token=${payum_token.value}`,
      )
      .then((res) => {
        payment_ok.value = res.data.success
        payment.value = res.data.payment
      })
  }
  cartStore.getCart()
  cartStore.getAddresses()
  if (cartStore.shipping_address) {
    getShippingQuote()
  }
  new SellCart().getPaymentMethods()
    .then((data) => {
      paymentMethods.value = data
    })
})
</script>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
