import { CognitoBase } from './Base'
import { CognitoCountry } from './Country'

class CognitoState extends CognitoBase {
  name: string
  code: string
  country: CognitoCountry

  baseurl(): string {
    return '/api/v1/cognito/state'
  }

  constructor(source?: Partial<CognitoState>) {
    super()
    this.name = ''
    this.code = ''
    this.country = new CognitoCountry()
    Object.assign(this, source)
  }

  getAustralianStates = async () => {
    const data = await new CognitoState().find_many({})
    return data.mapped.filter(e => e.country?.code == 'AU')
  }
}

export { CognitoState }
