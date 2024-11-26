import { CognitoBase } from '../Cognito/Base'

class EventStallSiteType extends CognitoBase {
  name: string
  site_description: string
  price: number
  price_tiers: {
    base_price: number
    base_area: number
    maximum_area: number
    price_per_square_metre: number
  }[]

  is_food_vendor: boolean
  offer_our_pli: boolean
  qty_available: number
  sold_out: boolean
  min_site_width: number
  max_site_width: number
  min_site_depth: number
  max_site_depth: number
  max_site_area: number
  baseurl() {
    return '/api/v1/event/stallSiteType'
  }

  constructor(source?: Partial<EventStallSiteType>) {
    super()
    this.name = ''
    this.site_description = ''
    this.price = 0
    this.price_tiers = []
    this.is_food_vendor = false
    this.offer_our_pli = false
    this.qty_available = 0
    this.sold_out = true
    this.min_site_width = 0
    this.max_site_width = 0
    this.min_site_depth = 0
    this.max_site_depth = 0
    this.max_site_area = 0
    Object.assign(this, source)
  }
}

export { EventStallSiteType }
