import { CognitoBase } from '../Cognito/Base'
import type { CognitoMapSite } from '../Cognito/MapSite'

class EventCampSite extends CognitoBase {
  name: string
  type: string
  available: boolean
  booked_by: string
  price: number
  map_site?: CognitoMapSite

  baseurl() {
    return '/api/v1/event/campSite'
  }

  constructor(source?: Partial<EventCampSite>) {
    super()
    this.name = ''
    this.type = ''
    this.available = false
    this.booked_by = ''
    this.price = 0
    Object.assign(this, source)
  }
}

export { EventCampSite }
