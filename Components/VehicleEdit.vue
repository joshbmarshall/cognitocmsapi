<template>
  <form ref="vehicleedit" class="w-full" @submit.prevent="saveVehicle">
    <div class="mt-2 flex w-full flex-col items-start justify-start overflow-hidden rounded-lg border bg-gray-50">
      <div class="w-full border-b bg-gray-100 px-2">
        <div class="mt-2 flex justify-end">
          <i-heroicons-solid:x class="cursor-pointer" @click="emit('close')" />
        </div>
        <div class="grid grid-cols-2 gap-x-2 sm:grid-cols-3">
          <cgn-form-input-text v-model="newVehicle.make" label="Make" class="w-full" required />
          <cgn-form-input-text v-model="newVehicle.model" label="Model" class="w-full" required />
          <cgn-form-input-text v-model="newVehicle.colour" label="Colour" class="col-span-2 w-full sm:col-span-1" required />
        </div>
        <div class="grid grid-cols-2 gap-x-2">
          <cgn-form-dropdown v-model="newVehicle.induction_type_id" :options="inductionTypes" label="Induction type" required />
          <cgn-form-dropdown v-model="newVehicle.engine_type_id" :options="engineTypes" label="Engine type" required />
        </div>
        <cgn-form-dropdown v-if="!props.requireRegistration" v-model="isRegistered" :options="['Yes', 'No']" label="Is this vehicle registered?" required />
        <div v-if="isRegistered == 'Yes' || props.requireRegistration" class="grid grid-cols-2 gap-x-2 sm:grid-cols-3">
          <cgn-form-input-text v-model="newVehicle.registration" label="Registration" class="w-full" required />
          <cgn-form-dropdown v-model="newVehicle.registration_state_id" :options="states" label="Registration State" required />
          <cgn-form-input v-model="newVehicle.registration_expiry" type="date" label="Registration Expiry" class="col-span-2 w-full sm:col-span-1" required />
        </div>
        <cgn-form-dropdown v-model="newVehicle.body_style_id" :options="bodyStyles" label="Body Style" required />
        <cgn-form-input v-model="newVehicle.year_of_manufacture" type="number" label="Year of manufacture" class="w-full" required />
        <div class="grid grid-cols-2 gap-x-2">
          <cgn-form-input-text v-model="newVehicle.vehicle_owner" label="Vehicle Owner" class="w-full" required />
          <cgn-form-input-phone v-model="newVehicle.owner_mobile" label="Owner mobile" class="w-full" required />
        </div>
        <cgn-form-image v-model="newVehiclePhoto" label="Photo" :required="props.requirePhoto" :thumbnail="newVehicle.photo?.url" />
      </div>
      <div class="w-full p-2">
        <cgn-button
          color-brand
          fullwidth
          submit
        >
          <span>Save vehicle</span>
        </cgn-button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { EventVehicleEngineType } from '~cognito/models/Event/VehicleEngineType.js'
import { EventVehicleInductionType } from '~cognito/models/Event/VehicleInductionType'
import { EventVehicle } from '~cognito/models/Event/Vehicle'
import { EventVehicleBodyStyle } from '~cognito/models/Event/VehicleBodyStyle'
import { CognitoState } from '~cognito/models/Cognito/State'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  vehicles: {
    type: Array<EventVehicle>,
    default: [],
  },
  noScroll: {
    type: Boolean,
    default: false,
  },
  requirePhoto: {
    type: Boolean,
    default: false,
  },
  requireRegistration: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'update:vehicles', 'close'])

const vehicleedit = ref()
const vehicleDropdown = ref([])

const inductionTypes = ref<EventVehicleInductionType[]>([])
const engineTypes = ref<EventVehicleEngineType[]>([])
const bodyStyles = ref<EventVehicleBodyStyle[]>([])
const states = ref<CognitoState[]>([])

const newVehicle = ref<EventVehicle>(new EventVehicle())
const selectedVehicle = ref(0)
const newVehiclePhoto = ref('')
const isRegistered = ref('')

const loadInductionTypes = async () => {
  const data = await new EventVehicleInductionType().find_many({})
  inductionTypes.value = data.mapped
}

const loadEngineTypes = async () => {
  const data = await new EventVehicleEngineType().find_many({})
  engineTypes.value = data.mapped
}

const loadBodyStyles = async () => {
  const data = await new EventVehicleBodyStyle().find_many({})
  bodyStyles.value = data.mapped
}

const loadStates = async () => {
  const data = await new CognitoState().find_many({})
  states.value = data.mapped
}

const selectVehicle = () => {
  const id = props.modelValue
  selectedVehicle.value = id
  newVehicle.value = new EventVehicle(props.vehicles.find(e => id == e.id))
  newVehiclePhoto.value = newVehicle.value?.photo?.url ? 'x' : ''
}

const loadVehicles = async () => {
  const data = await new EventVehicle().find_many({
    entrant_id: useUserStore().user.id,
  })
  emit('update:vehicles', data.mapped)
  await loadInductionTypes()
  await loadEngineTypes()
  await loadBodyStyles()
  await loadStates()
  selectVehicle()
}

const saveVehicle = async () => {
  newVehicle.value.photo = newVehiclePhoto.value
  const data = await newVehicle.value.save()
  await loadVehicles()
  selectedVehicle.value = data.item.id
  useToastStore().addToast('Vehicle Saved', 'success', 2500)
  emit('close')
}

watch(() => props.modelValue, () => {
  selectVehicle()
})

watch(() => props.vehicles, (newval) => {
  vehicleDropdown.value = newval.map((e) => {
    return {
      id: e.id,
      name: `${e.make} ${e.model} ${e.colour} ${e.registration}`,
    }
  })
})

watch(() => selectedVehicle.value, (newval) => {
  emit('update:modelValue', newval)
})

onMounted(() => {
  loadVehicles()
  selectedVehicle.value = props.modelValue || ''
  if (!props.noScroll) {
    vehicleedit.value.scrollIntoView({
      behavior: 'smooth',
    })
  }
})
</script>
