import { CognitoBase } from '../Cognito/Base'
import { CognitoImage } from '../Cognito/Image'

class FwcmsRecipe extends CognitoBase {
  name: string
  url: string
  description: string
  content: string
  ingredients: string
  method: string
  hints: string
  image: CognitoImage

  baseurl(): string {
    return '/api/v1/fwcms/recipe'
  }

  constructor(source?: Partial<FwcmsRecipe>) {
    super()
    this.name = ''
    this.url = ''
    this.description = ''
    this.content = ''
    this.ingredients = ''
    this.method = ''
    this.hints = ''
    this.image = new CognitoImage()
    Object.assign(this, source)
  }
}

export { FwcmsRecipe }
