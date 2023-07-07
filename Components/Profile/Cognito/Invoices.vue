<template>
  <div
    v-if="orders.length > 0"
    class="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg"
  >
    <div class="p-3 bg-gray-100 dark:bg-gray-800">
      <span class="capitalize text-xl">My Invoices</span>
    </div>
    <div>
      <div
        v-for="(order, index) in orders"
        :key="index"
        class="divide-y-2"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800 divide-gray-400 dark:divide-gray-600' : 'bg-white dark:bg-gray-900 divide-gray-300 dark:divide-gray-700'"
      >
        <div class="grid grid-cols-3 gap-2 p-3 select-none" @click="selectDropdown(index)">
          <div>
            <div>
              <span class="text-sm mr-1">#</span>
              <span class="text-lg">{{ order.id }}</span>
            </div>
          </div>
          <div>{{ order.created_at?.toHumanDateString(true) }}</div>
          <div class="flex justify-end">
            <div class="flex gap-4 pr-6">
              <router-link :to="`/show-invoice/${order.id}`" title="View invoice">
                <i-heroicons-solid:eye
                  class="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                />
              </router-link>
              <router-link :to="`/show-invoice/print/${order.id}`" title="Print invoice" target="_blank">
                <i-heroicons-solid:printer
                  class="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                />
              </router-link>
            </div>
            <i-heroicons-solid:chevron-up v-if="dropdown_index == index" />
            <i-heroicons-solid:chevron-down v-else />
          </div>
        </div>
        <div v-if="dropdown_index == index" class="flex flex-col border-b-2 pb-1">
          <div v-for="(item, i) in order.invoiceItems" :key="i" class="w-full">
            <div
              class="flex flex-row gap-2 p-4 pb-2"
              :class="i % 2 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'"
            >
              <div class="flex flex-col flex-grow">
                <div class="flex justify-between">
                  <div>
                    {{ item.description }}
                    <span
                      class="text-xs text-gray-600 dark:text-gray-400 block"
                    >${{ (item.line_price / item.qty).toFixed(2) }} each</span>
                  </div>
                </div>
                <div class="flex flex-row justify-between items-baseline">
                  <div>
                    <span v-if="item.qty > 1" class="font-semibold">x&nbsp;{{ item.qty }}</span>
                  </div>
                  <div>
                    <span class="text-lg font-semibold">${{ item.line_price.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CognitoInvoice } from '~cognito/models/Cognito/Invoice'

const orders = ref<CognitoInvoice[]>([])
const dropdown_index = ref(-1)

function selectDropdown(index: number) {
  if (dropdown_index.value === index) {
    dropdown_index.value = -1
    return
  }
  dropdown_index.value = index
}
onMounted(() => {
  new CognitoInvoice().myInvoices()
    .then((data) => {
      orders.value = data
    })
})
</script>
