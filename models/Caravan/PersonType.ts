import { CognitoBase } from '../Cognito/Base'

class CaravanPersonType extends CognitoBase {
  name: string
  min_qty: number

  baseurl() {
    return '/api/v1/caravan/personType'
  }

  constructor(source?: Partial<CaravanPersonType>) {
    super()
    this.name = ''
    this.min_qty = 0
    Object.assign(this, source)
  }
}

export { CaravanPersonType }
