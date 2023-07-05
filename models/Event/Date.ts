import { CognitoBase } from '../Cognito/Base'
import { CognitoTime } from '../Cognito/Time'

class EventDate extends CognitoBase {
  date: string
  start_time: string
  end_time: string
  start: CognitoTime
  end: CognitoTime

  baseurl() {
    return '/api/v1/event/venue'
  }

  constructor(source?: Partial<EventDate>) {
    super()
    this.date = ''
    this.start_time = ''
    this.end_time = ''
    Object.assign(this, source)
    this.start = new CognitoTime(source?.start)
    this.end = new CognitoTime(source?.end)
  }
}

export { EventDate }
