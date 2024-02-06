import { CognitoBase } from '../Cognito/Base'
import { EventLicenceIssuer } from './LicenceIssuer'

class EventEntrantLicence extends CognitoBase {
  issuer_id: number
  issuer: EventLicenceIssuer
  number: string
  expiry: string

  baseurl() {
    return '/api/v1/event/entrantLicence'
  }

  constructor(source?: Partial<EventEntrantLicence>) {
    super()
    this.issuer_id = 0
    this.issuer = new EventLicenceIssuer()
    this.number = ''
    this.expiry = ''
    Object.assign(this, source)
    if (source?.issuer) {
      this.issuer = new EventLicenceIssuer(source.issuer)
    }
  }
}

export { EventEntrantLicence }
