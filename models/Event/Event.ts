import { CognitoBase } from '../Cognito/Base'
import { CognitoTime } from '../Cognito/Time'
import type { EventCategory } from './Category'
import type { EventExtra } from './Extra'
import type { EventMerch } from './Merch'
import type { EventSpectatorType } from './SpectatorType'
import { EventType } from './Type'
import { EventVenue } from './Venue'

class EventEvent extends CognitoBase {
  name: string
  type: EventType
  start_date: CognitoTime
  venue: EventVenue
  entrant_content: string
  spectator_content: string
  entries_open_at: CognitoTime
  can_enter: boolean
  categories: EventCategory[]
  spectator_types: EventSpectatorType[]
  extras: EventExtra[]
  merch: EventMerch[]

  baseurl() {
    return '/api/v1/event/event'
  }

  constructor(source?: Partial<EventEvent>) {
    super()
    this.name = ''
    this.type = new EventType()
    this.venue = new EventVenue()
    this.entrant_content = ''
    this.spectator_content = ''
    this.can_enter = false
    this.categories = []
    this.spectator_types = []
    this.extras = []
    this.merch = []
    Object.assign(this, source)
    this.start_date = new CognitoTime(source?.start_date)
    this.entries_open_at = new CognitoTime(source?.entries_open_at)
  }
}

export { EventEvent }
