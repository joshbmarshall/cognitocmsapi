import { CognitoBase } from '../Cognito/Base'

class EventInductionType extends CognitoBase {
  name: string

  baseurl() {
    return '/api/v1/event/inductionType'
  }

  constructor(source?: Partial<EventInductionType>) {
    super()
    this.name = ''
    Object.assign(this, source)
  }
}

export { EventInductionType }
