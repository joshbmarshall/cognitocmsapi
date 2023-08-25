import { CognitoBase } from '../Cognito/Base'

class EventStallSitePower extends CognitoBase {
  site_id: number
  power_type_id: number
  reason: string

  baseurl() {
    return '/api/v1/event/stallSitePower'
  }

  constructor(source?: Partial<EventStallSitePower>) {
    super()
    this.site_id = 0
    this.power_type_id = 0
    this.reason = ''
    Object.assign(this, source)
  }
}

export { EventStallSitePower }
