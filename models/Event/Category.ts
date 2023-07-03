import { CognitoBase } from '../Cognito/Base'

class EventCategory extends CognitoBase {
  name: string
  entry_description: string
  entry_fee: number
  qty_available: number
  spectator_tickets_per_entry: number
  ticket_type: string
  sold_out: boolean
  is_entry_transfer: boolean

  baseurl() {
    return '/api/v1/event/category'
  }

  constructor(source?: Partial<EventCategory>) {
    super()
    this.name = ''
    this.entry_description = ''
    this.entry_fee = 0
    this.qty_available = 0
    this.spectator_tickets_per_entry = 0
    this.ticket_type = ''
    this.sold_out = true
    this.is_entry_transfer = false
    Object.assign(this, source)
  }
}

export { EventCategory }
