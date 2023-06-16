import { CognitoBase } from '../Cognito/Base'

class EventSpectatorType extends CognitoBase {
  name: string
  cost: number
  qty_available: number
  sold_out: boolean

  baseurl() {
    return '/api/v1/event/spectatorType'
  }

  constructor(source?: Partial<EventSpectatorType>) {
    super()
    this.name = ''
    this.cost = 0
    this.qty_available = 0
    this.sold_out = true
    Object.assign(this, source)
  }
}

export { EventSpectatorType }
