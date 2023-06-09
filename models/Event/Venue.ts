import { CognitoBase } from '../Cognito/Base'
import { CognitoImage } from '../Cognito/Image'

class EventVenue extends CognitoBase {
  name: string
  url: string
  photo: CognitoImage
  colour: string

  baseurl() {
    return '/api/v1/event/venue'
  }

  constructor(source?: Partial<EventVenue>) {
    super()
    this.name = ''
    this.url = ''
    this.photo = new CognitoImage()
    this.colour = ''
    Object.assign(this, source)
  }
}

export { EventVenue }
