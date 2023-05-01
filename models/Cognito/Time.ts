import { format, parseISO } from 'date-fns'
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
}
export { CognitoTime }
