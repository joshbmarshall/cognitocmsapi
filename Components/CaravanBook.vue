<template>
  <div>
    <form @submit.prevent="searchAvailability()">
      <div>
        Check In
        <cgn-form-input v-model="form.from_date" type="date" required />
      </div>
      <div>
        Check Out
        <cgn-form-input v-model="form.to_date" type="date" required />
      </div>
      <div v-for="personType in form.people" :key="personType.type">
        <cgn-form-dropdown
          v-model="personType.qty"
          :label="personType.name"
          :options="[
            {
              label: 0,
              value: 0,
            },
            {
              label: 1,
              value: 1,
            },
            {
              label: 2,
              value: 2,
            },
            {
              label: 3,
              value: 3,
            },
            {
              label: 4,
              value: 4,
            },
            {
              label: 5,
              value: 5,
            },
          ]"
        />
      </div>
      <cgn-form-input v-model="form.caravan_length" type="number" min-amount="1" max-amount="20" label="Caravan length (metres)" />
      <cgn-button color-brand>
        Search
      </cgn-button>
    </form>
    <pre class="text-xs">{{ quotes }}</pre>
  </div>
</template>

<script setup lang="ts">
import { CaravanPriceQuote } from '~cognito/models/Caravan/PriceQuote'
import { CaravanPersonType } from '~cognito/models/Caravan/PersonType'

const personTypes = ref<CaravanPersonType[]>([])

const form = ref({
  from_date: '',
  to_date: '',
  people: <{
    name: string,
    type: number,
    qty: number
  }[]>[],
  caravan_length: 0,
})

const quotes = ref<CaravanPriceQuote>(new CaravanPriceQuote())

const searchAvailability = () => {
  new CaravanPriceQuote().searchAvailability(form.value)
  .then((data)=>{
    quotes.value = data
  })
}

onMounted(() => {
  new CaravanPersonType().find_many({})
    .then((data) => {
      personTypes.value = data.data
      personTypes.value.forEach((personType) => {
        form.value.people.push({
          name: personType.name,
          type: personType.id,
          qty: 0,
        })
      })
    })
})
</script>
