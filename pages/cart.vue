<template>
  <div class="max-w-5xl p-8 mx-auto flex flex-col md:flex-row gap-2">
    <div class="w-full md:w-2/3">
      <div class="flex flex-row gap-2 items-baseline">
        <span class="text-2xl">Cart</span>
        <span class="text-sm text-gray-600 dark:text-gray-200">({{ cartStore.cartitemCount }} Items)</span>
      </div>
      <CartList />
      <div class="flex flex-row gap-4">
        <div class="flex flex-col w-full gap-2 justify-end mt-4">
          <div class="flex justify-between">
            <span class="text-lg">Subtotal:</span>
            <span class="text-xl font-bold">${{ cartStore.cartSubtotal.toFixed(2) }}</span>
          </div>
          <cgn-button color-brand url="/checkout">
            <i-heroicons-solid:shopping-cart class="inline" />
            Check Out
          </cgn-button>
        </div>
      </div>
    </div>
    <div class="w-full md:w-1/3">
      <span class="text-2xl">Shipping quote</span>
      <cgn-cart-shipping-quote />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~cognito/stores/cart'

const cartStore = useCartStore()
const start = () => {
  cartStore.getCart()
  usePageStore().setSEO({
    title: 'Cart',
    canonical: '/cart',
  })
}
onMounted(start)
onServerPrefetch(start)
</script>
