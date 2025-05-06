import { gql } from 'graphql-request'
import type { CognitoAddress } from '../Cognito/Address'
import { CognitoMapSite } from '../Cognito/MapSite'
import { CognitoPayment } from '../Cognito/Payment'
import type { CognitoPhoto } from '../Cognito/Photo'
import { CognitoTime } from '../Cognito/Time'
import { EventEvent } from './Event'
import type { EventMerch } from './Merch'
import type { EventProduct } from './Product'
import { EventVehicle } from './Vehicle'
import { $axios } from '~cognito/plugins/axios'

class EventEntryFormStallPower {
  id: string | number | undefined
  reason: string

  constructor(source?: Partial<EventEntryFormStallPower>) {
    this.id = 0
    this.reason = ''

    Object.assign(this, source)
  }
}

class EventEntryFormMerch {
  id: string | number | undefined
  option?: number
  name: string
  price: number

  constructor(source?: Partial<EventEntryFormMerch>) {
    this.id = 0
    this.name = ''
    this.price = 0

    Object.assign(this, source)
  }
}

class EventEntryFormSku {
  id: string | number | undefined
  name: string
  price: number

  constructor(source?: Partial<EventEntryFormSku>) {
    this.id = 0
    this.name = ''
    this.price = 0

    Object.assign(this, source)
  }
}

class EventEntryFormExtra {
  id?: string | number
  label: string
  content: string
  price: number
  checked: number
  max_qty: number
  disabled: boolean

  constructor(source?: Partial<EventEntryFormExtra>) {
    this.id = 0
    this.label = ''
    this.content = ''
    this.price = 0
    this.checked = 0
    this.max_qty = 1
    this.disabled = false

    Object.assign(this, source)
  }
}

class EventEntryFormSpectator {
  id: string | number | undefined
  label: string
  price: number
  qty: number
  qty_available: number
  disabled: boolean

  constructor(source?: Partial<EventEntryFormSpectator>) {
    this.id = 0
    this.label = ''
    this.price = 0
    this.qty = 0
    this.qty_available = 0
    this.disabled = false

    Object.assign(this, source)
  }
}

class EventEntryFormRadio {
  id: string | number | undefined
  name: string
  content?: string
  class?: string
  disabled?: boolean

  constructor(source?: Partial<EventEntryFormRadio>) {
    this.id = 0
    this.name = ''

    Object.assign(this, source)
  }
}

class EventEntryForm {
  payment_options: {
    id: string
    value: string
  }[]

  payment_gateway: string
  first_name: string
  last_name: string
  email: string
  mobile_phone: string
  ambassadorCode?: string
  event_id?: string | number
  category_id: number
  address_id: number
  garage_id: number
  garage_ids: number[]
  camp_site_id: number
  camp_site_ids: number[]
  licence_id: number
  vehicle_id: number
  aasa_licence: string
  race_licence_number: string
  race_licence_expiry: string
  expected_time?: number
  sharing_vehicle_with?: string
  entrant_note?: string
  extras: EventEntryFormExtra[]
  spectators: EventEntryFormSpectator[]
  merch: EventEntryFormMerch[]
  skus: EventEntryFormSku[]
  url: string
  entry_transfer_from_invoice: number
  entry_transfer_from_name: string
  blood_type_id: number
  date_of_last_tetanus_vaccination: string
  has_allergies: boolean
  has_had_psychiatric_psychological_illness: boolean
  has_had_brain_injury: boolean
  has_had_heart_issues: boolean
  has_had_cancer_diabeties: boolean
  has_had_significant_illness_or_injury: boolean
  is_on_medication: boolean
  has_hearing_impairment: boolean
  has_hearing_disorder: boolean
  is_normal_eyesight: boolean
  date_of_last_medical_exam: string
  eventDetails?: EventEvent
  garageTypeMap: CognitoMapSite[]
  garageTypeRadio: EventEntryFormRadio[]
  campSiteTypeMap: CognitoMapSite[]
  campSiteTypeRadio: EventEntryFormRadio[]
  licenceTypeRadio: EventEntryFormRadio[]
  entryCategoryRadio: EventEntryFormRadio[]
  stallSiteTypeRadio: EventEntryFormRadio[]
  stallSiteLocationRadio: EventEntryFormRadio[]
  vehicles: EventVehicle[]
  stall_site_type_id: number
  stall_site_location_id: number
  stall_site_preferred_location: string
  stall_products_and_display_description: string
  stall_company_product_overview: string
  stall_width: number
  stall_length: number
  stall_height: number
  stall_vehicle_make_and_model: string
  stall_vehicle_registration: string
  stall_public_liability_insurance_file: string
  stall_public_liability_insurance_expiry: string
  stall_public_liability_insurance_use_ours: boolean
  stall_public_liability_insurance_will_update_on_renewal: boolean
  stall_food_licence_will_update_on_renewal: boolean
  stall_food_licence_file: string
  stall_food_licence_expiry: string
  stall_power: EventEntryFormStallPower[]
  stall_photos: CognitoPhoto[]
  stall_not_for_profit: boolean
  stall_not_for_profit_number: string

