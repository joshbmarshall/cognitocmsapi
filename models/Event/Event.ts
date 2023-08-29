import { CognitoBase } from '../Cognito/Base'
import { CognitoImage } from '../Cognito/Image'
import { CognitoTime } from '../Cognito/Time'
import { CognitoUserDocument } from '../Cognito/UserDocument'
import type { EventCategory } from './Category'
import { EventDate } from './Date'
import type { EventExtra } from './Extra'
import type { EventLicenceType } from './LicenceType'
import type { EventMerch } from './Merch'
import type { EventSpectatorType } from './SpectatorType'
import type { EventStallLocation } from './StallLocation'
import type { EventStallPowerType } from './StallPowerType'
import type { EventStallSiteType } from './StallSiteType'
import { EventType } from './Type'
import { EventVenue } from './Venue'
import { $axios } from '~cognito/plugins/axios'

class EventEvent extends CognitoBase {
  name: string
  url: string
  type: EventType
  start_date: CognitoTime
  end_date: CognitoTime
  image: CognitoImage
  blurb: string
  page_content: string
  venue: EventVenue
  dates: EventDate[]
  entrant_content: string
  spectator_content: string
  entries_open_at: CognitoTime
  can_enter: boolean
  can_buy_spectator_ticket: boolean
  can_apply_stall_site: boolean
  categories: EventCategory[]
  spectator_types: EventSpectatorType[]
  stall_site_types: EventStallSiteType[]
  stall_locations: EventStallLocation[]
  stall_power_types: EventStallPowerType[]
  extras: EventExtra[]
  merch: EventMerch[]
  licence_types: EventLicenceType[]
  last_address_id: number
  last_vehicle_id: number
  aasa_licence: string
  user_cannot_enter_reason: string
  user_cannot_apply_stall_site_reason: string
  stall_public_liability_insurance?: CognitoUserDocument
  stall_food_licence?: CognitoUserDocument

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
    this.blurb = ''
    this.page_content = ''
    this.entrant_content = ''
    this.spectator_content = ''
    this.can_enter = false
    this.can_buy_spectator_ticket = false
    this.can_apply_stall_site = false
    this.categories = []
    this.spectator_types = []
    this.stall_site_types = []
    this.stall_locations = []
    this.stall_power_types = []
    this.extras = []
    this.merch = []
    this.licence_types = []
    this.last_address_id = 0
    this.last_vehicle_id = 0
    this.aasa_licence = ''
    this.user_cannot_enter_reason = ''
    this.user_cannot_apply_stall_site_reason = ''
    Object.assign(this, source)
    this.start_date = new CognitoTime(source?.start_date)
    this.end_date = new CognitoTime(source?.end_date)
    this.entries_open_at = new CognitoTime(source?.entries_open_at)
    this.image = new CognitoImage(source?.image)
    if (source?.dates) {
      this.dates = new EventDate().map(source?.dates)
    }
    if (source?.stall_public_liability_insurance) {
      this.stall_public_liability_insurance = new CognitoUserDocument(source.stall_public_liability_insurance)
    }
    if (source?.stall_food_licence) {
      this.stall_food_licence = new CognitoUserDocument(source.stall_food_licence)
    }
  }

  async submitEntry(data: any): Promise<{
    success: boolean
    message: string
    redirect: string
  }> {
    return (await $axios.post(`${this.baseurl()}/submitEntry`, data)).data
  }

  async upcomingEventList(type?: string): Promise<EventEvent[]> {
    const res = await $axios.get(`${this.baseurl()}/upcomingEventList?type_id=${type}`)
    return this.map(res.data.data)
  }
}

export { EventEvent }
