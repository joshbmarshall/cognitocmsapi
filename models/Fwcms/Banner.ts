import { CognitoBase } from '../Cognito/Base'
import { CognitoImage } from '../Cognito/Image'

class FwcmsBanner extends CognitoBase {
  name: string
  link: string
  primary_image: CognitoImage
  secondary_image: CognitoImage

  baseurl(): string {
    return '/api/v1/fwcms/banner'
  }

  constructor(source?: Partial<FwcmsBanner>) {
    super()
    this.name = ''
    this.link = ''
    this.primary_image = new CognitoImage()
    this.secondary_image = new CognitoImage()
    Object.assign(this, source)
  }
}

export { FwcmsBanner }