  constructor(source?: Partial<EventEntryForm>) {
    this.first_name = ''
    this.last_name = ''
    this.email = ''
    this.mobile_phone = ''
    this.payment_options = []
    this.payment_gateway = ''
    this.event_id = 0
    this.category_id = 0
    this.address_id = 0
    this.garage_id = 0
    this.garage_ids = []
    this.camp_site_id = 0
    this.camp_site_ids = []
    this.licence_id = 0
    this.vehicle_id = 0
    this.aasa_licence = ''
    this.race_licence_number = ''
    this.race_licence_expiry = ''
    this.extras = []
    this.spectators = []
    this.merch = []
    this.skus = []
    this.url = ''
    this.entry_transfer_from_invoice = 0
    this.entry_transfer_from_name = ''
    this.blood_type_id = 0
    this.date_of_last_tetanus_vaccination = ''
    this.has_allergies = false
    this.has_had_psychiatric_psychological_illness = false
    this.has_had_brain_injury = false
    this.has_had_heart_issues = false
    this.has_had_cancer_diabeties = false
    this.has_had_significant_illness_or_injury = false
    this.is_on_medication = false
    this.has_hearing_impairment = false
    this.has_hearing_disorder = false
    this.is_normal_eyesight = false
    this.date_of_last_medical_exam = ''
    this.garageTypeMap = []
    this.garageTypeRadio = []
    this.campSiteTypeMap = []
    this.campSiteTypeRadio = []
    this.licenceTypeRadio = []
    this.entryCategoryRadio = []
    this.stallSiteTypeRadio = []
    this.stallSiteLocationRadio = []
    this.stall_site_type_id = 0
    this.stall_site_location_id = 0
    this.stall_power = []
    this.vehicles = []
    this.stall_site_preferred_location = ''
    this.stall_products_and_display_description = ''
    this.stall_company_product_overview = ''
    this.stall_width = 0
    this.stall_length = 0
    this.stall_height = 0
    this.stall_vehicle_make_and_model = ''
    this.stall_vehicle_registration = ''
    this.stall_public_liability_insurance_file = ''
    this.stall_public_liability_insurance_expiry = ''
    this.stall_public_liability_insurance_use_ours = false
    this.stall_public_liability_insurance_will_update_on_renewal = false
    this.stall_food_licence_will_update_on_renewal = false
    this.stall_food_licence_file = ''
    this.stall_food_licence_expiry = ''
    this.stall_photos = []
    this.stall_not_for_profit = false
    this.stall_not_for_profit_number = ''
    Object.assign(this, source)
  }

  prefillFromUser() {
    const user = useUserStore().user
    if (user) {
      this.first_name = user.first_name
      this.last_name = user.last_name
      this.email = user.email
      this.mobile_phone = user.mobile_phone
    }
    if (typeof (location) != 'undefined') {
      this.url = location.href
    }
  }

