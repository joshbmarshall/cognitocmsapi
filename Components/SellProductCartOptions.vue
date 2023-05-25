<template>
  <slot
    :sku="sku"
    :qty="qty"
    :variations="variations"
    :show_checkout="show_checkout"
    :can_add_to_cart="can_add_to_cart"
    :add-to-cart="addToCart"
    :increase-qty="increaseQty"
    :decrease-qty="decreaseQty"
    :select-variation="selectVariation"
  >
    <div class="space-y-3">
      <div v-for="variation in variations" :key="variation.name" class="flex flex-col">
        <FormDropdown
          v-model="variation.selected"
          :label="variation.name"
          :options="variation.options"
        />
      </div>
      <div v-for="addon in addons" :key="addon.id" class="flex flex-col">
        <FormCheckbox v-if="addon.type == 'Checkbox'" v-model="addon.selected" :label="addon.name" />
        <FormDropdown
          v-if="addon.type == 'Dropdown'"
          v-model="addon.selected"
          :label="addon.name"
          :options="addon.options"
        />
        <ss-input-text
          v-if="addon.type == 'Qty'"
          v-model="addon.selected"
          type="number"
          :min-amount="addon.min_qty"
          :max-amount="addon.max_qty"
          :label="addon.name"
        />
        <ss-input-text v-if="addon.type == 'Text'" v-model="addon.selected" :label="addon.name" />
      </div>
      <ss-input-text v-model="qty" label="Qty" type="number" min-amount="1" />
      <div>
        <div
          v-if="price_each"
          class="font-medium text-xl"
          :class="on_special ? 'text-red-400 dark:text-red-600' : 'text-gray-700 dark:text-gray-100'"
        >
          ${{ price_each }}
        </div>
        <div
          v-if="on_special"
          class="line-through text-xs font-medium text-gray-500 dark:text-gray-400"
        >
          ${{ full_price_each }}
        </div>
      </div>
      <cgn-alert-danger v-if="!in_stock && selected_sku > 0">
        Out of stock
      </cgn-alert-danger>
      <cgn-alert-danger v-if="selected_sku == 0">
        Select options
      </cgn-alert-danger>
      <cgn-alert-success v-if="added_to_cart">
        Added to cart
      </cgn-alert-success>
      <cgn-button
        v-if="show_checkout"
        extra-classes="bg-gray-600 dark:bg-gray-600 hover:bg-slate-700 dark:hover:bg-slate-700"
        url="/checkout"
      >
        Checkout now
      </cgn-button>
      <cgn-button v-if="can_add_to_cart" @click="addToCart">
        <span class="flex flex-row gap-2 items-center">
          Add to cart
          <cgn-spinner v-if="adding_to_cart" />
        </span>
      </cgn-button>
    </div>
  </slot>
</template>

<script setup lang="ts">
import { SellProduct, SellSkuSearchResult } from '~cognito/models/Sell/Product'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const cartStore = useCartStore()

const sku = ref(new SellSkuSearchResult())
const selected_sku = ref(0)
const price_each = ref('')
const full_price_each = ref('')
const on_special = ref(false)
const in_stock = ref(true)
const qty = ref(1)
const variations = ref(props.product.variations)
const addons = ref(props.product.addons)

const adding_to_cart = ref(false)
const added_to_cart = ref(false)
const can_add_to_cart = computed(() => {
  if (!in_stock.value) {
    return false
  }
  return selected_sku.value > 0
})
const show_checkout = ref(false)

const selected_addons = computed<{
  id: number
  value: string
}[]>(() => {
  const selected_addons = []
  for (let index = 0; index < addons.value.length; index++) {
    const addon = addons.value[index]
    if (addon.selected) {
      selected_addons.push({
        id: addon.id,
        value: addon.selected,
      })
    }
  }
  return selected_addons
})

const selected_variations = computed<{
  name: string
  value: string
}[]>(() => {
  const selected_variations = []
  if (!variations.value) {
    return []
  }
  for (let index = 0; index < variations.value.length; index++) {
    const variation = variations.value[index]
    if (variation.selected) {
      selected_variations.push({
        name: variation.name,
        value: variation.selected,
      })
    }
  }
  return selected_variations
})

const searchsku = () => {
  if (!props.product.id) {
    return
  }
  new SellProduct().skusearch({
    product_id: props.product.id,
    variations: selected_variations.value,
    addons: selected_addons.value,
  })
    .then((data) => {
      sku.value = data
      selected_sku.value = data.sku
      price_each.value = data.price_each
      full_price_each.value = data.full_price_each
      on_special.value = data.on_special
      in_stock.value = data.in_stock
    })
}

watch(() => [
  variations,
  addons,
  props.product,
], () => {
  searchsku()
}, { deep: true })

const increaseQty = () => {
  qty.value++
}
const decreaseQty = () => {
  qty.value--
  if (qty.value < 1) {
    qty.value = 1
  }
}

const selectVariation = (variation_id: number, option_id: string) => {
  for (let index = 0; index < variations.value.length; index++) {
    const variation = variations.value[index]
    if (variation_id == variation.id) {
      variation.selected = option_id
    }
  }
}

const addToCart = async () => {
  adding_to_cart.value = true
  await cartStore.addToCart(selected_sku.value, qty.value, selected_addons.value)
  adding_to_cart.value = false
  added_to_cart.value = true
  show_checkout.value = true
  setTimeout(() => {
    added_to_cart.value = false
  }, 3000)
}
onMounted(() => {
  searchsku()
})
</script>
