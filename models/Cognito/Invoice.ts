import { CognitoBase } from '../Cognito/Base'
import { CognitoTime } from './Time'
import { $axios } from '~cognito/plugins/axios'

class CognitoInvoiceItem {
  id: number
  description: string
  qty: number
  line_price: number
  line_tax: number
  constructor() {
    this.id = 0
    this.description = ''
    this.qty = 0
    this.line_price = 0
    this.line_tax = 0
  }
}

class CognitoInvoice extends CognitoBase {
  billing_contact_name: string
  billing_company: string
  billing_email: string
  billing_phone: string
  billing_address: string
  shipping_type: string
  shipping_contact_name: string
  shipping_company: string
  shipping_email: string
  shipping_phone: string
  shipping_address: string
  title: string
  total_amount: string
  total_tax: string
  is_quote: boolean
  cancelled_at: CognitoTime
  paid_at: CognitoTime
  invoiceItems: CognitoInvoiceItem[]

  baseurl() {
    return '/api/v1/cognito/invoice'
  }

  constructor(source?: Partial<CognitoInvoice>) {
    super()
    this.billing_contact_name = ''
    this.billing_company = ''
    this.billing_email = ''
    this.billing_phone = ''
    this.billing_address = ''
    this.shipping_type = ''
    this.shipping_contact_name = ''
    this.shipping_company = ''
    this.shipping_email = ''
    this.shipping_phone = ''
    this.shipping_address = ''
    this.title = ''
    this.total_amount = ''
    this.total_tax = ''
    this.is_quote = false
    this.invoiceItems = []
    Object.assign(this, source)
    this.cancelled_at = new CognitoTime(source?.cancelled_at)
    this.paid_at = new CognitoTime(source?.paid_at)
  }

  async payNow(data: any): Promise<{
    success: boolean
    message: string
    redirect: string
  }> {
    data.url = btoa(window.location)
    return (await $axios.post('/api/v1/cognito/invoice/payNow', data)).data
  }

  async getInvoice(payment: number): Promise<{
    invoiceText: string
  }> {
    return (await $axios.post('/api/v1/cognito/invoice/invoiceText', {
      payment,
    })).data
  }
}

export { CognitoInvoice }
