<template>
  <div class="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900">
    <div class="flex flex-row items-center justify-between bg-gray-100 p-3 dark:bg-darkbg-700">
      <span class="text-xl">Vehicles</span>
      <div title="Add vehicle" @click="addVehicle()">
        <i-heroicons-solid:plus
          class="cursor-pointer text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        />
      </div>
    </div>
    <cgn-vehicle-edit v-if="showVehicleAdd" v-model="edit_vehicle_id" v-model:vehicles="vehicles" :require-registration="false" @close="showVehicleAdd = false" />
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
              {{ vehicle.registration }}
            </span>
          </div>

          <div>
            <span title="Delete vehicle">
              <i-heroicons-solid:trash
                class="inline cursor-pointer text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                @click="deleteVehicle(vehicle)"
              />
            </span>
            <span title="Edit vehicle">
              <i-heroicons-solid:pencil
                class="inline cursor-pointer text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                @click="editVehicle(vehicle)"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventVehicle } from '~cognito/models/Event/Vehicle'

const vehicleDropdown = ref([])

const vehicles = ref<EventVehicle[]>([])

const showVehicleAdd = ref(false)
const edit_vehicle_id = ref(0)

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
}

function addVehicle() {
  edit_vehicle_id.value = 0
  showVehicleAdd.value = true
}

const editVehicle = (vehicle: Object) => {
  edit_vehicle_id.value = vehicle.id
  showVehicleAdd.value = true
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
