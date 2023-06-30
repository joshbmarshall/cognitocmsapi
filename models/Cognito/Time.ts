import { addMinutes, differenceInCalendarDays, format, isFuture, isPast, isSameDay, parseISO, subMinutes } from 'date-fns'

class CognitoTime {
  time: Date

  constructor(isoformat?: any) {
    if (typeof isoformat == 'object') {
      this.time = isoformat
    } else {
      this.time = parseISO(isoformat)
    }
    if (this.time == 'Invalid Date') {
      this.time = new Date()
    }
  }

  addMinutes(minutes: number): CognitoTime {
    return new CognitoTime(addMinutes(this.time, minutes))
  }

  subMinutes(minutes: number): CognitoTime {
    return new CognitoTime(subMinutes(this.time, minutes))
  }

  diffInDays(compare_to: CognitoTime): number {
    return differenceInCalendarDays(this.time, compare_to.time)
  }

  isFuture(): boolean {
    return isFuture(this.time)
  }

  isPast(): boolean {
    return isPast(this.time)
  }

  isSameDay(compare_to: CognitoTime): boolean {
    return isSameDay(this.time, compare_to.time)
  }

  format(fmt: string) {
    return format(this.time, fmt)
  }

  toDateString() {
    return format(this.time, 'Y-MM-dd')
  }

  toISO8601String() {
    return format(this.time, 'Y-MM-dd\'T\'HH:mm:ssXX')
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
}
export { CognitoTime }
