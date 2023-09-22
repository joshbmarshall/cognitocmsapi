import { CognitoBase } from '../Cognito/Base'

class EventGarage extends CognitoBase {
  name: string
  available: boolean
  booked_by: string
  price: number

  baseurl() {
    return '/api/v1/event/garage'
  }

  constructor(source?: Partial<EventGarage>) {
    super()
    this.name = ''
    this.available = false
    this.booked_by = ''
    this.price = 0
    Object.assign(this, source)
  }
}

export { EventGarage }
