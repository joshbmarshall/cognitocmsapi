<template>
  <form ref="vehicleedit" class="w-full" @submit.prevent="saveVehicle">
    <div class="mt-2 flex flex-col justify-start items-start w-full bg-gray-50 border rounded-lg overflow-hidden">
      <div class="w-full px-2 border-b bg-gray-100">
        <div class="flex justify-end mt-2">
          <i-heroicons-solid:x class="cursor-pointer" @click="emit('close')" />
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-2">
          <cgn-form-input-text v-model="newVehicle.make" label="Make" class="w-full" required />
          <cgn-form-input-text v-model="newVehicle.model" label="Model" class="w-full" required />
          <cgn-form-input-text v-model="newVehicle.colour" label="Colour" class="w-full col-span-2 sm:col-span-1" required />
        </div>
        <div class="grid grid-cols-2 gap-x-2">
          <cgn-form-dropdown v-model="newVehicle.induction_type_id" :options="inductionTypes" label="Induction type" required />
          <cgn-form-dropdown v-model="newVehicle.engine_type_id" :options="engineTypes" label="Engine type" required />
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-2">
          <cgn-form-input-text v-model="newVehicle.registration" label="Registration" class="w-full" required />
          <cgn-form-dropdown v-model="newVehicle.registration_state_id" :options="states" label="Registration State" required />
          <cgn-form-input v-model="newVehicle.registration_expiry" type="date" label="Registration Expiry" class="w-full col-span-2 sm:col-span-1" required />
        </div>
        <cgn-form-dropdown v-model="newVehicle.body_style_id" :options="bodyStyles" label="Body Style" required />
        <cgn-form-input v-model="newVehicle.year_of_manufacture" type="number" label="Year of manufacture" class="w-full" required />
        <div class="grid grid-cols-2 gap-x-2">
          <cgn-form-input-text v-model="newVehicle.vehicle_owner" label="Vehicle Owner" class="w-full" required />
          <cgn-form-input-phone v-model="newVehicle.owner_mobile" label="Owner mobile" class="w-full" required />
        </div>
      </div>
      <div class="p-2 w-full">
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
})

const emit = defineEmits(['update:modelValue', 'update:vehicles', 'close'])

const vehicleedit = ref()
const vehicleDropdown = ref([])

const inductionTypes = ref<EventVehicleInductionType[]>([])
const engineTypes = ref<EventVehicleEngineType[]>([])
const bodyStyles = ref<EventVehicleBodyStyle[]>([])
const states = ref<CognitoState[]>([])

const newVehicle = ref<EventVehicle>(new EventVehicle())
const selectedVehicle = ref()

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
