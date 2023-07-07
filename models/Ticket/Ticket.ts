import { CognitoBase } from '../Cognito/Base'
import { CognitoTime } from '../Cognito/Time'
import { $axios } from '~cognito/plugins/axios'

class TicketTicket extends CognitoBase {
  customer_name: string
  email: string
  valid_from: CognitoTime
  valid_to: CognitoTime
  display_name: string
  number_of_tickets: number

  baseurl(): string {
    return '/api/v1/ticket/ticket'
  }

  constructor(source?: Partial<TicketTicket>) {
    super()
    this.id = 0
    this.customer_name = ''
    this.email = ''
    this.display_name = ''
    this.number_of_tickets = 1
    Object.assign(this, source)
    this.valid_from = new CognitoTime(source?.valid_from)
    this.valid_to = new CognitoTime(source?.valid_to)
  }

  async myUpcomingEntries(): Promise<TicketTicket[]> {
    return new TicketTicket().map((await $axios.get(`${this.baseurl()}/myUpcoming`)).data)
  }

  async printTickets(id: number): Promise<{
    success: boolean
    pdf: string
  }> {
    const res = await $axios.get(`/api/v1/ticket/ticket/print/${id}`)
    return res.data
  }
}

export { TicketTicket }
