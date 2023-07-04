import { CognitoBase } from '../Cognito/Base'
import type { CognitoTermsAndConditions } from '../Cognito/TermsAndConditions'
import type { EventBloodType } from './BloodType'

class EventLicenceType extends CognitoBase {
  name: string
  price: number
  is_annual: boolean
  terms_and_conditions?: CognitoTermsAndConditions
  blood_types: EventBloodType[]

  baseurl() {
    return '/api/v1/event/licenceType'
  }

  constructor(source?: Partial<EventLicenceType>) {
    super()
    this.name = ''
    this.price = 0
    this.is_annual = false
    this.blood_types = []
    Object.assign(this, source)
  }
}

export { EventLicenceType }
