import { CognitoBase } from '../Cognito/Base'
import type { CognitoMapSite } from '../Cognito/MapSite'

class EventGarage extends CognitoBase {
  name: string
  type: string
  type_id: number
  available: boolean
  booked_by: string
  price: number
  map_site?: CognitoMapSite

  baseurl() {
    return '/api/v1/event/garage'
  }

  constructor(source?: Partial<EventGarage>) {
    super()
    this.name = ''
    this.type = ''
    this.type_id = 0
    this.available = false
    this.booked_by = ''
    this.price = 0
    Object.assign(this, source)
  }
}

export { EventGarage }