  async loadEvent(event: string): Promise<EventEvent> {
    this.prefillFromUser()
    const data = await new EventEvent().find_one({
      url: event,
      image_width: 1920,
    })
    const eventDetails = new EventEvent(data)
    this.payment_gateway = eventDetails.payment_methods[0]?.id
    this.event_id = eventDetails.id
    this.address_id = eventDetails.last_address_id
    this.vehicle_id = eventDetails.last_vehicle_id
    this.aasa_licence = eventDetails.aasa_licence
    if (eventDetails.race_licence_number) {
      this.race_licence_number = eventDetails.race_licence_number
      this.race_licence_expiry = eventDetails.race_licence_expiry
    } else if (eventDetails.race_licence_required?.name == 'RACERS') {
      // Load licence details from RACERS
      const licenceDetails = await $axios.graphql(gql`query ($eventId: ID) {
        eventEvent(id: $eventId) {
          racers_licence_check {
            racers_number
            valid
            is_annual
            expiry_date
            disqualified
          }
        }
      }`, {
        eventId: this.event_id,
      })
      if (licenceDetails?.eventEvent?.racers_licence_check) {
        this.race_licence_number = licenceDetails.eventEvent.racers_licence_check.racers_number
        this.race_licence_expiry = licenceDetails.eventEvent.racers_licence_check.expiry_date
      }
    }
    this.extras = eventDetails.extras.map((e) => {
      return new EventEntryFormExtra({
        id: e.id,
        label: e.name,
        content: e.content,
        price: e.price_each,
        checked: 0,
        disabled: e.sold_out,
        max_qty: e.max_qty_per_entry,
      })
    })
    this.spectators = eventDetails.spectator_types.map((e) => {
      return new EventEntryFormSpectator({
        id: e.id,
        label: `${e.name}`,
        price: e.price,
        qty: 0,
        qty_available: e.qty_available,
        disabled: e.sold_out,
      })
    })
    this.entryCategoryRadio = eventDetails.categories.map((e) => {
      let name = e.name
      if (e.sold_out) {
        name += ' - Sold out'
      } else if (e.cannot_enter_reason) {
        name += ` - ${e.cannot_enter_reason}`
      } else {
        name += ` $${e.price}`
      }
      return new EventEntryFormRadio({
        id: e.id,
        name,
        class: e.sold_out ? 'text-danger-500' : '',
        content: `${e.entry_description}`,
        disabled: e.sold_out || e.cannot_enter_reason.length > 0,
      })
    })
    if (eventDetails.spectator_types.length > 0) {
      this.entryCategoryRadio.push({ id: 0, name: 'Spectating Only', content: 'See below', disabled: false })
    } else {
      this.entryCategoryRadio.push({ id: 0, name: 'Not Entering', content: 'Choose from other options below', disabled: false })
    }

    this.licenceTypeRadio = eventDetails.licence_types.map((e) => {
      return new EventEntryFormRadio({
        id: e.id,
        name: `${e.name} $${e.price.toFixed(2)}`,
        content: e.content,
      })
    })
    this.licenceTypeRadio.push(new EventEntryFormRadio({
      id: 0,
      name: 'No Licence',
      content: 'I do not need to purchase a licence',
      disabled: false,
    }))

    this.stallSiteTypeRadio = eventDetails.stall_site_types.map((e) => {
      return new EventEntryFormRadio({
        id: e.id,
        name: `${e.name} ${(e.sold_out) ? '- Sold out' : ''}`,
        class: e.sold_out ? 'text-danger-500' : '',
        content: `${e.site_description}`,
        disabled: e.sold_out,
      })
    })
    this.stallSiteLocationRadio = eventDetails.stall_locations.map((e) => {
      return new EventEntryFormRadio({
        id: e.id,
        name: e.name,
        content: '',
      })
    })
    this.vehicles = (await new EventVehicle().find_many({
      entrant_id: useUserStore().user.id,
    })).mapped

    this.stall_products_and_display_description = eventDetails.stall_products_and_display_description
    this.stall_company_product_overview = eventDetails.stall_company_product_overview
    this.stall_width = eventDetails.stall_width
    this.stall_length = eventDetails.stall_length
    this.stall_height = eventDetails.stall_height
    this.stall_vehicle_make_and_model = eventDetails.stall_vehicle_make_and_model
    this.stall_vehicle_registration = eventDetails.stall_vehicle_registration
    this.stall_power = eventDetails.stall_power

    this.eventDetails = eventDetails
    this.calculateGarageTypeRadio({})

    return eventDetails
  }

