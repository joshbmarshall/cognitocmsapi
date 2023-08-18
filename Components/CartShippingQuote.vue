<template>
  <form @submit.prevent="go">
    <div class="mt-4 grid grid-cols-2 gap-2">
      <cgn-form-input-text v-model="postcode" label="Postcode" required />
      <cgn-form-input-text v-model="country" label="Country" required />
    </div>
    <cgn-button submit fullwidth color-brand>
      Find Shipping Options
    </cgn-button>
  </form>
  <div
    v-if="shippingQuotes.length > 0"
    class="mt-4 max-h-96 w-full overflow-y-auto rounded-md shadow-lg"
  >
    <div class="grid auto-rows-[1fr] grid-cols-1">
      <div
        v-for="(shippingQuote, index) in shippingQuotes"
        :key="index"
        class="select-none p-3"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'"
      >
        {{ shippingQuote.name }}
      </div>
    </div>
  </div>
  <div v-if="noShippingQuotes">
    No Shipping options were found
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~cognito/stores/cart'

const cartStore = useCartStore()

const postcode = ref('')
const country = ref('Australia')

const shippingQuotes = ref<any[]>([])
const noShippingQuotes = ref(false)

const go = async () => {
  shippingQuotes.value = await cartStore.getShippingQuotes(postcode.value, country.value)
  noShippingQuotes.value = shippingQuotes.value.length == 0
}
</script>
