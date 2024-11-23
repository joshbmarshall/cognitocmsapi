import { addDays, addMinutes, differenceInCalendarDays, differenceInYears, format, isAfter, isFuture, isPast, isSameDay, isSameMonth, isWeekend, parseISO, subDays, subMinutes, subMonths } from 'date-fns'

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

  addDays(days: number): CognitoTime {
    return new CognitoTime(addDays(this.time, days))
  }

  subDays(days: number): CognitoTime {
    return new CognitoTime(subDays(this.time, days))
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

  age(): number {
    return differenceInYears(new Date(), this.time)
  }

  isSameDay(compare_to: CognitoTime): boolean {
    return isSameDay(this.time, compare_to.time)
  }

  isSameMonth(compare_to: CognitoTime): boolean {
    return isSameMonth(this.time, compare_to.time)
  }

  isWeekend(): boolean {
    return isWeekend(this.time)
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
      return this.format('eeee do MMMM')
    }
    if (this.isSameMonth(othertime)) {
      return `${this.format('eeee do')} - ${othertime.format('eeee do MMMM')}`
    }
    return `${this.format('eeee do MMMM')} - ${othertime.format('eeee do MMMM')}`
  }

  betweenDateStringShort(othertime: CognitoTime): string {
    if (this.isSameDay(othertime)) {
      return this.format('dd MMM')
    }
    if (this.isSameMonth(othertime)) {
      return `${this.format('dd')}-${othertime.format('dd MMM')}`
    }
    return `${this.format('dd MMM')} - ${othertime.format('dd MMM')}`
  }

  isAfter(othertime: CognitoTime): boolean {
    return isAfter(this.time, othertime.time)
  }

  hour(): number {
    return Number.parseInt(format(this.time, 'HH'))
  }
}
export { CognitoTime }
