import { CognitoImage } from '~cognito/models/Cognito/Image'
import { CognitoVideo } from '~cognito/models/Cognito/Video'
import type { SellSku } from '~cognito/models/Sell/Sku'
import { $axios } from '~cognito/plugins/axios'
import { CognitoBase } from '../Cognito/Base'

class SellProduct extends CognitoBase {
  name: string
  title: string
  meta_description: string
  slug: string
  blurb: string
  content: string
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
    this.title = ''
    this.meta_description = ''
    this.content = ''
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
  }): Promise<{
      sku: number
      price_each: string
      full_price_each: string
      on_special: boolean
      in_stock: boolean
    }> {
    const res = await $axios.post('/api/v1/sell/cart/searchsku', {
      product: data.product_id,
      variations: data.variations,
      addons: data.addons,
    })
    return res.data
  }
}

export { SellProduct }
