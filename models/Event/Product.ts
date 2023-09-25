import { CognitoBase } from '../Cognito/Base'
import type { CognitoPhoto } from '../Cognito/Photo'

class EventSku {
  id: number
  name: string
  price: number
  constructor() {
    this.id = 0
    this.name = ''
    this.price = 0
  }
}

class EventProduct extends CognitoBase {
  name: string
  description: string
  options: EventSku[]
  photos: CognitoPhoto[]
  selectedOption?: number

  baseurl() {
    return '/api/v1/event/product'
  }

  constructor(source?: Partial<EventProduct>) {
    super()
    this.name = ''
    this.description = ''
    this.photos = []
    this.options = []
    Object.assign(this, source)
  }
}

export { EventProduct }
