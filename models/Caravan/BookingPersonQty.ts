import { CognitoBase } from '../Cognito/Base'

class CaravanBookingPersonQty extends CognitoBase {
  booking_id: number
  person_type_id: number
  qty: number

  baseurl() {
    return '/api/v1/caravan/bookingPersonQty'
  }

  constructor(source?: Partial<CaravanBookingPersonQty>) {
    super()
    this.booking_id = 0
    this.person_type_id = 0
    this.qty = 0
    Object.assign(this, source)
  }
}

export { CaravanBookingPersonQty }
