import { isAfter, parse, subYears } from 'date-fns'
import { CognitoAddressLookup } from '~cognito/models/Cognito/AddressLookup'
import { CognitoBase } from '~cognito/models/Cognito/Base'
import { CognitoImage } from '~cognito/models/Cognito/Image'
import { $axios } from '~cognito/plugins/axios'

class SignonSignOn extends CognitoBase {
  first_name: string
  last_name: string
  date_of_birth: string
  type_id: number
  phone: string
  email: string
  address: CognitoAddressLookup
  emergency_contact: string
  emergency_contact_phone: string
  photo: string
  signature: string
  adult_name: string
  adult_relationship: string
  adult_phone: string
  adult_email: string
  adult_address: CognitoAddressLookup
  adult_photo: string
  adult_signature: string
  extra_term_ids: number[]
  extra_details: string
  armband_colour: string
  already_signed_on: boolean
  indemnity_ids: number[]

  baseurl() {
    return '/api/v1/signon/signOn'
  }

  constructor(source?: Partial<SignonSignOn>) {
    super()
    this.first_name = ''
    this.last_name = ''
    this.date_of_birth = ''
    this.type_id = 0
    this.phone = ''
    this.email = ''
    this.address = new CognitoAddressLookup()
    this.emergency_contact = ''
    this.emergency_contact_phone = ''
    this.photo = ''
    this.signature = ''
    this.adult_name = ''
    this.adult_relationship = ''
    this.adult_phone = ''
    this.adult_email = ''
    this.adult_address = new CognitoAddressLookup()
    this.adult_photo = ''
    this.adult_signature = ''
    this.extra_term_ids = []
    this.extra_details = ''
    this.armband_colour = '#ffffff'
    this.already_signed_on = false
    this.indemnity_ids = []
    Object.assign(this, source)
  }

  isMinor(): boolean {
    if (this.date_of_birth) {
      const date = parse(this.date_of_birth, 'dd/mm/yyyy', new Date())
      if (isAfter(date, subYears(new Date(), 18))) {
      // Is a minor as under 18 years
        return true
      }
    }
    return false
  }

  async getStaffSignons(order: string): Promise<{
    num_items: number
    num_pages: number
    data: SignonStaffSignOnResults[]
  }> {
    const res = await $axios.post(`${this.baseurl()}/staffSignonList`, {
      order,
    })
    return res.data
  }
}

class SignonStaffSignOnResults extends CognitoBase {
  photo: CognitoImage
  signature: CognitoImage
  name: string
  adult_name: string
  adult_relationship: string
  adult_photo: CognitoImage
  adult_signature: CognitoImage
  extra_details: string
  armband_colour: string
  created_at: string

  baseurl() {
    return '/api/v1/signon/signOn'
  }

  constructor(source?: Partial<SignonStaffSignOnResults>) {
    super()
    this.photo = new CognitoImage()
    this.signature = new CognitoImage()
    this.name = ''
    this.adult_name = ''
    this.adult_relationship = ''
    this.adult_photo = new CognitoImage()
    this.adult_signature = new CognitoImage()
    this.extra_details = ''
    this.armband_colour = '#ffffff'
    this.created_at = ''
    Object.assign(this, source)
  }

  async confirmApprove(): Promise<boolean> {
    const res = await $axios.post(`${this.baseurl()}/staffSignonApprove`, {
      id: this.id,
    })
    return res.data.success
  }

  async confirmDelete(): Promise<boolean> {
    const res = await $axios.post(`${this.baseurl()}/staffSignonDelete`, {
      id: this.id,
    })
    return res.data.success
  }
}
export { SignonSignOn, SignonStaffSignOnResults }
