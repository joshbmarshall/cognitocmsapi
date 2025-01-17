<template>
  <div v-if="payment_ok">
    <cgn-alert-success class="mx-auto my-2 w-full max-w-2xl">
      Payment Successful.
      Please check your email for your receipt
    </cgn-alert-success>
  </div>
  <div v-else class="flex flex-col">
    <span class="w-full pt-2 text-center text-2xl">Choose membership type</span>
    <form @submit.prevent="renew">
      <cgn-form-input-phone v-if="showPhone" v-model="membershipForm.phone" label="Mobile Phone" required />
      <cgn-address-lookup
        v-if="showAddress"
        v-model="membershipForm.address"
        here-api-key="GOBLSSIkkrgjhMahFmXPramj-95rVXZYpj-0pj7DsFU"
        label="Address"
        required
      />
      <cgn-form-radio-button v-model="membershipForm.membership_type" :options="membershipTypesRadio" required />
      <div v-if="membershipForm.extras.length">
        <div class="w-full pt-2 text-center text-2xl">
          Extras
        </div>
        <div v-for="extra in membershipForm.extras" :key="extra.id">
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
      <div v-if="showAddToNewsletter">
        <cgn-form-checkbox v-model="membershipForm.add_to_newsletter" label="Please add me to your email newsletter" />
      </div>
      <div v-if="membershipForm.membership_type" class="my-2">
        <div v-if="terms">
          <div class="prose-dark" v-html="terms" />
          <cgn-form-checkbox required label="I accept these terms" />
        </div>
        <cgn-button v-if="totalPrice > 0 || isFreeMembership">
          Pay ${{ totalPrice.toFixed(2) }} Now
        </cgn-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { gql } from 'graphql-request'
import { ClubMembershipType } from '~cognito/models/Club/MembershipType'
import { CognitoAddressLookup } from '~cognito/models/Cognito/AddressLookup'
import { CognitoUser } from '~cognito/models/Cognito/User'
import { $axios } from '~cognito/plugins/axios'

const payment_ok = ref(false)
const payment = ref()
const membership_types = ref<ClubMembershipType[]>([])
const terms = ref('')
const showPhone = ref(false)
const showAddress = ref(false)
const showAddToNewsletter = ref(false)
const membershipForm = ref({
  phone: '',
  address: new CognitoAddressLookup(),
  membership_type: 0,
  extras: [],
  add_to_newsletter: 1,
})

const selected_membership_type = computed(() => {
  return membership_types.value.find(e => e.id == membershipForm.value.membership_type)
})

const totalPrice = computed(() => {
  let total = 0
  if (selected_membership_type.value) {
    total = Number.parseFloat(selected_membership_type.value.price)
  }
  membershipForm.value.extras.forEach((e) => {
    if (!e.qty) {
      e.qty = 0
    }
    total += e.qty * e.cost
  })
  return total
})
const isFreeMembership = computed(() => {
  if (!selected_membership_type.value) {
    return false
  }
  return Number.parseFloat(selected_membership_type.value.price) == 0
})

const membershipTypesRadio = computed(() => {
  return membership_types.value.map((e) => {
    return {
      id: e.id,
      name: `${e.name} $${e.price.toFixed(2)}`,
      content: e.subtitle,
      disabled: false,
    }
  })
})

const renew = () => {
  new ClubMembershipType(selected_membership_type.value).renew(membershipForm.value)
}

onMounted(async () => {
  const gqldata = await $axios.graphql(gql`query clubMembershipRenewInfo {
    clubMembershipTypes(isCanPurchase: true) {
      id
      name
      subtitle
      price
    }
    clubMisc {
      membership_terms {
        content
      }
      show_add_to_newsletter
    }
    clubExtras {
      id
      name
      content
      cost
      max_qty
    }
  }`)

  membership_types.value = gqldata.clubMembershipTypes
  membershipForm.value.extras = gqldata.clubExtras
  terms.value = gqldata.clubMisc.membership_terms?.content
  showAddToNewsletter.value = gqldata.clubMisc.show_add_to_newsletter

  const user = await (new CognitoUser()).getLoggedInUser()
  showPhone.value = !user.mobile_phone
  showAddress.value = !user.current_address_id

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
