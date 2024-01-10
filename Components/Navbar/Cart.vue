<template>
  <span v-if="cartStore.hasCartItems">
    <div class="flex cursor-pointer items-center gap-1" @click="dropdownToggle()">
      <span class="relative inline-block">
        <i-heroicons-solid:shopping-cart class="inline-block" :class="{ 'mr-2 mt-2': props.showIcon }" />
        <span
          v-if="props.showIcon"
          class="absolute right-0 top-0 h-4 w-4 rounded-full bg-red-500 text-center text-xs font-bold text-white dark:bg-red-600"
        >{{ cartStore.cartitemCount }}</span>
      </span>
      <slot />
    </div>
    <teleport to="body">
      <div
        v-if="dropdown"
        ref="cartel"
        class="absolute right-0 top-16 z-50 m-1 w-72 overflow-hidden rounded-md text-gray-700 drop-shadow-xl dark:text-gray-300 md:w-96"
      >
        <div class="flex flex-row bg-gray-100 px-4 py-2 dark:bg-gray-800">
          <div class="flex flex-1 cursor-pointer justify-end" @click="dropdownToggle()">
            <i-heroicons-solid:x />
          </div>
        </div>
        <div v-for="(cartitem, index) in cartStore.cartitems" :key="cartitem.id">
          <div
            class="flex flex-row gap-2 p-4 pb-2"
            :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'"
          >
            <cgn-lazy-image
              class="aspect-square h-full max-h-[3rem] w-full max-w-[3rem] overflow-hidden rounded-md dark:bg-white"
              :image="cartitem.img"
            />
            <div class="flex grow flex-col">
              <div class="flex justify-between">
                <div>
                  <router-link :to="`/product/${cartitem.url}`">{{ cartitem.product_name }}</router-link>
                  <span
                    class="block text-xs text-gray-600 dark:text-gray-400"
                  >{{ cartitem.sku.code }}</span>
                  <span
                    v-for="addon, i in cartitem.addons"
                    :key="i"
                    class="block text-xs text-gray-600 dark:text-gray-400"
                  >+ {{ addon }}</span>
                  <span
                    class="block text-xs text-gray-600 dark:text-gray-400"
                  >${{ cartitem.price.toFixed(2) }} each</span>
                </div>
                <div class="text-right">
                  <span class="cursor-pointer" @click="cartStore.removeItem(cartitem.id)">
                    <i-heroicons-solid:trash />
                  </span>
                </div>
              </div>
              <div class="flex flex-row items-baseline justify-between">
                <div>
                  <span class="font-semibold">x&nbsp;{{ cartitem.qty }}</span>
                </div>
                <div>
                  <span class="text-lg font-semibold">${{ cartitem.subtotal.toFixed(2) }}</span>
                </div>
              </div>
              <div v-if="!cartitem.can_purchase_qty">
                <span
                  class="rounded-full bg-red-100 px-3 text-xs font-medium capitalize text-red-800 dark:bg-red-900 dark:text-red-100"
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

const props = defineProps({
  showIcon: {
    type: Boolean,
    default: true,
  },
})

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
