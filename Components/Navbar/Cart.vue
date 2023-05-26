<template>
  <span v-if="cartStore.hasCartItems">
    <span class="relative inline-block cursor-pointer" @click="dropdownToggle()">
      <i-heroicons-solid:shopping-cart class="mr-2 mt-2 dark:text-gray-400" />
      <span
        class="absolute top-0 right-0 w-4 h-4 text-xs font-bold text-center text-white bg-red-500 dark:bg-red-600 rounded-full"
      >{{ cartStore.cartitemCount }}</span>
    </span>
    <teleport to="body">
      <div
        v-if="dropdown"
        ref="cartel"
        class="absolute w-72 md:w-96 drop-shadow-xl right-0 m-1 top-16 rounded-md overflow-hidden text-gray-700 dark:text-gray-300 z-50"
      >
        <div class="flex flex-row px-4 py-2 bg-gray-100 dark:bg-gray-800">
          <div class="flex justify-end flex-1 cursor-pointer" @click="dropdownToggle()">
            <i-heroicons-solid:x />
          </div>
        </div>
        <div v-for="(cartitem, index) in cartStore.cartitems" :key="cartitem.id">
          <div
            class="flex flex-row gap-2 p-4 pb-2"
            :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'"
          >
            <cgn-lazy-image
              class="aspect-square rounded-md overflow-hidden w-full h-full max-w-[3rem] max-h-[3rem] dark:bg-white"
              :image="cartitem.img"
            />
            <div class="flex flex-col flex-grow">
              <div class="flex justify-between">
                <div>
                  <router-link :to="`/product/${cartitem.url}`">{{ cartitem.product_name }}</router-link>
                  <span
                    class="text-xs text-gray-600 dark:text-gray-400 block"
                  >{{ cartitem.sku.code }}</span>
                  <span
                    v-for="addon, i in cartitem.addons"
                    :key="i"
                    class="text-xs text-gray-600 dark:text-gray-400 block"
                  >+ {{ addon }}</span>
                  <span
                    class="text-xs text-gray-600 dark:text-gray-400 block"
                  >${{ cartitem.price.toFixed(2) }} each</span>
                </div>
                <div class="text-right">
                  <span class="cursor-pointer" @click="cartStore.removeItem(cartitem.id)">
                    <i-heroicons-solid:trash />
                  </span>
                </div>
              </div>
              <div class="flex flex-row justify-between items-baseline">
                <div>
                  <span class="font-semibold">x&nbsp;{{ cartitem.qty }}</span>
                </div>
                <div>
                  <span class="text-lg font-semibold">${{ cartitem.subtotal }}</span>
                </div>
              </div>
              <div v-if="!cartitem.can_purchase_qty">
                <span
                  class="text-xs font-medium rounded-full px-3 capitalize bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                >Insufficient stock</span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-row justify-evenly p-4"
          :class="cartStore.cartitems.length % 2 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'"
        >
          <router-link class="flex flex-row items-center" to="/cart">
            <i-heroicons-outline:shopping-cart />
            <span class="pl-1">Cart</span>
          </router-link>
          <router-link class="flex flex-row items-center" to="/checkout">
            <i-heroicons-solid:shopping-cart />
            <span class="pl-1">Checkout</span>
          </router-link>
        </div>
      </div>
    </teleport>
  </span>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { useCartStore } from '~cognito/stores/cart'

const cartStore = useCartStore()

const dropdown = ref(false)
function dropdownToggle() {
  dropdown.value = !dropdown.value
}
const router = useRouter()
router.beforeEach(() => {
  dropdown.value = false
})

const cartel = ref(null)
onClickOutside(cartel, (event) => {
  dropdown.value = false
})
onMounted(() => {
  cartStore.getCart()
})
</script>
