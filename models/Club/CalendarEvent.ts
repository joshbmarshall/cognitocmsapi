import { format } from 'date-fns'
import { $racersaxios } from '~cognito/plugins/racersapi'
import { $axios } from '~cognito/plugins/axios'
import { config } from '~/config'

class CalendarEvent {
  id: number
  url: string
  title: string
  longtitle: string
  start: string
  finish: string
  venue: string
  can_enter: boolean
  can_spectate: boolean
  isEntered: boolean

  constructor(source?: Partial<CalendarEvent>) {
    this.id = 0
    this.url = ''
    this.title = ''
    this.longtitle = ''
    this.start = ''
    this.finish = ''
    this.venue = ''
    this.can_enter = false
    this.can_spectate = false
    this.isEntered = false
    Object.assign(this, source)
  }

  async getEventEvents() {
    // Get the calendar of events from the Event Module
    const res = await $axios.get('/api/v1/event/event/upcoming')
    return res.data
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
