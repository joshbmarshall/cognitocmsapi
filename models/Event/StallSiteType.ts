import { CognitoBase } from '../Cognito/Base'

class EventStallSiteType extends CognitoBase {
  name: string
  site_description: string
  price: number
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
    this.qty_available = 0
    this.sold_out = true
    Object.assign(this, source)
  }
}

export { EventStallSiteType }
