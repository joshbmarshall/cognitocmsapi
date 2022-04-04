import { $axios } from '~/plugins/axios'

class SellCart {
  async getPaymentMethods() {
    const res = await $axios.get('/api/v1/sell/cart/checkoutPaymentMethods')
    return res.data
  }
}

export { SellCart }
