<template>
  <cgn-form-dropdown
    v-model="selectedAddress"
    :label="props.label"
    prompt="New Address"
    :options="addressDropdown"
    class="w-full"
    required
  />
  <form class="w-full" @submit.prevent="saveAddress">
    <div v-if="!modelValue">
      <div class="mt-2 flex w-full flex-col items-start justify-start rounded-lg border bg-gray-50">
        <cgn-address-lookup
          v-model="hereApiAddress"
          :here-api-key="props.hereApiKey"
          label="Search address"
          class="px-2"
        />
        <div class="w-full border-y bg-gray-100 px-2">
          <cgn-form-input-text v-model="newAddress.street_address" label="Address" class="w-full" required />
          <cgn-form-input-text v-model="newAddress.unit" label="Unit" class="w-full" />
          <div class="grid w-full grid-cols-2 gap-x-2 sm:grid-cols-3">
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
        <div class="w-full p-2">
          <cgn-button
            color-brand
            fullwidth
            submit
          >
            <span>Use this address</span>
          </cgn-button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { CognitoAddress } from '~cognito/models/Cognito/Address'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: 'Address',
  },
  hereApiKey: {
    type: String,
    required: true,
  },
  addresses: {
    type: Array<CognitoAddress>,
    default: [],
  },
})

const emit = defineEmits(['update:modelValue', 'update:addresses'])

const hereApiAddress = ref()
const addressDropdown = ref([])

const newAddress = ref<CognitoAddress>(new CognitoAddress())

const selectedAddress = ref()

const loadAddresses = async () => {
  const data = await new CognitoAddress().find_many({
    user_id: useUserStore().user.id,
  })
  emit('update:addresses', data.mapped)
}

const saveAddress = async () => {
  newAddress.value.user_id = useUserStore().user.id
  const data = await newAddress.value.save()
  await loadAddresses()
  selectedAddress.value = data.item.id
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

watch(() => props.modelValue, (newval) => {
  selectedAddress.value = newval
})

watch(() => props.addresses, (newval) => {
  addressDropdown.value = newval.map((e) => {
    return {
      id: e.id,
      name: `${e.street_address} ${e.suburb_name} ${e.state}`,
    }
  })
})

watch(() => selectedAddress.value, (newval) => {
  emit('update:modelValue', newval)
})

onMounted(() => {
  selectedAddress.value = props.modelValue || ''
  loadAddresses()
})
</script>
