import { $axios } from '~cognito/plugins/axios'

class SellAddress {
  id: number
  display_name: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  street_address: string
  street_address_1: string
  postcode: string
  city: string
  state: string
  country: string

  constructor(source?: Partial<SellAddress>) {
    this.id = 0
    this.display_name = ''
    this.first_name = ''
    this.last_name = ''
    this.email = ''
    this.phone = ''
    this.company = ''
    this.street_address = ''
    this.street_address_1 = ''
    this.postcode = ''
    this.city = ''
    this.state = ''
    this.country = ''
    Object.assign(this, source)
  }

  async find_many(): Promise<{
    num_items: number
    num_pages: number
    data: SellAddress[]
  }> {
    const res = await $axios.get('/api/v1/sell/address')
    return res.data
  }

  async enable(): Promise<{
    success: boolean
    message: string
  }> {
    const res = await $axios.post('/api/v1/sell/address/enable', {
      id: this.id,
    })
    return res.data
  }

  async disable(): Promise<{
    success: boolean
    message: string
  }> {
    const res = await $axios.post('/api/v1/sell/address/disable', {
      id: this.id,
    })
    return res.data
  }

  async create(): Promise<{
    success: boolean
    item: SellAddress
    error: string
  }> {
    const res = await $axios.post('/api/v1/sell/address/create', this)
    return res.data
  }
}

export { SellAddress }
