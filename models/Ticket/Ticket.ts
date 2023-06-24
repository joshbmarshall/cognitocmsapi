import { CognitoBase } from '../Cognito/Base'
import { $axios } from '~cognito/plugins/axios'

class TicketTicket extends CognitoBase {
  baseurl() {
    return '/api/v1/ticket/ticket'
  }

  async getList() {
    const res = await $axios.get(`${this.baseurl()}/todayList`)
    return res.data
  }
}

export { TicketTicket }
