import { CognitoBase } from '../Cognito/Base'

class EventLicenceIssuer extends CognitoBase {
  name: string

  baseurl() {
    return '/api/v1/event/licenceIssuer'
  }

  constructor(source?: Partial<EventLicenceIssuer>) {
    super()
    this.name = ''
    Object.assign(this, source)
  }
}

export { EventLicenceIssuer }
