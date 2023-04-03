import { CognitoBase } from '../Cognito/Base'

class CaravanPersonType extends CognitoBase {
  name: string

  baseurl() {
    return '/api/v1/caravan/personType'
  }

  constructor(source?: Partial<CaravanPersonType>) {
    super()
    this.name = ''
    Object.assign(this, source)
  }
}

export { CaravanPersonType }
