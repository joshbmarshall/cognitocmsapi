import { CognitoBase } from '../Cognito/Base'
import { CognitoTime } from '../Cognito/Time'
import { $axios } from '~cognito/plugins/axios'

class EventStallSite extends CognitoBase {
  id: number
  name: string
  event: string
  date: CognitoTime
  invoice_id: number
  approved: boolean
  paid: boolean

  baseurl() {
    return '/api/v1/event/stallSite'
  }

  constructor(source?: Partial<EventStallSite>) {
    super()
    this.id = 0
    this.name = ''
    this.event = ''
    this.invoice_id = 0
    this.approved = false
    this.paid = false
    Object.assign(this, source)
    this.date = new CognitoTime(source?.date)
  }

  async myUpcoming(): Promise<EventStallSite[]> {
    return new EventStallSite().map((await $axios.get(`${this.baseurl()}/myUpcoming`)).data)
  }
}

export { EventStallSite }
