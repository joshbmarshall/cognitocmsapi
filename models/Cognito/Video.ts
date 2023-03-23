import { CognitoBase } from './Base'
import { CognitoImage } from './Image'

class CognitoVideo extends CognitoBase {
  id: string
  platform: string // 'vimeo', 'youtube'
  name: string
  slug: string
  length: number
  slate: string
  slate_image: CognitoImage
  file: string

  baseurl(): string {
    return '/api/v1/cognito/video'
  }

  constructor(source?: Partial<CognitoVideo>) {
    super()
    this.id = ''
    this.platform = 'youtube'
    this.name = ''
    this.slug = ''
    this.length = 0
    this.slate = ''
    this.slate_image = new CognitoImage()
    this.file = ''
    Object.assign(this, source)
  }
}

export { CognitoVideo }
