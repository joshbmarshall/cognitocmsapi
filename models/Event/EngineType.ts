import { CognitoBase } from '../Cognito/Base'

class EventEngineType extends CognitoBase {
  name: string

  baseurl() {
    return '/api/v1/event/engineType'
  }

  constructor(source?: Partial<EventEngineType>) {
    super()
    this.name = ''
    Object.assign(this, source)
  }
}

export { EventEngineType }
