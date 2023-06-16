import { CognitoBase } from '../Cognito/Base'
import type { CognitoPhoto } from '../Cognito/Photo'

class EventMerch extends CognitoBase {
  name: string
  description: string
  price_each: number
  photos: CognitoPhoto[]

  baseurl() {
    return '/api/v1/event/merch'
  }

  constructor(source?: Partial<EventMerch>) {
    super()
    this.name = ''
    this.description = ''
    this.price_each = 0
    this.photos = []
    Object.assign(this, source)
  }
}

export { EventMerch }
