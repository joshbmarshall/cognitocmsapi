import { acceptHMRUpdate, defineStore } from 'pinia'
import { $axios } from '~cognito/plugins/axios'
import { SellAddress } from '~cognito/models/Sell/Address'

export const useCartStore = defineStore({
  id: 'cart',

  state: () => {
    return {
      cartitemCount: 0,
      cartSubtotal: 0,
      sessionKey: '',
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
        addons: <string[]>[],
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
      await useGql(graphql(`mutation($sku: Int!, $qty: Int!, $addons: [sellAddToCartAddon!]!, $session: String) {
        sellMiscAddToCart(sku: $sku, qty: $qty, addons: $addons, session: $session) {
          id
        }
      }`), {
        sku: sku_id,
        qty: Number.parseInt(`${qty}`),
        addons,
        session: this.sessionKey,
      })
      this.getCart()
    },
    async removeItem(id: number) {
      await useGql(graphql(`mutation($id: Int!, $qty: Int!, $session: String) {
        sellMiscUpdateCartQty(cart_item_id: $id, qty: $qty, session: $session) {
          id
        }
      }`), {
        id,
        qty: 0,
        session: this.sessionKey,
      })
      this.getCart()
    },
    incrementQty(cartItem: any) {
      this.setQty(cartItem, cartItem.qty + 1)
    },
    decrementQty(cartItem: any) {
      this.setQty(cartItem, cartItem.qty - 1)
    },
    async setQty(cartItem: any, qty: number) {
      await useGql(graphql(`mutation($id: Int!, $qty: Int!, $session: String) {
        sellMiscUpdateCartQty(cart_item_id: $id, qty: $qty, session: $session) {
          id
        }
      }`), {
        id: cartItem.id,
        qty: Number.parseInt(`${qty}`),
        session: this.sessionKey,
      })
      this.getCart()
    },
    async mergeCart() {
      await useGql(graphql(`mutation($session: String!) {
        sellMiscMergeCart(session: $session)
      }`), {
        session: `${this.sessionKey}`,
      })
      this.getCart()
    },
    async getCart() {
      const cart = await useGql(graphql(`query ($session: String, $promotion_code: String, $shipping_type: Int, $shipping_address: Int) {
        sellMisc {
          getCart(session: $session, promotion_code: $promotion_code, shipping_type: $shipping_type, shipping_address: $shipping_address) {
            item_count
            sessionKey
            subtotal
            all_in_stock
            discount_amount
            shipping_amount
            total_amount
            total_tax
            items {
              id
              url
              name
              product_name
              sku_id
              sku {
                code
              },
              addons
              qty
              price
              image
              img {
                url
                webp_url
                placeholder
              },
              subtotal
              can_purchase_qty
            }
            payment_types {
              id
              name
            }
          }
        }
      }`), {
        session: this.sessionKey,
        promotion_code: this.promotion_code,
        shipping_type: this.shipping_type,
        shipping_address: Number.parseInt(`${this.shipping_address}`),
      })
      if (!cart?.sellMisc?.getCart) {
        return
      }
      const cartData = cart.sellMisc.getCart
      this.cartitemCount = cartData.item_count
      this.cartitems = cartData.items
      this.cartSubtotal = cartData.subtotal
      this.sessionKey = cartData.sessionKey
      this.all_in_stock = cartData.all_in_stock
      this.hasCartItems = (this.cartitemCount > 0)
      this.discount_amount = cartData.discount_amount
      this.shipping_amount = cartData.shipping_amount
      this.total_amount = cartData.total_amount
      this.total_tax = cartData.total_tax
      this.payment_types = cartData.payment_types
    },
    getAddresses() {
      useGql(graphql(`{
        sellAddresss(isMine: true) {
          id
          display_name
          first_name
          last_name
          email
          phone
          company
          street_address
          postcode
          city
          state
          country
        }
      }`)).then((data) => {
        this.addresses = data.sellAddresss.map(e => new SellAddress(e)) || []
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
      const quotelist = await useGql(graphql(`query($postcode: String!, $suburb: String, $country: String, $session: String) {
        sellMisc {
          getShippingOptions(postcode: $postcode, suburb: $suburb, country: $country, session: $session) {
            shipping_type_id
            shipping_name
            amount
            is_pick_up
          }
        }
      }`), {
        session: this.sessionKey,
        suburb,
        postcode,
        country,
      })
      const options = <{
        id: number
        name: string
        amount: number
        is_pick_up: boolean
      }[]> []

      quotelist.sellMisc?.getShippingOptions?.forEach((shippingOption) => {
        options.push({
          id: shippingOption.shipping_type_id,
          name: `${shippingOption.shipping_name} $${shippingOption.amount.toFixed(2)}`,
          amount: shippingOption.amount,
          is_pick_up: shippingOption.is_pick_up,
        })
      })

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
      const data = await useGql(graphql(`mutation($checkout: sellPlaceOrder!) {
        sellMiscPlaceOrder(checkout: $checkout) {
          success
          payment
          message
        }
      }`), {
        checkout: {
          address,
          shipping_option_id,
          paymentGateway,
          note,
          promotion_code,
          url: location.href,
        },
      })
      if (data.sellMiscPlaceOrder.success) {
        window.location = data.sellMiscPlaceOrder.payment
      } else {
        return data.sellMiscPlaceOrder.message
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
