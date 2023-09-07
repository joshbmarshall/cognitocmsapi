import { ClubMembershipType } from './MembershipType'
import { CognitoBase } from '~cognito/models/Cognito/Base'
import { $axios } from '~cognito/plugins/axios'

class ClubPurchase extends CognitoBase {
  id: number
  type: ClubMembershipType
  date: string

  baseurl() {
    return '/api/v1/club/purchase'
  }

  constructor(source?: Partial<ClubPurchase>) {
    super()
    this.id = 0
    this.type = new ClubMembershipType()
    this.date = ''
    Object.assign(this, source)
  }

  async display(payment: string): Promise<{
    invoice_text: string
  }> {
    const res = await $axios.get(`/api/v1/club/purchase/display/${payment}`)
    return res.data
  }

  async invoiceText(): Promise<{
    success: boolean
    invoice_text: string
    pdf: string
  }> {
    const res = await $axios.get(`/api/v1/club/purchase/html/${this.id}`)
    return res.data
  }
}

export { ClubPurchase }
