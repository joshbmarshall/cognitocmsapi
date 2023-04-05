import { CognitoBase } from '../Cognito/Base'
import type { CaravanBookingPersonQty } from './BookingPersonQty'
import { $axios } from '~cognito/plugins/axios'

class CaravanBooking extends CognitoBase {
  first_name: string
  last_name: string
  email: string
  phone: string
  suburb: string
  state: string
  registration: string
  car_registration: string
  caravan_length: number
  check_in: string
  check_out: string
  site_type_id: number
  site_id: number
  est_arrival_time: string
  people: CaravanBookingPersonQty[]

  baseurl() {
    return '/api/v1/caravan/booking'
  }

  constructor(source?: Partial<CaravanBooking>) {
    super()
    this.first_name = ''
    this.last_name = ''
    this.email = ''
    this.phone = ''
    this.suburb = ''
    this.state = ''
    this.registration = ''
    this.car_registration = ''
    this.caravan_length = 0
    this.check_in = ''
    this.check_out = ''
    this.site_type_id = 0
    this.site_id = 0
    this.est_arrival_time = ''
    this.people = []
    Object.assign(this, source)
  }

  async payNow(data: any): Promise<{
    success: boolean
    message: string
    redirect: string
  }> {
    data.url = btoa(window.location)
    return (await $axios.post('/api/v1/caravan/booking/payNow', data)).data
  }

  async getInvoice(payment: number): Promise<{
    invoiceText: string
  }> {
    return (await $axios.post('/api/v1/caravan/booking/invoiceText', {
      payment,
    })).data
  }
}

export { CaravanBooking }
