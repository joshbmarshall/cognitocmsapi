<template>
  <div class="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
    <div class="flex flex-row justify-between items-center p-3 bg-gray-100 dark:bg-darkbg-700">
      <span class="text-xl">Vehicles</span>
      <div title="Add vehicle" @click="addVehicle()">
        <i-heroicons-solid:plus
          class="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
        />
      </div>
    </div>
    <div
      v-if="showVehicleAdd"
      class="flex flex-row justify-between p-3 bg-gray-100 dark:bg-darkbg-700 border-t-2 border-gray-400 dark:border-gray-900"
    >
      <form class="w-full" @submit.prevent="saveVehicle">
        <div class="flex flex-row justify-between w-full items-center">
          <span class="text-lg font-medium">Add vehicle</span>
          <i-heroicons-solid:x
            class="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            @click="showVehicleAdd = false"
          />
        </div>
        <div class="mt-2 flex flex-col justify-start items-start w-full bg-gray-50 rounded-lg">
          <div class="w-full px-2 bg-gray-100 rounded-lg">
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
          <cgn-button
            color-brand
            fullwidth
            extra-classes="w-full mt-2 flex flex-row items-center justify-center"
            submit
          >
            <cgn-spinner v-if="savingSpinner" class="pr-2" />
            <span>Add vehicle</span>
          </cgn-button>
        </div>
      </form>
    </div>
    <div>
      <div
        v-for="(vehicle, index) in vehicles"
        :key="index"
        class="divide-y-2"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800 divide-gray-400 dark:divide-gray-900' : 'bg-white dark:bg-gray-900 divide-gray-300 dark:divide-gray-800'"
      >
        <div class="flex flex-row justify-between p-3">
          <div>
            <span class="text-sm">
              {{ vehicle.make }}
              {{ vehicle.model }}
              {{ vehicle.colour }}
            </span>
          </div>

          <div title="Delete vehicle">
            <i-heroicons-solid:trash
              class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
              @click="deleteVehicle(vehicle)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventVehicleEngineType } from '~cognito/models/Event/VehicleEngineType.js'
import { EventVehicleInductionType } from '~cognito/models/Event/VehicleInductionType'
import { EventVehicle } from '~cognito/models/Event/Vehicle'
import { EventVehicleBodyStyle } from '~cognito/models/Event/VehicleBodyStyle'
import { CognitoState } from '~cognito/models/Cognito/State'

const vehicleDropdown = ref([])

const vehicles = ref<EventVehicle[]>([])
const inductionTypes = ref<EventVehicleInductionType[]>([])
const engineTypes = ref<EventVehicleEngineType[]>([])
const bodyStyles = ref<EventVehicleBodyStyle[]>([])
const states = ref<CognitoState[]>([])

const newVehicle = ref<EventVehicle>(new EventVehicle())
const showVehicleAdd = ref(false)
const savingSpinner = ref(false)

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

const loadVehicles = async () => {
  const data = await new EventVehicle().find_many({
    entrant_id: useUserStore().user.id,
  })
  vehicles.value = data.mapped
  vehicleDropdown.value = vehicles.value.map((e) => {
    return {
      id: e.id,
      name: `${e.make} ${e.model}`,
    }
  })
  await loadInductionTypes()
  await loadEngineTypes()
  await loadBodyStyles()
  await loadStates()
}

function addVehicle() {
  showVehicleAdd.value = true
}

const saveVehicle = async () => {
  await newVehicle.value.save()
  await loadVehicles()
  showVehicleAdd.value = false
}

const deleteVehicle = (vehicle: Object) => {
  new EventVehicle(vehicle).disable().then((data) => {
    if (!data.success) {
      // eslint-disable-next-line no-alert
      alert(data.message)
    }
    loadVehicles()
  })
}

onMounted(() => {
  loadVehicles()
})
</script>
