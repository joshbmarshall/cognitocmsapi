import { CognitoBase } from '../Cognito/Base'

class EventCategory extends CognitoBase {
  name: string
  entry_description: string
  price: number
  qty_available: number
  spectator_tickets_per_entry: number
  ticket_type: string
  sold_out: boolean
  is_entry_transfer: boolean
  requires_garage: boolean
  garage_included_in_entry_fee: boolean
  vehicle_must_be_registered: boolean
  cannot_enter_reason: string

  baseurl() {
    return '/api/v1/event/category'
  }

  constructor(source?: Partial<EventCategory>) {
    super()
    this.name = ''
    this.entry_description = ''
    this.price = 0
    this.qty_available = 0
    this.spectator_tickets_per_entry = 0
    this.ticket_type = ''
    this.sold_out = true
    this.is_entry_transfer = false
    this.requires_garage = false
    this.garage_included_in_entry_fee = false
    this.vehicle_must_be_registered = true
    this.cannot_enter_reason = ''
    Object.assign(this, source)
  }
}

export { EventCategory }
