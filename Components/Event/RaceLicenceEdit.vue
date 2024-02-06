<template>
  <form ref="licenceedit" class="w-full" @submit.prevent="saveLicence">
    <div class="mt-2 flex w-full flex-col items-start justify-start overflow-hidden rounded-lg border bg-gray-50">
      <div class="w-full border-b bg-gray-100 px-2">
        <div class="mt-2 flex justify-end">
          <i-heroicons-solid:x class="cursor-pointer" @click="emit('close')" />
        </div>
        <cgn-form-dropdown v-model="newLicence.issuer_id" :options="issuers" label="Licence Type" required />
        <cgn-form-input-text v-model="newLicence.number" label="Licence Number" class="w-full" required />
        <cgn-form-input v-model="newLicence.expiry" type="date" label="Expiry" class="w-full" required />
      </div>
      <div class="w-full p-2">
        <cgn-button
          color-brand
          fullwidth
          submit
        >
          <span>Save Licence</span>
        </cgn-button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { EventEntrantLicence } from '~cognito/models/Event/EntrantLicence'
import { EventLicenceIssuer } from '~cognito/models/Event/LicenceIssuer'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  licences: {
    type: Array<EventEntrantLicence>,
    default: [],
  },
})
const emit = defineEmits(['update:modelValue', 'update:licences', 'close'])

const licenceedit = ref()
const selected_licence_id = ref(0)
const issuers = ref<EventLicenceIssuer[]>([])

const newLicence = ref<EventEntrantLicence>(new EventEntrantLicence())

const selectLicence = () => {
  const id = props.modelValue
  selected_licence_id.value = id
  newLicence.value = new EventEntrantLicence(props.licences.find(e => id == e.id))
}

const loadIssuers = async () => {
  const data = await new EventLicenceIssuer().find_many({})
  issuers.value = data.mapped
}

const loadLicences = async () => {
  const data = await new EventEntrantLicence().find_many({
    entrant_id: useUserStore().user.id,
  })
  emit('update:licences', data.mapped)
  await loadIssuers()
  selectLicence()
}

const saveLicence = async () => {
  const data = await newLicence.value.save()
  await loadLicences()
  selected_licence_id.value = data.item.id
  useToastStore().addToast('Licence Saved', 'success', 2500)
  emit('close')
}

onMounted(() => {
  loadLicences()
  selected_licence_id.value = props.modelValue || ''
})
</script>
