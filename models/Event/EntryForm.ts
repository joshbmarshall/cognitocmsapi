import type { CognitoAddress } from '../Cognito/Address'
import { EventEvent } from './Event'
import type { EventMerch } from './Merch'
import { EventVehicle } from './Vehicle'

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

class EventEntryFormExtra {
  id?: string | number
  label: string
  price: number
  checked: number
  disabled: boolean

  constructor(source?: Partial<EventEntryFormExtra>) {
    this.id = 0
    this.label = ''
    this.price = 0
    this.checked = 0
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
  disabled?: boolean

  constructor(source?: Partial<EventEntryFormRadio>) {
    this.id = 0
    this.name = ''

    Object.assign(this, source)
  }
}

class EventEntryForm {
  event_id?: string | number
  category_id: number
  stall_site_type_id: number
  address_id: number
  licence_id: number
  vehicle_id: number
  aasa_licence: string
  extras: EventEntryFormExtra[]
  spectators: EventEntryFormSpectator[]
  merch: EventEntryFormMerch[]
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
  licenceTypeRadio: EventEntryFormRadio[]
  entryCategoryRadio: EventEntryFormRadio[]
  stallSiteTypeRadio: EventEntryFormRadio[]
  vehicles: EventVehicle[]

  constructor(source?: Partial<EventEntryForm>) {
    this.event_id = 0
    this.category_id = 0
    this.stall_site_type_id = 0
    this.address_id = 0
    this.licence_id = 0
    this.vehicle_id = 0
    this.aasa_licence = ''
    this.extras = []
    this.spectators = []
    this.merch = []
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
    this.licenceTypeRadio = []
    this.entryCategoryRadio = []
    this.stallSiteTypeRadio = []
    this.vehicles = []
    Object.assign(this, source)
  }

  async loadEvent(event: string): Promise<EventEvent> {
    const data = await new EventEvent().find_one({
      url: event,
      image_width: 1920,
    })
    const eventDetails = new EventEvent(data)
    this.event_id = eventDetails.id
    this.address_id = eventDetails.last_address_id
    this.vehicle_id = eventDetails.last_vehicle_id
    this.url = location.href
    this.aasa_licence = eventDetails.aasa_licence
    this.extras = eventDetails.extras.map((e) => {
      return new EventEntryFormExtra({
        id: e.id,
        label: e.name,
        price: e.price_each,
        checked: 0,
        disabled: e.sold_out,
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
      return new EventEntryFormRadio({
        id: e.id,
        name: `${e.name} ${(e.sold_out) ? '- Sold out' : `$${e.price}`}`,
        content: `${e.entry_description}`,
        disabled: e.sold_out,
      })
    })
    this.entryCategoryRadio.push({ id: 0, name: 'Spectating Only', content: 'See below', disabled: false })

    this.licenceTypeRadio = eventDetails.licence_types.map((e) => {
      return new EventEntryFormRadio({
        id: e.id,
        name: `${e.name} $${e.price.toFixed(2)}`,
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
        name: `${e.name} ${(e.sold_out) ? '- Sold out' : `$${e.price}`}`,
        content: `${e.site_description}`,
        disabled: e.sold_out,
      })
    })
    this.vehicles = (await new EventVehicle().find_many({
      entrant_id: useUserStore().user.id,
    })).mapped

    this.eventDetails = eventDetails

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

  selectedCategory() {
    if (this.category_id == 0) {
      return null
    }
    return this.eventDetails?.categories.find(e => e.id == this.category_id)
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

  totalPrice() {
    let cost = 0
    const category = this.selectedCategory()
    const licence = this.selectedLicence()
    if (category) {
      cost += category.price
    }
    if (licence) {
      cost += licence.price
    }
    this.extras.forEach((extra) => {
      if (extra.checked) {
        cost += extra.price
      }
    })
    this.spectators.forEach((spectator) => {
      if (spectator.qty > 0) {
        cost += spectator.price * spectator.qty
      }
    })
    this.merch.forEach((merch) => {
      cost += merch.price
    })
    return cost
  }
}
export { EventEntryForm, EventEntryFormMerch, EventEntryFormRadio, EventEntryFormSpectator, EventEntryFormExtra }
