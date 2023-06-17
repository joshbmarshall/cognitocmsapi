import { CognitoBase } from './Base'

class CognitoAddress extends CognitoBase {
  user_id?: number
  street_address: string
  street_number: string
  street_name: string
  unit: string
  suburb_id: number
  suburb_name: string
  state: string
  postcode: string
  country: string

  baseurl() {
    return '/api/v1/cognito/address'
  }

  constructor(source?: Partial<CognitoAddress>) {
    super()
    this.street_address = ''
    this.street_number = ''
    this.street_name = ''
    this.unit = ''
    this.suburb_id = 0
    this.suburb_name = ''
    this.state = ''
    this.postcode = ''
    this.country = ''
    Object.assign(this, source)
  }
}

export { CognitoAddress }
