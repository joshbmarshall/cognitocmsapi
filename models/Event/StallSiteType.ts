import { CognitoBase } from '../Cognito/Base'

class EventStallSiteType extends CognitoBase {
  name: string
  site_description: string
  price: number
  is_food_vendor: boolean
  offer_our_pli: boolean
  qty_available: number
  sold_out: boolean

  baseurl() {
    return '/api/v1/event/stallSiteType'
  }

  constructor(source?: Partial<EventStallSiteType>) {
    super()
    this.name = ''
    this.site_description = ''
    this.price = 0
    this.is_food_vendor = false
    this.offer_our_pli = false
    this.qty_available = 0
    this.sold_out = true
    Object.assign(this, source)
  }
}

export { EventStallSiteType }
