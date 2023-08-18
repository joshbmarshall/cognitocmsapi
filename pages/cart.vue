<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-2 p-8 md:flex-row">
    <div class="w-full md:w-2/3">
      <div class="flex flex-row items-baseline gap-2">
        <span class="text-2xl">Cart</span>
        <span class="text-sm text-gray-600 dark:text-gray-200">({{ cartStore.cartitemCount }} Items)</span>
      </div>
      <CartList />
      <div class="flex flex-row gap-4">
        <div class="mt-4 flex w-full flex-col justify-end gap-2">
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
onMounted(() => {
  cartStore.getCart()
})
</script>
