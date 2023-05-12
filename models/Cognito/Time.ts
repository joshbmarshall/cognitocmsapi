import { format, isSameDay, parseISO } from 'date-fns'
class CognitoTime {
  time: Date

  constructor(isoformat: any) {
    this.time = parseISO(isoformat)
  }

  format(fmt: string) {
    return format(this.time, fmt)
  }

  toDateString() {
    return format(this.time, 'Y-MM-dd')
  }

  isSameDay(compare_to: CognitoTime): boolean {
    return isSameDay(this.time, compare_to.time)
  }
}
export { CognitoTime }
