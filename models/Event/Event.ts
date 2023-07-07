import { CognitoBase } from '../Cognito/Base'
import { CognitoTime } from '../Cognito/Time'
import type { EventCategory } from './Category'
import { EventDate } from './Date'
import type { EventExtra } from './Extra'
import type { EventLicenceType } from './LicenceType'
import type { EventMerch } from './Merch'
import type { EventSpectatorType } from './SpectatorType'
import { EventType } from './Type'
import { EventVenue } from './Venue'
import { $axios } from '~cognito/plugins/axios'

class EventEvent extends CognitoBase {
  name: string
  url: string
  type: EventType
  start_date: CognitoTime
  venue: EventVenue
  dates: EventDate[]
  entrant_content: string
  spectator_content: string
  entries_open_at: CognitoTime
  can_enter: boolean
  categories: EventCategory[]
  spectator_types: EventSpectatorType[]
  extras: EventExtra[]
  merch: EventMerch[]
  licence_types: EventLicenceType[]
  last_address_id: number
  last_vehicle_id: number
  aasa_licence: string
  user_cannot_enter_reason: string

  baseurl() {
    return '/api/v1/event/event'
  }

  constructor(source?: Partial<EventEvent>) {
    super()
    this.name = ''
    this.url = ''
    this.type = new EventType()
    this.venue = new EventVenue()
    this.dates = []
    this.entrant_content = ''
    this.spectator_content = ''
    this.can_enter = false
    this.categories = []
    this.spectator_types = []
    this.extras = []
    this.merch = []
    this.licence_types = []
    this.last_address_id = 0
    this.last_vehicle_id = 0
    this.aasa_licence = ''
    this.user_cannot_enter_reason = ''
    Object.assign(this, source)
    this.start_date = new CognitoTime(source?.start_date)
    this.entries_open_at = new CognitoTime(source?.entries_open_at)
    if (source?.dates) {
      this.dates = new EventDate().map(source?.dates)
    }
  }

  async submitEntry(data: any): Promise<{
    success: boolean
    message: string
    redirect: string
  }> {
    return (await $axios.post(`${this.baseurl()}/submitEntry`, data)).data
  }
}

export { EventEvent }
