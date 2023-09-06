import { addMinutes, differenceInCalendarDays, format, isAfter, isFuture, isPast, isSameDay, isSameMonth, parseISO, subMinutes, subMonths } from 'date-fns'

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

  subMonths(months: number): CognitoTime {
    return new CognitoTime(subMonths(this.time, months))
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

  isSameMonth(compare_to: CognitoTime): boolean {
    return isSameMonth(this.time, compare_to.time)
  }

  format(fmt: string): string {
    return format(this.time, fmt)
  }

  toDateString(): string {
    return format(this.time, 'Y-MM-dd')
  }

  toISO8601String(): string {
    return format(this.time, 'Y-MM-dd\'T\'HH:mm:ssXX')
  }

  toDateTimeString(): string {
    return format(this.time, 'Y-MM-dd HH:mm:ss')
  }

  toHumanDateString(include_year: boolean): string {
    const formatting = `do MMM${include_year ? ' yyyy' : ''}`
    return format(this.time, formatting)
  }

  toHumanTimeString(): string {
    return format(this.time, 'h:mmaaa')
  }

  toHuman24HourTimeString(): string {
    return format(this.time, 'HH:mm')
  }

  betweenDateString(othertime: CognitoTime): string {
    if (this.isSameDay(othertime)) {
      return this.format('eee do MMMM')
    }
    if (this.isSameMonth(othertime)) {
      return `${this.format('eee do')} - ${othertime.format('eee do MMMM')}`
    }
    return `${this.format('eee do MMMM')} - ${othertime.format('eee do MMMM')}`
  }

  isAfter(othertime: CognitoTime): boolean {
    return isAfter(this.time, othertime.time)
  }
}
export { CognitoTime }
