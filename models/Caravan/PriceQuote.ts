import { $axios } from '~cognito/plugins/axios'

class CaravanQuoteFormPerson {
  name: string
  type: number
  min_qty: number
  qty: number
  constructor() {
    this.name = ''
    this.type = 0
    this.min_qty = 0
    this.qty = 0
  }
}

class CaravanQuoteForm {
  from_date: string
  to_date: string
  caravan_length: number
  people: CaravanQuoteFormPerson[]
  constructor() {
    this.from_date = ''
    this.to_date = ''
    this.caravan_length = 0
    this.people = []
  }
}

class CaravanBookForm {
  first_name: string
  constructor() {
    this.first_name = ''
  }
}

class CaravanPrice {
  site_type_id: number
  site_type_name: string
  amount: number
  constructor() {
    this.site_type_id = 0
    this.site_type_name = ''
    this.amount = 0
  }
}

class CaravanQuoteSite {
  id: number
  type_id: number
  name: string
  is_closed: boolean
  constructor() {
    this.id = 0
    this.type_id = 0
    this.name = ''
    this.is_closed = false
  }
}

class CaravanPriceQuote {
  prices: CaravanPrice[]
  available_sites: CaravanQuoteSite[]

  constructor() {
    this.prices = []
    this.available_sites = []
  }

  async searchAvailability(data: any): Promise<CaravanPriceQuote> {
    return (await $axios.post('/api/v1/caravan/price/searchAvailability', data)).data
  }
}

export { CaravanPriceQuote, CaravanQuoteForm, CaravanBookForm }
