import { $axios } from '~cognito/plugins/axios'

class CognitoFindManyParams {
  image_aspect?: string
  image_width?: number
  page_size?: number
  page?: number
  group?: string
  orderby?: string
  ids?: number[]
}

class CognitoFindOneParams {
  image_aspect?: string
  image_width?: number
  page_size?: number
  url: string

  constructor(source?: Partial<CognitoFindOneParams>) {
    this.url = ''
    Object.assign(this, source)
  }
}

class CognitoBase {
  id?: number|string

  /**
   * Override to get the actual url
   * @returns string
   */
  baseurl(): string {
    return '/api/v1/cognito/changeMe'
  }

  async find_many(data: CognitoFindManyParams): Promise<{
    num_items: number
    num_pages: number
    data: any[]
  }> {
    const res = await $axios.get(this.baseurl(), {
      params: data,
    })
    return res.data
  }

  async find_one(data: CognitoFindOneParams): Promise<any> {
    const res = await $axios.get(`${this.baseurl()}/${data.url}`, {
      params: data,
    })
    return res.data
  }

  async save(): Promise<{
    item: any
    success: boolean
    error: string
  }> {
    let res = null
    if (this.id) {
      // Update the existing item
      res = await $axios.post(`${this.baseurl()}/update`, this)
    } else {
      // Create new item
      res = await $axios.post(`${this.baseurl()}/create`, this)
    }
    return res.data
  }

  async enable(): Promise<{
    success: boolean
    message: string
  }> {
    const res = await $axios.post(`${this.baseurl()}/enable`, {
      id: this.id,
    })
    return res.data
  }

  async disable(): Promise<{
    success: boolean
    message: string
  }> {
    const res = await $axios.post(`${this.baseurl()}/disable`, {
      id: this.id,
    })
    return res.data
  }

  async create(): Promise<{
    success: boolean
    item: any
    error: string
  }> {
    const res = await $axios.post(`${this.baseurl()}/create`, this)
    return res.data
  }
}

export { CognitoBase, CognitoFindManyParams, CognitoFindOneParams }
