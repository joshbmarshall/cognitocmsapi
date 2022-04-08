import { CognitoBase } from '../Cognito/Base'
import { $axios } from '~cognito/plugins/axios'

class SellCart extends CognitoBase {
  baseurl() {
    return '/api/v1/sell/cart'
  }

  async getPaymentMethods() {
    const res = await $axios.get('/api/v1/sell/cart/checkoutPaymentMethods')
    return res.data
  }
}

export { SellCart }
