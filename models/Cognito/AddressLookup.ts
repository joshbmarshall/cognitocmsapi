import { $axios } from '~cognito/plugins/axios'

class CognitoAddressLookup {
  line1: string
  line2: string
  city: string
  postcode: string
  state: string
  country: string

  constructor(source?: Partial<CognitoAddressLookup>) {
    this.line1 = ''
    this.line2 = ''
    this.city = ''
    this.postcode = ''
    this.state = ''
    this.country = ''

    Object.assign(this, source)
  }

  async lookup(params: {
    id: string
    apiKey: string
  }): Promise<any> {
    return await $axios
      .get(
        'https://lookup.search.hereapi.com/v1/lookup', {
          params,
        })
  }

  async search(params: {
    latitude: number
    longitude: number
    q: string
    apiKey: string
  }): Promise<any> {
    const at = `${params.latitude},${params.longitude}`
    return await $axios
      .get('https://autosuggest.search.hereapi.com/v1/autosuggest', {
        params: {
          at,
          q: params.q,
          apiKey: params.apiKey,
        },
      })
  }
}

export { CognitoAddressLookup }
