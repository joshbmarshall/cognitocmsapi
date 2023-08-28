import { CognitoBase } from '../Cognito/Base'

class EventStallPowerType extends CognitoBase {
  name: string

  baseurl() {
    return '/api/v1/event/stallPowerType'
  }

  constructor(source?: Partial<EventStallPowerType>) {
    super()
    this.bane = ''
    Object.assign(this, source)
  }
}

export { EventStallPowerType }
