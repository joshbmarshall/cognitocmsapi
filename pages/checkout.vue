<template>
  <div v-if="payment_ok && payment" class="py-2">
    <cgn-alert-success class="mx-auto mb-2 w-full max-w-2xl">
      Order Placed
    </cgn-alert-success>
    <div class="mx-auto w-full max-w-3xl bg-white text-black shadow">
      <cgn-sell-invoice :payment="payment.id" />
    </div>
  </div>
  <div
    v-if="!payum_token"
    class="flex items-center justify-center px-4 py-9 2xl:container md:px-6 md:py-12 lg:px-20 lg:py-16 xl:px-44 2xl:mx-auto"
  >
    <div v-if="cartStore.cartitemCount == 0" class="text-center">
      <p>
        No items in your cart
      </p>
      <cgn-button color-brand url="/shop">
        Shop Now
      </cgn-button>
    </div>
    <div
      v-else
      class="flex w-full flex-col items-start justify-center space-y-12 sm:w-9/12 lg:w-full lg:flex-row lg:space-x-10 lg:space-y-0 2xl:space-x-36"
    >
      <div class="flex w-full flex-col items-start justify-start">
        <div>
          <p
            class="text-3xl font-semibold leading-7 text-gray-800 dark:text-white lg:text-4xl lg:leading-9"
          >
            Check out
          </p>
        </div>
        <div class="mb-4 mt-2">
          <router-link
            to="/cart"
            class="flex flex-row items-center gap-2 pt-2 text-base leading-4 text-gray-600 decoration-gray-600 decoration-2 hover:text-gray-800 hover:underline hover:decoration-solid dark:text-gray-400 dark:decoration-gray-400 dark:hover:text-gray-200"
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
            <div class="mt-8 flex w-full flex-col items-start justify-start space-y-4">
              <div class="flex w-full flex-col gap-2 sm:flex-row">
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
              <div class="w-full space-y-2">
                <cgn-form-input-text v-model="address.line1" label="Address" class="w-full" required />
                <cgn-form-input-text v-model="address.line2" label="Address (line 2)" class="w-full" />
                <div class="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
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
        <div v-if="cartStore.shipping_address" class="mt-4 w-full">
          <cgn-form-radio-button v-model="cartStore.shipping_type" label="Shipping" :options="shippingQuotes" />
        </div>
        <div v-if="showShippingQuote" class="mt-4">
          <div>
            Sorry, we don't have a price to ship to your address.
          </div>
          <div>
            If you can't pick up, we can email you a shipping quote.
          </div>
          <cgn-button color-brand class="my-2 w-full" @click="requestShippingQuote">
            Request a shipping quote
          </cgn-button>
          <cgn-spinner v-if="gettingShippingQuote" />
          <cgn-alert-success v-if="gotShippingQuote">
            Shipping quote requested. We'll get back to you as soon as we can
          </cgn-alert-success>
        </div>
        <div v-else-if="noShippingQuotes" class="mt-4">
          Sorry, we can't ship to that address
        </div>
      </div>
      <div class="flex w-full flex-col items-start justify-start">
        <cgn-sell-cart-list class="mt-4 w-full lg:mb-4 lg:mt-0" />
        <div class="order-first w-full lg:order-last">
          <div class="flex flex-row items-baseline gap-2">
            <span class="text-2xl font-semibold leading-6">Order Summary</span>
            <span
              class="text-sm text-gray-600 dark:text-gray-200"
            >({{ cartStore.cartitemCount }} Items)</span>
          </div>
          <div class="mt-7 flex w-full flex-col items-end space-y-6">
            <div class="flex w-full items-center justify-between">
              <p class="text-lg leading-4 text-gray-600 dark:text-gray-300">
                Sub total
              </p>
              <p
                class="text-lg font-semibold leading-4 text-gray-600 dark:text-gray-300"
              >
                ${{ cartStore.cartSubtotal.toFixed(2) }}
              </p>
            </div>
            <div v-if="shippingQuotes" class="flex w-full items-center justify-between">
              <p class="text-lg leading-4 text-gray-600 dark:text-gray-300">
                Shipping
                <span
                  v-if="selectedShippingQuote"
                  class="text-sm"
                >({{ selectedShippingQuote.name }})</span>
              </p>
              <p class="text-lg font-semibold leading-4 text-gray-600 dark:text-gray-300">
                <span v-if="isNaN(cartStore.shipping_amount)">-</span>
                <span v-else>${{ cartStore.shipping_amount.toFixed(2) }}</span>
              </p>
            </div>
            <div v-if="cartStore.discount_amount" class="flex w-full items-center justify-between">
              <p class="text-lg leading-4 text-gray-600 dark:text-gray-300">
                Discount
              </p>
              <p
                class="text-lg font-semibold leading-4 text-gray-600 dark:text-gray-300"
              >
                ${{ (0 - cartStore.discount_amount).toFixed(2) }}
              </p>
            </div>
          </div>
          <div class="mt-10 flex w-full items-center justify-between">
            <p class="text-xl font-semibold leading-4 text-gray-800 dark:text-white">
              Total
            </p>
            <p class="text-lg font-semibold leading-4 text-gray-800 dark:text-white">
              <span v-if="isNaN(cartStore.total_amount)">-</span>
              <span v-else>${{ cartStore.total_amount.toFixed(2) }}</span>
            </p>
          </div>
          <div v-if="hasLaybuy" class="mt-3 text-xs">
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
            :options="cartStore.payment_types"
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
          <cgn-alert-danger
            v-if="error_message"
            class="mt-3"
          >
            {{ error_message }}
          </cgn-alert-danger>
          <cgn-button
            v-if="canCheckout"
            color-brand
            class="my-2 w-full"
            :locked="selectedPaymentMethod == ''"
            @click="payNow()"
          >
            Place Order
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
const error_message = ref('')

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

const payNow = async () => {
  if (selectedPaymentMethod.value === '') {
    return
  }
  error_message.value = await cartStore.submitOrder(
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
const payment = ref<CognitoPayment>()
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
})
</script>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