  addMerchToOrder(merch: EventMerch) {
    const option = merch.options.find(e => e.id == merch.selectedOption)
    let price = merch.price_each
    let name = merch.name
    if (option) {
      if (option.price_each > 0) {
        price = option.price_each
      }
      name += ` ${option.name}`
    }
    this.merch.unshift({
      id: merch.id,
      option: merch.selectedOption,
      name,
      price,
    })
  }

  addProductToOrder(product: EventProduct) {
    const option = product.options.find(e => e.id == product.selectedOption)
    if (!option) {
      return false
    }
    const price = option?.price
    const name = `${product.name} ${option.name}`
    this.skus.unshift({
      id: option.id,
      name,
      price,
    })
  }

  selectedCategory() {
    if (this.category_id == 0) {
      return null
    }
    return this.eventDetails?.categories.find(e => e.id == this.category_id)
  }

  selectedGarage() {
    if (this.garage_id == 0) {
      return null
    }
    return this.eventDetails?.garages.find(e => e.id == this.garage_id)
  }

  selectedGaragesCost() {
    let cost = 0
    for (let index = 0; index < this.garage_id.length; index++) {
      const garage_id = this.garage_id[index]
      cost += this.eventDetails?.garages.find(e => e.id == garage_id)?.price
    }
    return cost
  }

  selectedCampSite() {
    if (this.camp_site_id == 0) {
      return null
    }
    return this.eventDetails?.camp_sites.find(e => e.id == this.camp_site_id)
  }

  selectedLicence() {
    if (this.licence_id == 0) {
      return null
    }
    return this.eventDetails?.licence_types.find(e => e.id == this.licence_id)
  }

  selectedAddress(addresses: CognitoAddress[]) {
    if (this.address_id == 0) {
      return null
    }
    return addresses.find(e => e.id == this.address_id)
  }

  selectedVehicle() {
    if (this.vehicle_id == 0) {
      return null
    }
    return this.vehicles.find(e => e.id == this.vehicle_id)
  }

  raceLicenceName() {
    if (this.eventDetails?.race_licence_required) {
      return `${this.eventDetails.race_licence_required.name} Licence Number`
    }
    return 'Race Licence Number'
  }

  showLicencePurchase() {
    // Only if the event requires it
    if (!this.eventDetails?.race_licence_required) {
      return false
    }
    const category = this.selectedCategory()
    if (category && category.no_race_licence_required) {
      return false
    }
    if (this.category_id > -1) {
      return true
    }
    return false
  }

  calculateGarageTypeRadio({ show_booked_by = false, price_included_in_entry = false }) {
    if (!this.eventDetails) {
      return []
    }

    this.garageTypeRadio = this.eventDetails.garages.map((e) => {
      let name = `${e.type} ${e.name}`
      if (e.available) {
        if (!price_included_in_entry) {
          name += ` - $${e.price.toFixed(2)}`
        }
      } else {
        if (show_booked_by) {
          name += ` - ${e.booked_by}`
        } else {
          name += ' - Unavailable'
        }
      }
      return new EventEntryFormRadio({
        id: e.id,
        name,
        disabled: !e.available,
      })
    })
  }

