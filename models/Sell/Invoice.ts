import { CognitoBase } from '../Cognito/Base'
import { SellSku } from './Sku'
import { CognitoImage } from '~cognito/models/Cognito/Image'
import { $axios } from '~cognito/plugins/axios'

class SellInvoiceItem extends CognitoBase {
  id: number
  sku: SellSku
  product_name: string
  url: string
  image: CognitoImage
  price_each: number
  qty: number
  subtotal: number
  addons: string[]

  baseurl() {
    return '/api/v1/sell/cart'
  }

  constructor(source?: Partial<SellInvoiceItem>) {
    super()
    this.id = 0
    this.sku = new SellSku()
    this.product_name = ''
    this.url = ''
    this.image = new CognitoImage()
    this.price_each = 0
    this.qty = 0
    this.subtotal = 0
    this.addons = []
    Object.assign(this, source)
  }
}

class SellInvoice extends CognitoBase {
  id: number
  status_type: string // Pending, Paid, Picked, Complete or Canceled
  status: string
  items: SellInvoiceItem[]

  baseurl() {
    return '/api/v1/sell/cart'
  }

  constructor(source?: Partial<SellInvoice>) {
    super()
    this.id = 0
    this.status_type = 'Pending'
    this.status = ''
    this.items = []
    Object.assign(this, source)
  }

  async display(payment: string): Promise<{
    invoice_text: string
  }> {
    const res = await $axios.get(`/api/v1/sell/invoice/display/${payment}`)
    return res.data
  }

  async myInvoices(): Promise<SellInvoice[]> {
    const res = await $axios.get('/api/v1/sell/invoice/myInvoices')
    return res.data.data
  }

  async invoiceText(): Promise<{
    success: boolean
    invoice_text: string
    pdf: string
  }> {
    const res = await $axios.get(`/api/v1/sell/invoice/html/${this.id}`)
    return res.data
  }
}

export { SellInvoice }
