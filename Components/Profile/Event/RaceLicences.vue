<template>
  <div class="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900">
    <div class="flex flex-row items-center justify-between bg-gray-100 p-3 dark:bg-darkbg-700">
      <span class="text-xl">Race Licences</span>
      <div title="Add licence" @click="addLicence()">
        <i-heroicons-solid:plus
          class="cursor-pointer text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        />
      </div>
    </div>
    <cgn-event-race-licence-edit v-if="showLicenceAdd" v-model="edit_licence_id" v-model:licences="licences" :require-registration="false" @close="showLicenceAdd = false" />
    <div>
      <div
        v-for="(licence, index) in licences"
        :key="index"
        class="divide-y-2"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800 divide-gray-400 dark:divide-gray-900' : 'bg-white dark:bg-gray-900 divide-gray-300 dark:divide-gray-800'"
      >
        <div class="flex flex-row justify-between p-3">
          <div class="grid grid-cols-3 gap-3 text-sm">
            <div>
              {{ licence.issuer.name }}
            </div>
            <div>
              {{ licence.number }}
            </div>
            <div class="text-right">
              {{ licence.expiry }}
            </div>
          </div>

          <div>
            <span title="Delete licence">
              <i-heroicons-solid:trash
                class="inline cursor-pointer text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                @click="deleteLicence(licence)"
              />
            </span>
            <span title="Edit licence">
              <i-heroicons-solid:pencil
                class="inline cursor-pointer text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                @click="editLicence(licence)"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEntrantLicence } from '~cognito/models/Event/EntrantLicence'

const licenceDropdown = ref([])

const licences = ref<EventEntrantLicence[]>([])

const showLicenceAdd = ref(false)
const edit_licence_id = ref(0)

const loadLicences = async () => {
  const data = await new EventEntrantLicence().find_many({
    entrant_id: useUserStore().user.id,
  })
  licences.value = data.mapped
  licenceDropdown.value = licences.value.map((e) => {
    return {
      id: e.id,
      name: `${e.make} ${e.model}`,
    }
  })
}

function addLicence() {
  edit_licence_id.value = 0
  showLicenceAdd.value = true
}

const editLicence = (licence: Object) => {
  edit_licence_id.value = licence.id
  showLicenceAdd.value = true
}

const deleteLicence = (licence: Object) => {
  new EventEntrantLicence(licence).disable().then((data) => {
    if (!data.success) {
      // eslint-disable-next-line no-alert
      alert(data.message)
    }
    loadLicences()
  })
}

onMounted(() => {
  loadLicences()
})
</script>
