<template>
  <div>
    <div v-if="has_payment">
      <div
        v-if="payment_ok"
      >
        <cgn-alert-success
          class="max-w-2xl w-full mx-auto my-2"
        >
          Payment Successful
        </cgn-alert-success>
        <div class="max-w-3xl w-full mx-auto bg-white text-black shadow" v-html="invoiceText" />
      </div>
      <cgn-alert-danger
        v-else
        class="max-w-2xl w-full mx-auto my-2"
      >
        Payment Failed
      </cgn-alert-danger>
    </div>
    <div v-else>
      <slot />
      <form @submit.prevent="searchAvailability()">
        <div class="flex gap-2">
          <cgn-form-input v-model="quoteform.from_date" label="Check In" type="date" required class="w-full" />
          <cgn-form-input v-model="quoteform.to_date" label="Check Out" type="date" required class="w-full" />
        </div>
        <div v-for="personType in quoteform.people" :key="personType.type">
          <cgn-form-input
            v-model="personType.qty"
            :label="personType.name"
            :min-amount="personType.min_qty"
            max-amount="5"
            type="number"
          />
        </div>
        <cgn-form-input v-model="quoteform.caravan_length" type="number" min-amount="1" max-amount="20" label="Caravan length (metres)" />
        <cgn-button color-brand fullwidth>
          Search
        </cgn-button>
      </form>
      <cgn-alert-danger v-if="no_availability">
        Sorry, there are no sites available for those dates
      </cgn-alert-danger>
      <div v-if="price_from" class="mt-4">
        <div class="text-center">
          Prices from: <span class="text-2xl">${{ price_from.toFixed(2) }}</span>
        </div>
        <form @submit.prevent="bookNow()">
          <cgn-form-dropdown v-model="bookform.site_id" :options="bookSiteOptions" label="Site" required />
          <div class="flex gap-2">
            <cgn-form-input v-model="bookform.first_name" label="First Name" required class="w-full" />
            <cgn-form-input v-model="bookform.last_name" label="Last Name" required class="w-full" />
          </div>
          <cgn-form-input-email v-model="bookform.email" label="Email" required />
          <cgn-form-input v-model="bookform.phone" type="phone" label="Phone" required />
          <cgn-form-input v-model="bookform.suburb" label="Suburb" required />
          <cgn-form-input v-model="bookform.state" label="State" required />
          <cgn-form-input v-model="bookform.registration" label="Caravan Registration" required />
          <cgn-form-input v-model="bookform.car_registration" label="Car Registration" />
          <cgn-form-input v-model="bookform.est_arrival_time" type="time" label="Estimated Arrival Time" required />
          <cgn-alert-danger v-if="payErrorMessage">
            {{ payErrorMessage }}
          </cgn-alert-danger>
          <div v-if="selectedAmount">
            <div class="text-xl font-bold text-center my-4">
              Total: ${{ selectedAmount.toFixed(2) }}
            </div>
            <cgn-form-checkbox v-if="isAdmin" v-model="bookform.paid" label="This booking has already been paid" />
            <cgn-button color-brand fullwidth>
              <template v-if="isAdmin">
                Create Booking and send
                <template v-if="bookform.paid">
                  Receipt
                </template>
                <template v-else>
                  Invoice
                </template>
              </template>
              <template v-else>
                Pay Now
              </template>
            </cgn-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CaravanBooking } from '~cognito/models/Caravan/Booking'
import { CaravanBookingPersonQty } from '~cognito/models/Caravan/BookingPersonQty'
import { CaravanPriceQuote, CaravanQuoteForm } from '~cognito/models/Caravan/PriceQuote'
import { CaravanPersonType } from '~cognito/models/Caravan/PersonType'
import { CognitoPayment } from '~cognito/models/Cognito/Payment'
import { CognitoInvoice } from '~cognito/models/Cognito/Invoice'

const personTypes = ref<CaravanPersonType[]>([])
const payErrorMessage = ref('')

const quoteform = ref<CaravanQuoteForm>(new CaravanQuoteForm())
const bookform = ref<CaravanBooking>(new CaravanBooking())

const quotes = ref<CaravanPriceQuote>(new CaravanPriceQuote())
const has_payment = ref(false)
const payment_ok = ref(false)
const no_availability = ref(false)
const invoiceText = ref('')

const price_from = computed(() => {
  if (quotes.value.available_sites.length === 0) {
    return 0
  }
  return Math.min(...quotes.value.prices.map(e => e.amount))
})

const isAdmin = computed(() => {
  return useUserStore().user.is_admin
})
const selectedAmount = computed(() => {
  return quotes.value.prices.find(f => f.site_type_id === quotes.value.available_sites.find(e => e.id === bookform.value.site_id)?.type_id)?.amount
})

const bookSiteOptions = computed(() => {
  return quotes.value.available_sites.map((e) => {
    return {
      id: e.id,
      name: `${e.name} - $${quotes.value.prices.find(f => f.site_type_id === e.type_id)?.amount.toFixed(2)} ${e.is_closed ? '(Site Closed)' : ''}`,
    }
  })
})

function bookNow() {
  payErrorMessage.value = ''
  new CaravanBooking().payNow(bookform.value)
    .then((data) => {
      if (data.success) {
        // redirect
        window.location = data.redirect
      } else {
        payErrorMessage.value = data.message
      }
    })
}

function searchAvailability() {
  no_availability.value = false
  new CaravanPriceQuote().searchAvailability(quoteform.value)
    .then((data) => {
      quotes.value = data
      bookform.value.people = quoteform.value.people.map(e => new CaravanBookingPersonQty({
        person_type_id: e.type,
        qty: e.qty,
      }))
      bookform.value.check_in = quoteform.value.from_date
      bookform.value.check_out = quoteform.value.to_date
      bookform.value.caravan_length = quoteform.value.caravan_length
      if (quotes.value.available_sites.length == 0) {
        no_availability.value = true
      }
    })
}

onMounted(() => {
  new CaravanPersonType().find_many({})
    .then((data) => {
      personTypes.value = data.data
      personTypes.value.forEach((personType) => {
        quoteform.value.people.push({
          name: personType.name,
          type: personType.id,
          min_qty: personType.min_qty,
          qty: 0,
        })
      })
    })

  new CognitoPayment().checkSuccessful()
    .then((data) => {
      has_payment.value = data.has_payment
      payment_ok.value = data.success
      if (data.success) {
        new CognitoInvoice().getInvoice(data.payment.id)
          .then((data) => {
            invoiceText.value = data.invoiceText
          })
      }
    })
})
</script>
