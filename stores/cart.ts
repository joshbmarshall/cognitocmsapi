import { acceptHMRUpdate, defineStore } from 'pinia'
import { $axios } from '~cognito/plugins/axios'
import { SellAddress } from '~cognito/models/Sell/Address'

export const useCartStore = defineStore({
  id: 'cart',

  state: () => {
    return {
      cartitemCount: 0,
      cartSubtotal: 0,
      sessionKey: null,
      hasCartItems: false,
      cartitems: [{
        id: 0,
        url: '',
        name: '',
        product_name: '',
        sku_id: 0,
        sku: {
          code: '',
        },
        addons: [],
        qty: 0,
        price: 0,
        image: '',
        img: {
          url: '',
          webp_url: '',
          placeholder: '',
        },
        subtotal: 0,
        can_purchase_qty: false,
      }],
      addresses: <SellAddress[]>[],
      all_in_stock: false,
      promotion_code: '',
      discount_amount: 0,
      shipping_amount: 0,
      shipping_address: 0,
      shipping_type: 0,
      total_amount: 0,
      total_tax: 0,
      payment_types: <{
        id: string
        name: string
      }[]>[],
    }
  },

  actions: {
    async addToCart(sku_id: number, qty: number, addons: any) {
      await $axios
        .post(
          '/api/v1/sell/cart/cartAdd',
          {
            sku: sku_id,
            qty,
            addons,
            session: this.sessionKey,
          },
        )
      this.getCart()
    },
    removeItem(id: number) {
      $axios
        .post(
          '/api/v1/sell/cart/cartRemove',
          {
            id,
            session: this.sessionKey,
          },
        )
        .then((res) => {
          if (res) {
            this.getCart()
          }
        })
    },
    incrementQty(cartItem: any) {
      this.setQty(cartItem, cartItem.qty + 1)
    },
    decrementQty(cartItem: any) {
      this.setQty(cartItem, cartItem.qty - 1)
    },
    setQty(cartItem: any, qty: number) {
      $axios
        .post(
          '/api/v1/sell/cart/cartUpdate',
          {
            id: cartItem.id,
            qty,
            session: this.sessionKey,
          },
        )
        .then((res) => {
          if (res) {
            this.getCart()
          }
        })
    },
    async mergeCart() {
      await $axios
        .post(
          '/api/v1/sell/cart/mergeCart',
          {
            session: this.sessionKey,
          },
        )
      this.getCart()
    },
    getCart() {
      $axios
        .post(
          '/api/v1/sell/cart/getCart',
          {
            session: this.sessionKey,
            promotion_code: this.promotion_code,
            shipping_type: this.shipping_type,
            shipping_address: this.shipping_address,
          },
        )
        .then((res) => {
          this.cartitemCount = res.data.item_count
          this.cartitems = res.data.items
          this.cartSubtotal = res.data.subtotal
          this.sessionKey = res.data.sessionKey
          this.all_in_stock = res.data.all_in_stock
          this.hasCartItems = (this.cartitemCount > 0)
          this.discount_amount = res.data.discount_amount
          this.shipping_amount = res.data.shipping_amount
          this.total_amount = res.data.total_amount
          this.total_tax = res.data.total_tax
          this.payment_types = res.data.payment_types
        })
    },
    getAddresses() {
      new SellAddress().find_many().then((data) => {
        this.addresses = data.data
      })
    },
    async saveNewAddress(
      first_name: string,
      last_name: string,
      email: string,
      phone: string,
      company: string,
      street_address: string,
      street_address_1: string,
      postcode: string,
      city: string,
      state: string,
      country: string,
    ): Promise<number> {
      const address = new SellAddress()
      address.first_name = first_name
      address.last_name = last_name
      address.email = email
      address.phone = phone
      address.company = company
      address.street_address = street_address
      address.street_address_1 = street_address_1
      address.postcode = postcode
      address.city = city
      address.state = state
      address.country = country
      const data
      = await address.create()
      this.getAddresses()
      return data.item.id
    },
    async getShippingQuotesFromSelectedAddress(address: SellAddress) {
      if (!address) {
        return []
      }
      return this.getShippingQuotes(address.postcode, address.city, address.country)
    },
    async getShippingQuotes(postcode: string, suburb: string, country: string) {
      const quotelist = await $axios
        .post(
          '/api/v1/sell/cart/shippingQuote',
          {
            session: this.sessionKey,
            suburb,
            postcode,
            country,
          },
        )
      const options = []
      for (let index = 0; index < quotelist.data.length; index++) {
        const shippingOption = quotelist.data[index]
        options.push({
          id: shippingOption.shipping_type_id,
          name: `${shippingOption.shipping_name} $${shippingOption.amount.toFixed(2)}`,
          amount: shippingOption.amount,
          is_pick_up: shippingOption.is_pick_up,
        })
      }
      return options
    },
    async requestShippingQuote(address: SellAddress) {
      const result = await $axios
        .post(
          '/api/v1/sell/cart/requestShippingQuote',
          {
            session: this.sessionKey,
            address,
          },
        )
      return result.data
    },
    async submitOrder(address: number, shipping_option_id: number, paymentGateway: string, note: string, promotion_code: string) {
      const res = await $axios
        .post('/api/v1/sell/cart/submitOrder', {
          address,
          shipping_option_id,
          paymentGateway,
          note,
          promotion_code,
          url: location.href,
        })
        .catch(() => {
          return 'something went wrong'
        })
      if (res.data.success) {
        window.location = res.data.payment
      } else {
        return res.data.message
      }
    },
    setPromotionCode(promocode: string) {
      this.promotion_code = promocode
      this.getCart()
    },
  },
  persist: true,
  share: {
    enable: true,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
