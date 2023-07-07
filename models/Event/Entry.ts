import { CognitoBase } from '../Cognito/Base'
import { CognitoTime } from '../Cognito/Time'
import { $axios } from '~cognito/plugins/axios'

class EventEntry extends CognitoBase {
  name: string
  event: string
  date: CognitoTime

  baseurl() {
    return '/api/v1/event/entry'
  }

  constructor(source?: Partial<EventEntry>) {
    super()
    this.name = ''
    this.event = ''
    Object.assign(this, source)
    this.date = new CognitoTime(source?.date)
  }

  async myUpcomingEntries(): Promise<EventEntry[]> {
    return new EventEntry().map((await $axios.get(`${this.baseurl()}/myUpcoming`)).data)
  }
}

export { EventEntry }
