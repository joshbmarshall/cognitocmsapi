import { CognitoBase } from '../Cognito/Base'
import { CognitoImage } from '~cognito/models/Cognito/Image'
import { CognitoVideo } from '~cognito/models/Cognito/Video'
import type { SellSku } from '~cognito/models/Sell/Sku'
import { $axios } from '~cognito/plugins/axios'

class SellSkuSearchResult {
  sku: number
  price_each: string
  full_price_each: string
  on_special: boolean
  in_stock: boolean

  constructor(source?: Partial<SellSkuSearchResult>) {
    this.sku = 0
    this.price_each = ''
    this.full_price_each = ''
    this.on_special = false
    this.in_stock = false
    Object.assign(this, source)
  }
}

class SellProduct extends CognitoBase {
  name: string
  title: string
  meta_description: string
  slug: string
  blurb: string
  brand: string
  content: string
  price: number
  images: CognitoImage[]
  image: CognitoImage
  in_stock: boolean
  groups: string[]
  video: CognitoVideo
  skus: SellSku[]
  addons: string[]
  groupaddons: string[]

  baseurl(): string {
    return '/api/v1/sell/product'
  }

  constructor(source?: Partial<SellProduct>) {
    super()
    this.name = ''
    this.slug = ''
    this.blurb = ''
    this.brand = ''
    this.title = ''
    this.meta_description = ''
    this.content = ''
    this.price = 0
    this.images = []
    this.image = new CognitoImage()
    this.in_stock = false
    this.groups = []
    this.video = new CognitoVideo()
    this.skus = []
    this.addons = []
    this.groupaddons = []
    Object.assign(this, source)
  }

  async skusearch(data: {
    product_id: number
    variations: {
      name: string
      value: string
    }[]
    addons: {
      id: number
      value: string
    }[]
  }): Promise<SellSkuSearchResult> {
    const res = await $axios.post('/api/v1/sell/cart/searchsku', {
      product: data.product_id,
      variations: data.variations,
      addons: data.addons,
    })
    return res.data
  }
}

export { SellProduct, SellSkuSearchResult }
