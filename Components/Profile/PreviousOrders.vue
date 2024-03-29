<template>
  <div
    v-if="orders.length > 0"
    class="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900"
  >
    <div class="bg-gray-100 p-3 dark:bg-gray-800">
      <span class="text-xl capitalize">previous orders</span>
    </div>
    <div>
      <div
        v-for="(order, index) in orders"
        :key="index"
        class="divide-y-2"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800 divide-gray-400 dark:divide-gray-600' : 'bg-white dark:bg-gray-900 divide-gray-300 dark:divide-gray-700'"
      >
        <div class="grid select-none grid-cols-3 gap-2 p-3" @click="selectDropdown(index)">
          <div>
            <div>
              <span class="mr-1 text-sm">Order</span>
              <span class="text-lg">{{ order.id }}</span>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ order.status }}</span>
          </div>
          <div>
            <span
              class="rounded-full px-3 font-medium capitalize"
              :class="order.status_type == 'pending' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' : order.status_type == 'complete' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : order.status_type == 'cancelled' ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'"
            >{{ order.status_type }}</span>
          </div>
          <div class="flex justify-end">
            <div class="flex gap-4 pr-6">
              <router-link :to="`/invoice/${order.id}`" title="View invoice">
                <i-heroicons-solid:eye
                  class="cursor-pointer text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                />
              </router-link>
              <router-link :to="`/invoice/print/${order.id}`" title="Print invoice" target="_blank">
                <i-heroicons-solid:printer
                  class="cursor-pointer text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                />
              </router-link>
            </div>
            <i-heroicons-solid:chevron-up v-if="dropdown_index == index" />
            <i-heroicons-solid:chevron-down v-else />
          </div>
        </div>
        <div v-if="dropdown_index == index" class="flex flex-col border-b-2 pb-1">
          <div v-for="(item, i) in order.items" :key="i" class="w-full">
            <div
              class="flex flex-row gap-2 p-4 pb-2"
              :class="i % 2 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'"
            >
              <cgn-lazy-image
                class="aspect-square h-full max-h-[3rem] w-full max-w-[3rem] overflow-hidden rounded-md dark:bg-white"
                :image="item.image"
              />
              <div class="flex grow flex-col">
                <div class="flex justify-between">
                  <div>
                    <router-link :to="`/product/${item.url}`">
                      {{ item.product_name }}
                    </router-link>
                    <span class="block text-xs text-gray-600 dark:text-gray-400">{{ item.sku.code }}</span>
                    <span
                      v-for="(addon, pos) in item.addons"
                      :key="pos"
                      class="block text-xs text-gray-600 dark:text-gray-400"
                    >+ {{ addon }}</span>
                    <span
                      class="block text-xs text-gray-600 dark:text-gray-400"
                    >${{ item.price_each.toFixed(2) }} each</span>
                  </div>
                </div>
                <div class="flex flex-row items-baseline justify-between">
                  <div>
                    <span class="font-semibold">x&nbsp;{{ item.qty }}</span>
                  </div>
                  <div>
                    <span class="text-lg font-semibold">${{ item.subtotal.toFixed(2) }}</span>
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
import { SellInvoice } from '~cognito/models/Sell/Invoice'

const orders = ref<SellInvoice[]>([])
const dropdown_index = ref(-1)

function selectDropdown(index: number) {
  if (dropdown_index.value === index) {
    dropdown_index.value = -1
    return
  }
  dropdown_index.value = index
}
onMounted(() => {
  new SellInvoice().myInvoices()
    .then((data) => {
      orders.value = data
    })
})
</script>
