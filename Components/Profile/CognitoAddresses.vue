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
      <form class="w-full" @submit.prevent="saveAddress">
        <div v-if="!modelValue">
          <div class="mt-2 flex flex-col justify-start items-start w-full bg-gray-50 rounded-lg">
            <cgn-address-lookup
              v-model="hereApiAddress"
              here-api-key="GOBLSSIkkrgjhMahFmXPramj-95rVXZYpj-0pj7DsFU"
              label="Search address"
            />
            <div class="w-full px-2 bg-gray-100 rounded-lg">
              <cgn-form-input-text v-model="newAddress.street_address" label="Address" class="w-full" required />
              <cgn-form-input-text v-model="newAddress.unit" label="Unit" class="w-full" />
              <div class="grid grid-cols-2 sm:grid-cols-3 w-full gap-x-2">
                <cgn-form-input-text v-model="newAddress.suburb_name" label="Suburb" class="w-full" required />
                <cgn-form-input-text v-model="newAddress.state" label="State" class="w-full" required />
                <cgn-form-input-text v-model="newAddress.postcode" label="Postcode" class="w-full" required />
                <cgn-form-input-text
                  v-model="newAddress.country"
                  label="Country"
                  class="w-full sm:col-span-3"
                  required
                />
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
          </div>
        </div>
      </form>
    </div>
    <div>
      <div
        v-for="(address, index) in addresses"
        :key="index"
        class="divide-y-2"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800 divide-gray-400 dark:divide-gray-900' : 'bg-white dark:bg-gray-900 divide-gray-300 dark:divide-gray-800'"
      >
        <div class="flex flex-row justify-between p-3">
          <div>
            <span class="text-sm">
              {{ address.street_address }}
              {{ address.suburb_name }}
              {{ address.state }}
            </span>
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
import { CognitoAddress } from '~cognito/models/Cognito/Address'

const hereApiAddress = ref()
const addresses = ref<CognitoAddress[]>([])

const newAddress = ref<CognitoAddress>(new CognitoAddress())
const savingAddressSpinner = ref(false)

const showAdditionalAddress = ref(false)

function addAddress() {
  if (showAdditionalAddress.value === true) {
    return
  }
  showAdditionalAddress.value = true
}

watch(() => hereApiAddress.value, (newval) => {
  if (!newval) {
    return
  }
  newAddress.value = new CognitoAddress({
    street_address: newval.line1,
    unit: newval.line2,
    suburb_name: newval.city,
    state: newval.state,
    postcode: newval.postcode,
    country: newval.country,
  })
}, { deep: true })

const getAddresses = () => {
  new CognitoAddress().find_many({
    user_id: useUserStore().user.id,
  }).then((data) => {
    addresses.value = data.data
  })
}

const saveAddress = async () => {
  savingAddressSpinner.value = true
  newAddress.value.user_id = useUserStore().user.id
  await newAddress.value.save()
  getAddresses()
  savingAddressSpinner.value = false
  showAdditionalAddress.value = false
}

const deleteAddress = (address: Object) => {
  new CognitoAddress(address).disable().then((data) => {
    if (!data.success) {
      // eslint-disable-next-line no-alert
      alert(data.message)
    }
    getAddresses()
  })
}

onMounted(() => {
  getAddresses()
})
</script>
