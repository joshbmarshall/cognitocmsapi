import { CognitoBase } from '../Cognito/Base'
import { CognitoImage } from '../Cognito/Image'
import { EventEvent } from './Event'
import { $axios } from '~cognito/plugins/axios'

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

  async nextEvents(): Promise<EventEvent[]> {
    const data = await $axios.get(`${this.baseurl()}/nextEvents?image_aspect=1x1`)
    return new EventEvent().map(data.data)
  }
}

export { EventVenue }
