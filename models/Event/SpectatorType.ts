import { CognitoBase } from '../Cognito/Base'

class EventSpectatorType extends CognitoBase {
  name: string
  price: number
  qty_available: number
  sold_out: boolean
  require_vehicle_make_and_model: boolean
  require_vehicle_registration: boolean

  baseurl() {
    return '/api/v1/event/spectatorType'
  }

  constructor(source?: Partial<EventSpectatorType>) {
    super()
    this.name = ''
    this.price = 0
    this.qty_available = 0
    this.sold_out = true
    this.require_vehicle_make_and_model = false
    this.require_vehicle_registration = false
    Object.assign(this, source)
  }
}

export { EventSpectatorType }
