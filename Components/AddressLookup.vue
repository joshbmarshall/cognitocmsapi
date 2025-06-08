<template>
  <div ref="searchInput" class="relative w-full">
    <div v-if="!valid_address" class="text-xs font-light text-red-500">
      Please include your street number!
    </div>
    <cgn-form-input v-model="searchTerm" :label="label" :placeholder="searchTermPlaceholder" :fake-required="props.required" />
    <div
      v-if="search.length > 0"
      class="absolute top-14 z-10 mt-4 max-h-96 w-full overflow-y-auto rounded-md shadow-lg"
    >
      <div class="grid auto-rows-[1fr] grid-cols-1">
        <div
          v-for="(location, index) in search"
          :key="index"
          class="cursor-pointer select-none p-3"
          :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'"
          @click="selectAddress(location)"
        >
          {{ location.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { CognitoAddressLookup } from '~cognito/models/Cognito/AddressLookup'

const props = defineProps({
  hereApiKey: {
    type: String,
    required: true,
  },
  modelValue: {
    type: CognitoAddressLookup,
    required: true,
  },
  label: {
    type: String,
  },
  latitude: {
    type: Number,
    default: -27,
  },
  longitude: {
    type: Number,
    default: 153,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'update:valid_address',
  'onChange',
])

const searchInput = ref()

const searchTerm = ref('')
const searchTermPlaceholder = ref('')
const address = ref('')
const search = ref([{ title: '', id: '' }])
const valid_address = ref(true)

const validateAddress = () => {
  if (isNaN(props.modelValue.line1.charAt(0))) {
    emit('update:valid_address', false)
    valid_address.value = false
    return
  }
  // If first character is a number
  emit('update:valid_address', true)
  valid_address.value = true
  emit('onChange')
}

const handleSubmitAddress = (id: string) => {
  new CognitoAddressLookup().lookup({
    id,
    apiKey: props.hereApiKey,
  })
    .then((result) => {
      const newaddress = props.modelValue
      newaddress.line1 = `${result.data.address.houseNumber} ${result.data.address.street}`
      newaddress.city = result.data.address.district
      newaddress.postcode = result.data.address.postalCode
      newaddress.state = result.data.address.state
      newaddress.country = result.data.address.countryName
      newaddress.latitude = result.data.position?.lat
      newaddress.longitude = result.data.position?.lng
      emit('update:modelValue', newaddress)
    })
}
const setPlaceholder = () => {
  if (!props.modelValue) {
    return
  }
  if (!props.modelValue.line1) {
    return
  }
  searchTermPlaceholder.value = `${props.modelValue.line1} ${props.modelValue.line2} ${props.modelValue.city} ${props.modelValue.state} ${props.modelValue.postcode} ${props.modelValue.country}`
}
watch(() => props.modelValue, () => {
  validateAddress()
  setPlaceholder()
})
watchDebounced(() => searchTerm.value, (newVal) => {
  if (newVal.length < 5) {
    search.value = []
    return
  }
  new CognitoAddressLookup().search({
    latitude: props.latitude,
    longitude: props.longitude,
    q: newVal,
    apiKey: props.hereApiKey,
  })

    .then((result) => {
      if (!result.data) {
        search.value = []
        return
      }
      if (!result.data.items) {
        search.value = []
        return
      }
      if (!result.data.items.length) {
        search.value = []
        return
      }
      search.value = result.data.items
      searchInput.value?.scrollIntoView({ behavior: 'smooth' })
    })
}, {
  debounce: 1000,
  maxWait: 5000,
})

const selectAddress = (location: {
  id: string
  title: string
}) => {
  address.value = location.id
  searchTerm.value = ''
  searchTermPlaceholder.value = location.title
  handleSubmitAddress(location.id)
}

onMounted(() => {
  search.value = []
  if (!props.modelValue) {
    emit('update:modelValue', {
      city: '',
      country: '',
      line1: '',
      line2: '',
      postcode: '',
      state: '',
    })
  } else {
    setPlaceholder()
  }
})
</script>
