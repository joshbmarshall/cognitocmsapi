import { CognitoBase } from '../Cognito/Base'

class EventStallLocation extends CognitoBase {
  name: string

  baseurl() {
    return '/api/v1/event/stallLocation'
  }

  constructor(source?: Partial<EventStallLocation>) {
    super()
    this.name = ''
    Object.assign(this, source)
  }
}

export { EventStallLocation }
