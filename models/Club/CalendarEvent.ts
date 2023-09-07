import { format } from 'date-fns'
import { $racersaxios } from '~cognito/plugins/racersapi'
import { config } from '~/config'

class CalendarEvent {
  id: number
  title: string
  longtitle: string
  start: string
  finish: string
  venue: string
  isEntered: boolean

  constructor(source?: Partial<CalendarEvent>) {
    this.id = 0
    this.title = ''
    this.longtitle = ''
    this.start = ''
    this.finish = ''
    this.venue = ''
    this.isEntered = false
    Object.assign(this, source)
  }

  async getEvents() {
    // Get the calendar of events from RACERS
    const res = await $racersaxios.get(`/api/v1/racers/event/upcoming?manager=${config.racers.eventManager}`)
    return res.data.data
  }

  formatDates() {
    const startdate = new Date(this.start)
    const enddate = new Date(this.finish)
    const sameyear = startdate.getFullYear() == enddate.getFullYear()
    const samemonth = sameyear && startdate.getMonth() == enddate.getMonth()
    const sameday = samemonth && startdate.getDate() == enddate.getDate()
    if (sameday) {
      return format(startdate, 'eee do LLL yyyy')
    }
    if (samemonth) {
      return `${format(startdate, 'eee do')} to ${format(enddate, 'eee do LLL yyyy')}`
    }
    if (sameyear) {
      return `${format(startdate, 'eee do LLL')} to ${format(enddate, 'eee do LLL yyyy')}`
    }
    return `${format(startdate, 'eee do LLL yyyy')} to ${format(enddate, 'eee do LLL yyyy')}`
  }
}

export { CalendarEvent }
