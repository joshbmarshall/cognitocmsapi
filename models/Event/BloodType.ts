import { CognitoBase } from '../Cognito/Base'

class EventBloodType extends CognitoBase {
  name: string

  baseurl() {
    return '/api/v1/event/bloodType'
  }

  constructor(source?: Partial<EventBloodType>) {
    super()
    this.name = ''
    Object.assign(this, source)
  }
}

export { EventBloodType }
