import { CognitoBase } from '../Cognito/Base'
import { CognitoImage } from '../Cognito/Image'
import { CognitoTime } from '../Cognito/Time'
import { CognitoUserDocument } from '../Cognito/UserDocument'
import type { EventCampSite } from './CampSite'
import type { EventCategory } from './Category'
import { EventDate } from './Date'
import { EventEntryFormStallPower } from './EntryForm'
import type { EventExtra } from './Extra'
import type { EventGarage } from './Garage'
import type { EventLicenceIssuer } from './LicenceIssuer'
import type { EventLicenceType } from './LicenceType'
import type { EventMerch } from './Merch'
import type { EventProduct } from './Product'
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
  calendar_content: string
  page_content: string
  venue: EventVenue
  dates: EventDate[]
  entrant_content: string
  spectator_content: string
  stallholder_content: string
  spectator_form_link: string
  merch_content: string
  entries_open_at: CognitoTime
  can_enter: boolean
  cant_enter_reason: string
  can_buy_spectator_ticket: boolean
  can_apply_stall_site: boolean
  categories: EventCategory[]
  spectator_types: EventSpectatorType[]
  stall_site_types: EventStallSiteType[]
  stall_locations: EventStallLocation[]
  stall_power_types: EventStallPowerType[]
  garage_map?: CognitoImage
  garages: EventGarage[]
  garage_hire: boolean
  only_event_entrants_can_hire_garage: boolean
  sell_multiple_garages_per_transaction: boolean
  user_has_entered_this_event: boolean
  camp_site_map?: CognitoImage
  camp_sites: EventCampSite[]
  offer_camp_sites: boolean
  camp_sites_restricted_to_entrants: boolean
  extras: EventExtra[]
  merch: EventMerch[]
  products: EventProduct[]
  licence_types: EventLicenceType[]
  last_address_id: number
  last_vehicle_id: number
  require_vehicle_photo: boolean
  require_entrant_note: boolean
  entrant_note_content: string
  race_licence_required?: EventLicenceIssuer
  aasa_licence: string
  race_licence_number: string
  race_licence_expiry: string
  user_cannot_enter_reason: string
  user_cannot_apply_stall_site_reason: string
  stall_public_liability_insurance?: CognitoUserDocument
  stall_food_licence?: CognitoUserDocument
  stall_products_and_display_description: string
  stall_company_product_overview: string
  stall_width: number
  stall_length: number
  stall_height: number
  stall_vehicle_make_and_model: string
  stall_vehicle_registration: string
  stall_power: EventEntryFormStallPower[]
  stall_not_for_profit_multiplier: number
  featured_event?: boolean
  featured_desktop_image?: CognitoImage
  featured_mobile_image?: CognitoImage
  payment_methods: {
    id: string
    name: string
    enabled: boolean
  }[]

  terms_and_conditions: string[]
  combined_terms: string

  credit_balance: number

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
    this.calendar_content = ''
    this.page_content = ''
    this.entrant_content = ''
    this.spectator_content = ''
    this.stallholder_content = ''
    this.spectator_form_link = ''
    this.merch_content = ''
    this.can_enter = false
    this.cant_enter_reason = ''
    this.can_buy_spectator_ticket = false
    this.can_apply_stall_site = false
    this.categories = []
    this.spectator_types = []
    this.stall_site_types = []
    this.stall_locations = []
    this.stall_power_types = []
    this.garages = []
    this.garage_hire = false
    this.only_event_entrants_can_hire_garage = false
    this.sell_multiple_garages_per_transaction = false
    this.user_has_entered_this_event = false
    this.camp_sites = []
    this.offer_camp_sites = false
    this.camp_sites_restricted_to_entrants = false
    this.extras = []
    this.merch = []
    this.products = []
    this.licence_types = []
    this.last_address_id = 0
    this.last_vehicle_id = 0
    this.require_vehicle_photo = false
    this.require_entrant_note = false
    this.entrant_note_content = ''
    this.aasa_licence = ''
    this.race_licence_number = ''
    this.race_licence_expiry = ''
    this.user_cannot_enter_reason = ''
    this.user_cannot_apply_stall_site_reason = ''
    this.stall_products_and_display_description = ''
    this.stall_company_product_overview = ''
    this.stall_width = 0
    this.stall_length = 0
    this.stall_height = 0
    this.stall_vehicle_make_and_model = ''
    this.stall_vehicle_registration = ''
    this.stall_power = []
    this.stall_not_for_profit_multiplier = 1
    this.payment_methods = []
    this.terms_and_conditions = []
    this.combined_terms = ''
    this.credit_balance = 0

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
    if (source?.stall_power) {
      this.stall_power = source?.stall_power.map(e => new EventEntryFormStallPower(e))
    } else {
      this.stall_power = []
    }

    this.combined_terms = this.type?.terms_and_conditions?.content
    this.terms_and_conditions.forEach((terms) => {
      this.combined_terms += terms
    })
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

  isOneDayEvent() {
    return this.start_date.toDateString() == this.end_date.toDateString()
  }

  cheapest_price() {
    if (this.spectator_types?.length) {
      const cheapest_spectator_price = this.spectator_types.reduce((min, p) => p.price < min ? p.price : min, 9999999)
      if (cheapest_spectator_price > 0) {
        return cheapest_spectator_price
      }
    }
    if (this.categories?.length) {
      const cheapest_entry_price = this.categories.reduce((min, p) => p.price < min ? p.price : min, 9999999)
      if (cheapest_entry_price > 0) {
        return cheapest_entry_price
      }
    }
    return null
  }
}

export { EventEvent }
