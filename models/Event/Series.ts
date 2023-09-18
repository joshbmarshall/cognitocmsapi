import { CognitoBase } from '../Cognito/Base'
import { CognitoTime } from '../Cognito/Time'
import { $axios } from '~cognito/plugins/axios'

class EventSeries extends CognitoBase {
  name: string
  url: string
  content: string
  entry_fee: number
  entries_open_at: CognitoTime
  entries_close_at: CognitoTime

  baseurl() {
    return '/api/v1/event/series'
  }

  constructor(source?: Partial<EventSeries>) {
    super()
    this.name = ''
    this.url = ''
    this.content = ''
    this.entry_fee = 0
    Object.assign(this, source)
    this.entries_open_at = new CognitoTime(source?.entries_open_at)
    this.entries_close_at = new CognitoTime(source?.entries_close_at)
  }

  async submitEntry(data: any): Promise<{
    success: boolean
    message: string
    redirect: string
  }> {
    return (await $axios.post(`${this.baseurl()}/submitEntry`, data)).data
  }
}

export { EventSeries }
