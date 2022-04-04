import { CognitoImage } from '~cognito/models/Cognito/Image'
import { CognitoVideo } from '~cognito/models/Cognito/Video'
import type { SellSku } from '~/models/Sell/Sku'
import { $axios } from '~/plugins/axios'

class SellProduct {
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

  constructor(source?: Partial<SellProduct>) {
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

  async find_many(data: {
    image_aspect?: string
    image_width: number
    page_size: number
    page: number
    group?: string
    orderby?: string
    ids?: number[]
  }): Promise<{
      num_items: number
      num_pages: number
      data: SellProduct[]
    }> {
    const res = await $axios.get('/api/v1/sell/product', {
      params: {
        image_aspect: data.image_aspect,
        image_width: data.image_width,
        page_size: data.page_size,
        page: data.page,
        group: data.group,
        orderby: data.orderby,
        ids: data.ids,
      },
    })
    return res.data
  }

  async find_one(data: {
    image_aspect?: string
    image_width: number
    url: string
  }): Promise<SellProduct> {
    const res = await $axios.get(`/api/v1/sell/product/${data.url}`, {
      params: {
        image_aspect: data.image_aspect,
        image_width: data.image_width,
      },
    })
    return res.data
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