  calculateGarageTypeMap({ show_booked_by = false, price_included_in_entry = false, disabled_types = [] }) {
    if (!this.eventDetails) {
      return []
    }

    this.garageTypeMap = this.eventDetails.garages.map((e) => {
      let name = `${e.type} ${e.name}`
      const available = e.available && !disabled_types.includes(e.type_id)
      if (available) {
        if (!price_included_in_entry) {
          name += ` - $${e.price.toFixed(2)}`
        }
      } else {
        if (show_booked_by) {
          name += ` - ${e.booked_by}`
        } else {
          name += ' - Unavailable'
        }
      }
      const site = new CognitoMapSite(e.map_site)
      site.id = `${e.id}`
      site.available = available
      site.hoverText = name
      return site
    })
  }

  calculateCampSiteTypeRadio({ show_booked_by = false, price_included_in_entry = false }) {
    if (!this.eventDetails) {
      return []
    }

    this.campSiteTypeRadio = this.eventDetails.camp_sites.map((e) => {
      let name = `${e.type} ${e.name}`
      if (e.available) {
        if (!price_included_in_entry) {
          name += ` - $${e.price.toFixed(2)}`
        }
      } else {
        if (show_booked_by) {
          name += ` - ${e.booked_by}`
        } else {
          name += ' - Unavailable'
        }
      }
      return new EventEntryFormRadio({
        id: e.id,
        name,
        disabled: !e.available,
      })
    })
  }

  calculateCampSiteTypeMap({ show_booked_by = false, price_included_in_entry = false }) {
    if (!this.eventDetails) {
      return []
    }

    this.campSiteTypeMap = this.eventDetails.camp_sites.map((e) => {
      let name = `${e.type} ${e.name}`
      if (e.available) {
        if (!price_included_in_entry) {
          name += ` - $${e.price.toFixed(2)}`
        }
      } else {
        if (show_booked_by) {
          name += ` - ${e.booked_by}`
        } else {
          name += ' - Unavailable'
        }
      }
      const site = new CognitoMapSite(e.map_site)
      site.id = `${e.id}`
      site.available = e.available
      site.hoverText = name
      return site
    })
  }

  calculateCanHireGarage({ category = 0 }): boolean {
    if (!this.eventDetails) {
      return false
    }
    if (!this.eventDetails.garage_hire) {
      return false
    }
    if (this.eventDetails.garages.length == 0) {
      return false
    }
    if (category > 0) {
      return true
    }
    if (this.eventDetails.only_event_entrants_can_hire_garage && !this.eventDetails.user_has_entered_this_event) {
      return false
    }
    return true
  }

  totalPrice() {
    let cost = 0
    const category = this.selectedCategory()
    const licence = this.selectedLicence()
    const garage = this.selectedGarage()
    const campSite = this.selectedCampSite()

    if (category) {
      cost += category.price
    }
    if (licence) {
      if (!category?.race_licence_included_in_entry_fee) {
        cost += licence.price
      }
    }
    if (this.eventDetails?.sell_multiple_garages_per_transaction) {
      this.garage_ids.forEach((garage_id) => {
        const garage = this.eventDetails?.garages.find(e => e.id == garage_id)
        if (garage) {
          cost += garage.price
        }
      })
    } else {
      if (garage) {
        if (category && category.garage_included_in_entry_fee) {
        // No additional cost
        } else {
          cost += garage.price
        }
      }
    }
    if (campSite) {
      cost += campSite.price
    }
    this.extras.forEach((extra) => {
      if (extra.checked) {
        cost += extra.price * extra.checked
      }
    })
    this.spectators.forEach((spectator) => {
      if (spectator.qty > 0) {
        cost += spectator.price * spectator.qty
      }
    })
    this.camp_site_ids.forEach((camp_site_id) => {
      const camp_site = this.eventDetails?.camp_sites.find(e => e.id == camp_site_id)
      if (camp_site) {
        cost += camp_site.price
      }
    })
    this.merch.forEach((merch) => {
      cost += merch.price
    })
    this.skus.forEach((sku) => {
      cost += sku.price
    })
    return cost
  }

  selectedStallSiteType() {
    return this.eventDetails?.stall_site_types.find(e => e.id == this.stall_site_type_id)
  }

