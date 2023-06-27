<template>
  <div class="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
    <div class="flex flex-row justify-between items-center p-3 bg-gray-100 dark:bg-darkbg-700">
      <span class="text-xl">Addresses</span>
      <div title="Add address" @click="addAddress()">
        <i-heroicons-solid:plus
          class="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
        />
      </div>
    </div>
    <div
      v-if="showAdditionalAddress"
      class="flex flex-row justify-between p-3 bg-gray-100 dark:bg-darkbg-700 border-t-2 border-gray-400 dark:border-gray-900"
    >
      <form class="w-full" @submit.prevent="selectAddress">
        <div class="flex flex-col justify-start items-start w-full space-y-2">
          <div class="flex flex-row justify-between w-full items-center">
            <span class="text-lg font-medium">Add address</span>
            <i-heroicons-solid:x
              class="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
              @click="showAdditionalAddress = false"
            />
          </div>
          <div class="flex flex-row w-full gap-2">
            <cgn-form-input-text v-model="new_address.first_name" label="First Name" class="w-1/2" required />
            <cgn-form-input-text v-model="new_address.last_name" label="Last Name" class="w-1/2" required />
          </div>
          <cgn-address-lookup
            v-model="new_address"
            here-api-key="GOBLSSIkkrgjhMahFmXPramj-95rVXZYpj-0pj7DsFU"
            label="Search address"
          />
          <div class="space-y-2 w-full">
            <div class="flex flex-col sm:flex-row w-full gap-2">
              <cgn-form-input-text
                v-model="new_address.line1"
                label="Address"
                class="w-full sm:w-1/2"
                required
              />
              <cgn-form-input-text
                v-model="new_address.line2"
                label="Address (line 2)"
                class="w-full sm:w-1/2"
              />
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 w-full gap-2">
              <cgn-form-input-text v-model="new_address.city" label="Suburb" class="w-full" required />
              <cgn-form-input-text v-model="new_address.state" label="State" class="w-full" required />
              <cgn-form-input-text v-model="new_address.postcode" label="Postcode" class="w-full" required />
              <cgn-form-input-text
                v-model="new_address.country"
                label="Country"
                class="w-full sm:col-span-3"
                required
              />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row w-full gap-2">
            <cgn-form-input-email v-model="new_address.email" label="Email" class="w-full sm:w-1/2" required />
            <cgn-form-input-phone v-model="new_address.phone" label="Phone" class="w-full sm:w-1/2" required />
          </div>
        </div>
        <cgn-button
          color-brand
          fullwidth
          extra-classes="w-full mt-2 flex flex-row items-center justify-center"
          submit
        >
          <cgn-spinner v-if="savingAddressSpinner" class="pr-2" />
          <span>Add address</span>
        </cgn-button>
      </form>
    </div>
    <div>
      <div
        v-for="(address, index) in cartStore.addresses"
        :key="index"
        class="divide-y-2"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800 divide-gray-400 dark:divide-gray-900' : 'bg-white dark:bg-gray-900 divide-gray-300 dark:divide-gray-800'"
      >
        <div class="flex flex-row justify-between p-3">
          <div>
            <span class="text-sm">{{ address.display_name }}</span>
          </div>
          <div title="Delete address">
            <i-heroicons-solid:trash
              class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
              @click="deleteAddress(address)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SellAddress } from '~cognito/models/Sell/Address'

const userStore = useUserStore()
const cartStore = useCartStore()

const new_address = ref({
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

const showAdditionalAddress = ref(false)

function addAddress() {
  if (showAdditionalAddress.value === true) {
    return
  }
  new_address.value = {
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
  }
  showAdditionalAddress.value = true
}

async function selectAddress() {
  savingAddressSpinner.value = true
  await cartStore.saveNewAddress(
    new_address.value.first_name,
    new_address.value.last_name,
    new_address.value.email,
    new_address.value.phone,
    new_address.value.company,
    new_address.value.line1,
    new_address.value.line2,
    new_address.value.postcode,
    new_address.value.city,
    new_address.value.state,
    new_address.value.country,
  )
  savingAddressSpinner.value = false
  showAdditionalAddress.value = false
}

function deleteAddress(address: Object) {
  new SellAddress(address).disable().then((data) => {
    if (!data.success) {
      // eslint-disable-next-line no-alert
      alert(data.message)
    }
    cartStore.getAddresses()
  })
}
onMounted(() => {
  cartStore.getCart()
  cartStore.getAddresses()
})
</script>
