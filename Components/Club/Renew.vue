<template>
  <div v-if="payment_ok">
    <cgn-alert-success class="mx-auto my-2 w-full max-w-2xl">
      Payment Successful
    </cgn-alert-success>
    <invoice :payment="payment.id" />
  </div>
  <div v-else class="flex flex-col">
    <span class="w-full pt-2 text-center text-2xl">Choose membership type</span>
    <div v-for="membership_type in membership_types" :key="membership_type.id">
      <cgn-button color-brand fullwidth @click="renew(membership_type)">
        {{ membership_type.name }}
        ${{ membership_type.price }}
      </cgn-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClubMembershipType } from '~cognito/models/Club/MembershipType'
import { $axios } from '~cognito/plugins/axios'

const payment_ok = ref(false)
const payment = ref()
const membership_types = ref<ClubMembershipType[]>([])

const renew = (type_to_renew: ClubMembershipType) => {
  new ClubMembershipType(type_to_renew).renew()
}

onMounted(() => {
  new ClubMembershipType().getCanPurchase()
    .then((data) => {
      membership_types.value = data
    })
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