  stall_area() {
    return (this.stall_width) * this.stall_length
  }

  stallAreaOk(): boolean {
    const selectedStallSiteType = this.selectedStallSiteType()
    if (!selectedStallSiteType) {
      return false
    }
    if (selectedStallSiteType.min_site_depth && this.stall_length < selectedStallSiteType.min_site_depth) {
      return false
    }
    if (selectedStallSiteType.max_site_depth && this.stall_length > selectedStallSiteType.max_site_depth) {
      return false
    }
    if (selectedStallSiteType.min_site_width && this.stall_width < selectedStallSiteType.min_site_width) {
      return false
    }
    if (selectedStallSiteType.max_site_width && this.stall_width > selectedStallSiteType.max_site_width) {
      return false
    }
    if (selectedStallSiteType.max_site_area && this.stall_area() > selectedStallSiteType.max_site_area) {
      return false
    }
    return this.stall_area() > 0
  }

  stallNFPHireAmount(amount: number) {
    if (this.stall_not_for_profit && this.stall_not_for_profit_number) {
      return amount * (this.eventDetails?.stall_not_for_profit_multiplier || 1)
    }
    return amount
  }

  stallHirePrice() {
    const area = this.stall_length * this.stall_width

    const selectedStallSiteType = this.selectedStallSiteType()
    if (!selectedStallSiteType) {
      return 0
    }

    let power_price = 0
    if (this.stall_power.length > selectedStallSiteType.included_power_connections) {
      power_price += selectedStallSiteType.additional_power_connection * (this.stall_power.length - selectedStallSiteType.included_power_connections)
    }

    if (!selectedStallSiteType.price_tiers.length) {
      return power_price + this.stallNFPHireAmount(selectedStallSiteType.price)
    }
    // Determine price from tiers
    for (let index = 0; index < selectedStallSiteType.price_tiers.length; index++) {
      const price_tier = selectedStallSiteType.price_tiers[index]
      if (price_tier.maximum_area >= area) {
        return power_price + this.stallNFPHireAmount(price_tier.base_price + (area - price_tier.base_area) * price_tier.price_per_square_metre)
      }
    }
    return power_price + 0
  }

  async calculatedPrice(): Promise<{
    total: number
    payable: number
    surcharges: {
      type: string
      surcharge: number
      amount: number
    }[]
  }> {
    const total = this.totalPrice()
    let payable = total

    if (this.eventDetails?.credit_balance) {
      payable -= this.eventDetails.credit_balance
      if (payable < 0) {
        payable = 0
      }
    }
    const surcharges = await new CognitoPayment().paymentSurchargesOf(payable)

    return {
      total,
      surcharges: surcharges.map((e) => {
        return {
          type: e.type,
          surcharge: e.surcharge,
          amount: payable + e.surcharge,
        }
      }),
      payable,
    }
  }

  race_licence_expired_by_event(): boolean {
    return !!this.eventDetails?.start_date.isAfter(new CognitoTime(this.race_licence_expiry))
  }

  licenceTypeOptions(freelicence: boolean) {
    if (!this.eventDetails) {
      return []
    }
    const options = this.eventDetails.licence_types.map((e) => {
      let name = e.name
      if (!freelicence) {
        name += ` $${e.price.toFixed(2)}`
      }
      return new EventEntryFormRadio({
        id: e.id,
        name,
        content: e.content,
      })
    })
    options.push(new EventEntryFormRadio({
      id: 0,
      name: 'No Licence',
      content: 'I do not need to purchase a licence',
      disabled: false,
    }))
    return options
  }

  stallSitesForLocation(location_id: number) {
    const stall_site_ids = this.eventDetails?.stall_site_types.filter(e => e.location_ids.includes(location_id) || e.location_ids.length == 0).map(e => e.id)
    return stall_site_ids
  }
}
export { EventEntryForm, EventEntryFormMerch, EventEntryFormRadio, EventEntryFormSpectator, EventEntryFormExtra, EventEntryFormStallPower }
