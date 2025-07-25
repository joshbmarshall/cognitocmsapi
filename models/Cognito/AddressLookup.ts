import axios from 'axios'

class CognitoAddressLookup {
  line1: string
  line2: string
  city: string
  postcode: string
  state: string
  country: string
  latitude: string
  longitude: string

  constructor(source?: Partial<CognitoAddressLookup>) {
    this.line1 = ''
    this.line2 = ''
    this.city = ''
    this.postcode = ''
    this.state = ''
    this.country = ''
    this.latitude = ''
    this.longitude = ''

    Object.assign(this, source)
  }

  async lookup(params: {
    id: string
    apiKey: string
  }): Promise<any> {
    return await axios
      .get(
        'https://lookup.search.hereapi.com/v1/lookup',
        {
          params,
        },
      )
  }

  async search(params: {
    latitude: number
    longitude: number
    q: string
    apiKey: string
  }): Promise<any> {
    return await axios
      .get('https://autocomplete.search.hereapi.com/v1/autocomplete', {
        params: {
          q: params.q,
          apiKey: params.apiKey,
        },
      })
  }
}

export { CognitoAddressLookup }
