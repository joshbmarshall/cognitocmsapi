import { $axios } from '~cognito/plugins/axios'

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
  constructor() {
    this.id = 0
    this.type_id = 0
    this.name = ''
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

export { CaravanPriceQuote }
