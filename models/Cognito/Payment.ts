import { CognitoBase } from './Base'

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
}

export { CognitoPayment }
