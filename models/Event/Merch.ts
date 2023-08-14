import { CognitoBase } from '../Cognito/Base'
import type { CognitoPhoto } from '../Cognito/Photo'

class EventMerchOption {
  id: number
  name: string
  price_each: number
  constructor() {
    this.id = 0
    this.name = ''
    this.price_each = 0
  }
}

class EventMerch extends CognitoBase {
  name: string
  description: string
  price_each: number
  photos: CognitoPhoto[]
  options: EventMerchOption[]
  selectedOption?: number

  baseurl() {
    return '/api/v1/event/merch'
  }

  constructor(source?: Partial<EventMerch>) {
    super()
    this.name = ''
    this.description = ''
    this.price_each = 0
    this.photos = []
    this.options = []
    Object.assign(this, source)
  }
}

export { EventMerch }
