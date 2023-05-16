import { differenceInCalendarDays, format, isSameDay, parseISO } from 'date-fns'
class CognitoTime {
  time: Date

  constructor(isoformat?: any) {
    this.time = parseISO(isoformat)
    if (this.time == 'Invalid Date') {
      this.time = new Date()
    }
  }

  format(fmt: string) {
    return format(this.time, fmt)
  }

  toDateString() {
    return format(this.time, 'Y-MM-dd')
  }

  toDateTimeString() {
    return format(this.time, 'Y-MM-dd HH:mm:ss')
  }

  toHumanDateString(include_year: boolean) {
    const formatting = `do MMM${include_year ? ' yyyy' : ''}`
    return format(this.time, formatting)
  }

  toHumanTimeString() {
    return format(this.time, 'h:mmaaa')
  }

  toHuman24HourTimeString() {
    return format(this.time, 'HH:mm')
  }

  isSameDay(compare_to: CognitoTime): boolean {
    return isSameDay(this.time, compare_to.time)
  }

  diffInDays(compare_to: CognitoTime): number {
    return differenceInCalendarDays(this.time, compare_to.time)
  }
}
export { CognitoTime }
