import { CognitoBase } from '../Cognito/Base'

class EventCategory extends CognitoBase {
  name: string
  entry_fee: number
  qty_available: number
  spectator_tickets_per_entry: number
  sold_out: boolean

  baseurl() {
    return '/api/v1/event/category'
  }

  constructor(source?: Partial<EventCategory>) {
    super()
    this.name = ''
    this.entry_fee = 0
    this.qty_available = 0
    this.spectator_tickets_per_entry = 0
    this.sold_out = true
    Object.assign(this, source)
  }
}

export { EventCategory }
