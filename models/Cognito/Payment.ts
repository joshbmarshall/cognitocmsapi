import { CognitoBase } from './Base'
import { $axios } from '~cognito/plugins/axios'

class CognitoPayment extends CognitoBase {
  id: number

  baseurl(): string {
    return '/api/v1/cognito/payment'
  }

  constructor(source?: Partial<CognitoPayment>) {
    super()
    this.id = 0
    Object.assign(this, source)
  }

  async checkSuccessful(): Promise<{
    has_payment: boolean
    success: boolean
    payment: number
  }> {
    const payum_token = new URL(location.href).searchParams.get('payum_token')
    const url = btoa(location.href)

    if (!payum_token) {
      return {
        has_payment: false,
        success: false,
        payment: 0,
      }
    }
    const data = await $axios.get(`/api/v1/cognito/payment/checkPaid?url=${url}&payum_token=${payum_token}`)

    return {
      has_payment: true,
      success: data.data.success,
      payment: data.data.payment,
    }
  }
}

export { CognitoPayment }
