<template>
  <div class="overflow-hidden rounded-md drop-shadow-lg">
    <div v-if="cartStore.cartitems.length < 1" class="bg-white p-4 pb-6 dark:bg-gray-900">
      <div class="flex grow flex-col text-center">
        <div class="text-lg">
          No Items
        </div>
        <router-link
          to="/shop"
          class="block text-xs text-gray-600 decoration-gray-600 decoration-2 hover:text-gray-800 hover:underline hover:decoration-solid dark:text-gray-400 dark:decoration-gray-400 dark:hover:text-gray-200"
        >
          Shop now
        </router-link>
      </div>
    </div>
    <div
      v-for="(cartitem, index) in cartStore.cartitems"
      :key="cartitem.id"
      :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'"
    >
      <div class="flex flex-col gap-2 p-4 pb-6 sm:flex-row sm:pb-4">
        <cgn-lazy-image
          class="aspect-square h-full min-h-[6rem] w-full min-w-[6rem] overflow-hidden rounded-md object-cover dark:bg-white sm:h-24 sm:w-24"
          :image="cartitem.img"
        />
        <div class="flex grow flex-col">
          <div class="flex flex-row justify-between pb-2">
            <div>
              <router-link
                class="text-lg"
                :to="`/product/${cartitem.url}`"
              >
                {{ cartitem.product_name }}
              </router-link>
              <span class="block text-xs text-gray-600 dark:text-gray-400">{{ cartitem.sku.code }}</span>
              <span
                v-for="addon, i in cartitem.addons"
                :key="i"
                class="block text-xs text-gray-600 dark:text-gray-400"
              >+ {{ addon }}</span>
              <span
                class="block text-xs text-gray-600 dark:text-gray-400"
              >${{ cartitem.price.toFixed(2) }} each</span>
            </div>
            <div>
              <span class="text-lg font-semibold">${{ cartitem.subtotal.toFixed(2) }}</span>
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <div>
              <span
                class="cursor-pointer text-sm font-light text-red-600 hover:text-red-700 dark:hover:text-red-500"
                @click="cartStore.removeItem(cartitem.id)"
              >Remove</span>
            </div>
            <div v-if="!cartitem.can_purchase_qty">
              <span
                class="rounded-full bg-red-100 px-3 text-xs font-medium capitalize text-red-800 dark:bg-red-900 dark:text-red-100 sm:text-sm"
              >Insufficient stock</span>
            </div>
            <div class="flex flex-row">
              <button
                class="rounded-l-md border-y border-l border-gray-200 bg-gray-100 px-1 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                @click="decrement(cartitem)"
              >
                <i-heroicons-solid:chevron-left class="h-4 w-4" />
              </button>
              <span
                class="cursor-pointer select-none border-y border-gray-200 bg-white px-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50"
              >{{ cartitem.qty }}</span>
              <button
                class="rounded-r-md border-y border-r border-gray-200 bg-gray-100 px-1 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                @click="increment(cartitem)"
              >
                <i-heroicons-solid:chevron-right class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~cognito/stores/cart'

const cartStore = useCartStore()

function increment(cartitem: any) {
  cartStore.incrementQty(cartitem)
}
function decrement(cartitem: any) {
  cartStore.decrementQty(cartitem)
}
onMounted(() => {
  cartStore.getCart()
})
</script>
