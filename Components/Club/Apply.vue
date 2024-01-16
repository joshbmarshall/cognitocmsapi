<template>
  <div v-if="payment_ok">
    <cgn-alert-success class="mx-auto my-2 w-full max-w-2xl">
      Payment Successful.
      Please check your email for your receipt
    </cgn-alert-success>
  </div>
  <div v-else class="flex flex-col">
    <span class="w-full pt-2 text-center text-2xl">Apply to become a Member</span>
    <form @submit.prevent="apply">
      <cgn-form-input-phone v-model="applicationForm.phone" label="Mobile Phone" required />
      <cgn-address-lookup
        v-model="applicationForm.address"
        here-api-key="GOBLSSIkkrgjhMahFmXPramj-95rVXZYpj-0pj7DsFU"
        label="Address"
        required
      />
      <div class="my-2">
        <div v-if="terms">
          <div class="prose-dark" v-html="terms" />
          <cgn-form-checkbox required label="I accept these terms" />
        </div>
        <cgn-button>
          Pay ${{ fee.toFixed(2) }} Now
        </cgn-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { gql } from 'graphql-request'
import { ClubMembershipType } from '~cognito/models/Club/MembershipType'
import { CognitoAddressLookup } from '~cognito/models/Cognito/AddressLookup'
import { $axios } from '~cognito/plugins/axios'

const payment_ok = ref(false)
const payment = ref()
const terms = ref('')
const applicationForm = ref({
  phone: '',
  address: new CognitoAddressLookup(),
})

const fee = ref(0)

const apply = () => {
  new ClubMembershipType().apply(applicationForm.value)
}

onMounted(async () => {
  const gqldata = await $axios.graphql(gql`query clubMembershipRenewInfo {
    clubMisc {
      application_terms {
        content
      }
      application_fee
    }
  }`)

  terms.value = gqldata.clubMisc.application_terms?.content
  fee.value = gqldata.clubMisc.application_fee

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
