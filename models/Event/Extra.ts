import { CognitoBase } from '../Cognito/Base'

class EventExtra extends CognitoBase {
  name: string
  content: string
  qty_available: number
  max_qty_per_entry: number
  price_each: number
  sold_out: boolean

  baseurl() {
    return '/api/v1/event/extra'
  }

  constructor(source?: Partial<EventExtra>) {
    super()
    this.name = ''
    this.content = ''
    this.qty_available = 0
    this.max_qty_per_entry = 0
    this.price_each = 0
    this.sold_out = true
    Object.assign(this, source)
  }
}

export { EventExtra }
