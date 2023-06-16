import { CognitoBase } from '../Cognito/Base'
import { CognitoImage } from '../Cognito/Image'
import { CognitoTermsAndConditions } from '../Cognito/TermsAndConditions'

class EventType extends CognitoBase {
  name: string
  entrant_content: string
  spectator_content: string
  terms_and_conditions: CognitoTermsAndConditions
  photo: CognitoImage

  baseurl() {
    return '/api/v1/event/type'
  }

  constructor(source?: Partial<EventType>) {
    super()
    this.name = ''
    this.entrant_content = ''
    this.spectator_content = ''
    this.terms_and_conditions = new CognitoTermsAndConditions()
    this.photo = new CognitoImage()
    Object.assign(this, source)
  }
}

export { EventType }
