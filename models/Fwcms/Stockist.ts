import { CognitoBase } from '../Cognito/Base'

class FwcmsStockist extends CognitoBase {
  name: string
  address_line_1: string
  address_line_2: string
  suburb: string
  postcode: string
  state: string
  country: string
  website: string
  email: string
  phone: string
  map_url: string

  baseurl(): string {
    return '/api/v1/fwcms/stockist'
  }

  constructor(source?: Partial<FwcmsStockist>) {
    super()
    this.name = ''
    this.address_line_1 = ''
    this.address_line_2 = ''
    this.suburb = ''
    this.postcode = ''
    this.state = ''
    this.country = ''
    this.website = ''
    this.email = ''
    this.phone = ''
    this.map_url = ''
    Object.assign(this, source)
  }
}

export { FwcmsStockist }
