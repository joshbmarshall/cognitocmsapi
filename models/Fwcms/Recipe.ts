import { CognitoBase } from '../Cognito/Base'
import { CognitoImage } from '../Cognito/Image'

class FwcmsRecipe extends CognitoBase {
  name: string
  prep_time: number
  cook_time: number
  difficulty: number
  servings: number
  author: string
  yield: string
  url: string
  description: string
  content: string
  ingredients: string
  method: string
  hints: string
  image: CognitoImage
  related_recipes: Array<FwcmsRecipe>

  baseurl(): string {
    return '/api/v1/fwcms/recipe'
  }

  constructor(source?: Partial<FwcmsRecipe>) {
    super()
    this.name = ''
    this.prep_time = 0
    this.cook_time = 0
    this.difficulty = 0
    this.servings = 0
    this.author = ''
    this.yield = ''
    this.url = ''
    this.description = ''
    this.content = ''
    this.ingredients = ''
    this.method = ''
    this.hints = ''
    this.image = new CognitoImage()
    this.related_recipes = []
    Object.assign(this, source)
  }
}

export { FwcmsRecipe }
