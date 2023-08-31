import { CognitoBase } from './Base'
import { $axios } from '~cognito/plugins/axios'

class CognitoImageExtraAspect {
  aspect: string
  placeholder: string
  url: string
  webp_url: string
  avif_url: string
  constructor() {
    this.aspect = ''
    this.placeholder = ''
    this.url = ''
    this.webp_url = ''
    this.avif_url = ''
  }
}

class CognitoImage extends CognitoBase {
  placeholder: string
  url: string
  webp_url: string
  avif_url: string
  extra_aspects: CognitoImageExtraAspect[]

  baseurl(): string {
    return '/api/v1/cognito/image'
  }

  constructor(source?: Partial<CognitoImage>) {
    super()
    this.placeholder = ''
    this.url = ''
    this.webp_url = ''
    this.avif_url = ''
    this.extra_aspects = []
    Object.assign(this, source)
  }

  async getByHash(data: {
    hash: string
    image_aspect: string
    image_width: string
  }): Promise<{
    webp_url: string
    avif_url: string
    url: string
    placeholder: string
  }> {
    const res = await $axios.post('/api/v1/cognito/image/getByHash', data)
    return res.data
  }

  blankImageUrl(width: number, height: number) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'
    ctx.fillRect(0, 0, width, height)

    return canvas.toDataURL()
  }
}

export { CognitoImage }
