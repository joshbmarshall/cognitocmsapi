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
  require_new_vehicle_photo_every_entry: boolean
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
    this.require_new_vehicle_photo_every_entry = true
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
    const res = await useGql(graphql(`mutation($entry: eventSubmitEntryArgs!) {
      eventSubmitEntry(entry: $entry) {
        success
        message
        redirect
      }
    }`), {
      entry: {
        event_id: data.event_id,
        category_id: data.category_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        mobile_phone: data.mobile_phone,
        postcode: data.postcode,
        vehicle_id: data.vehicle_id,
        new_vehicle_photo: data.new_vehicle_photo,
        address_id: data.address_id,
        garage_id: data.garage_id,
        garage_ids: data.garage_ids,
        camp_site_id: data.camp_site_id,
        camp_site_ids: data.camp_site_ids,
        licence_id: data.licence_id,
        race_licence_number: data.race_licence_number,
        race_licence_expiry: data.race_licence_expiry,
        expected_time: data.expected_time,
        sharing_vehicle_with: data.sharing_vehicle_with,
        entrant_note: data.entrant_note,
        entry_transfer_from_invoice: Number.parseInt(`${data.entry_transfer_from_invoice}`),
        blood_type_id: data.blood_type_id,
        date_of_last_tetanus_vaccination: data.date_of_last_tetanus_vaccination,
        has_allergies: data.has_allergies,
        has_had_psychiatric_psychological_illness: data.has_had_psychiatric_psychological_illness,
        has_had_brain_injury: data.has_had_brain_injury,
        has_had_heart_issues: data.has_had_heart_issues,
        has_had_cancer_diabeties: data.has_had_cancer_diabeties,
        has_had_significant_illness_or_injury: data.has_had_significant_illness_or_injury,
        is_on_medication: data.is_on_medication,
        has_hearing_impairment: data.has_hearing_impairment,
        has_hearing_disorder: data.has_hearing_disorder,
        is_normal_eyesight: data.is_normal_eyesight,
        date_of_last_medical_exam: data.date_of_last_medical_exam,
        ambassadorCode: data.ambassadorCode,
        stall_site_type_id: data.stall_site_type_id,
        stall_products_and_display_description: data.stall_products_and_display_description,
        stall_width: Number.parseFloat(data.stall_width),
        stall_length: Number.parseFloat(data.stall_length),
        stall_height: Number.parseFloat(data.stall_height),
        stall_vehicle_make_and_model: data.stall_vehicle_make_and_model,
        stall_vehicle_registration: data.stall_vehicle_registration,
        stall_public_liability_insurance_file: data.stall_public_liability_insurance_file,
        stall_public_liability_insurance_expiry: data.stall_public_liability_insurance_expiry,
        stall_public_liability_insurance_will_update_on_renewal: !!data.stall_public_liability_insurance_will_update_on_renewal,
        stall_public_liability_insurance_use_ours: data.stall_public_liability_insurance_use_ours,
        stall_food_licence_file: data.stall_food_licence_file,
        stall_food_licence_expiry: data.stall_food_licence_expiry,
        stall_food_licence_will_update_on_renewal: data.stall_food_licence_will_update_on_renewal,
        add_to_newsletter: !!data.add_to_newsletter,
        payment_gateway: data.payment_gateway,
        url: data.url,
        extras: data.extras.map(extra => ({
          id: extra.id,
          label: extra.label,
          qty: extra.checked ? 1 : 0,
        })),
        spectators: data.spectators.map(spectator => ({
          id: spectator.id,
          label: spectator.label,
          qty: Number.parseInt(spectator.qty),
        })),
        raffleTickets: data.raffleTickets.map(ticket => ({
          id: ticket.id,
          label: ticket.label,
          qty: Number.parseInt(ticket.qty),
        })),
        merch: data.merch.map(merch => ({
          id: merch.id,
          name: merch.name,
          option: Number.parseInt(merch.option),
        })),
        skus: data.skus.map(sku => ({
          id: sku.id,
          name: sku.name,
        })),
      },
    })
    return res.eventSubmitEntry
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
