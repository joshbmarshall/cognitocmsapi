import { CognitoBase } from './Base'

class CognitoVideo extends CognitoBase {
  id: string
  platform: string // 'vimeo', 'youtube'
  name: string
  slug: string
  length: number
  slate: string

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
    Object.assign(this, source)
  }
}

export { CognitoVideo }
