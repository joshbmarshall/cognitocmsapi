import { CognitoImage } from '~cognito/models/Cognito/Image'

class SellSku {
  id: number
  code: string
  is_default: boolean
  in_stock: boolean
  product_id: number
  image: CognitoImage

  constructor(source?: Partial<SellSku>) {
    this.id = 0
    this.code = ''
    this.is_default = false
    this.in_stock = false
    this.product_id = 0
    this.image = new CognitoImage()
    Object.assign(this, source)
  }
}

export { SellSku }
