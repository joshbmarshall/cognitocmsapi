import { CognitoBase } from './Base'
import { CognitoImage } from './Image'

class CognitoSlide extends CognitoBase {
  heading: string
  image: CognitoImage
  sub_heading: string
  content: string
  overlay_color: string
  text_color: string
  image_opacity: string
  image_saturation: string
  link: string
  link_button_text: string
  link_target: string

  baseurl(): string {
    return '/api/v1/cognito/slide'
  }

  constructor(source?: Partial<CognitoSlide>) {
    super()
    this.heading = ''
    this.image = new CognitoImage()
    this.sub_heading = ''
    this.content = ''
    this.overlay_color = ''
    this.text_color = ''
    this.image_opacity = ''
    this.image_saturation = ''
    this.link = ''
    this.link_button_text = ''
    this.link_target = ''
    Object.assign(this, source)
    if (source?.image) {
      this.image = new CognitoImage(source.image)
    }
  }

  imageClass(): string {
    let classes = ''

    classes += [
      { name: 'opacity-10', id: '10' },
      { name: 'opacity-30', id: '30' },
      { name: 'opacity-50', id: '50' },
      { name: 'opacity-70', id: '70' },
      { name: 'opacity-90', id: '90' },
      { name: 'opacity-100', id: '100' },
    ].find(e => e.id === this.image_opacity)?.name

    classes += ` ${[
    { name: 'saturate-0', id: '0' },
    { name: 'saturate-50', id: '50' },
    { name: 'saturate-100', id: '100' },
  ].find(e => e.id === this.image_saturation)?.name}`

    return classes
  }

  outerClass(): string {
    if (this.overlay_color === 'white' || !this.overlay_color) {
      return 'bg-white'
    }
    if (this.overlay_color === 'black') {
      return 'bg-black'
    }
    return `bg-${[
      'brand',
      'success',
      'info',
      'warning',
      'danger',
    ].find(e => e === this.overlay_color)}-500`
  }

  textClass(): string {
    return `text-${[
      'white',
      'black',
    ].find(e => e === this.text_color)}`
  }
}

export { CognitoSlide }
