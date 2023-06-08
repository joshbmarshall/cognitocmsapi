import { $axios } from '~cognito/plugins/axios'

class CognitoFindManyParams {
  image_aspect?: string
  image_width?: number
  page_size?: number
  page?: number
  group?: string
  tag?: string
  parent?: string
  orderby?: string
  ids?: number[]
}

class CognitoFindOneParams {
  image_aspect?: string
  extra_aspects?: string[]
  image_width?: number
  page_size?: number
  url?: string
  id?: number

  constructor(source?: Partial<CognitoFindOneParams>) {
    Object.assign(this, source)
  }
}

class CognitoBase {
  id?: number | string

  /**
   * Override to get the actual url
   * @returns string
   */
  baseurl(): string {
    return '/api/v1/cognito/changeMe'
  }

  /**
   * Override to get the actual model
   * @returns string
   */
  modelname(): string {
    return ''
  }

  map(data: any[]): any {
    const mapped = []
    mapped.push(...data.map(e => new this.constructor(e)))
    return mapped
  }

  async find_many(data: CognitoFindManyParams): Promise<{
    num_items: number
    num_pages: number
    data: any[]
    mapped: any[]
  }> {
    const res = await $axios.get(this.baseurl(), {
      params: data,
    })
    res.data.mapped = this.map(res.data.data)
    return res.data
  }

  async find_one_mapped(data: CognitoFindOneParams): Promise<any> {
    const item = await this.find_one(data)
    return new this.constructor(item)
  }

  async find_one(data: CognitoFindOneParams): Promise<any> {
    if (data.id) {
      const id = data.id
      delete data.id
      const res = await $axios.get(`${this.baseurl()}/${id}`, {
        params: data,
      })
      return res.data
    }
    const url = data.url
    delete data.url
    const res = await $axios.get(`${this.baseurl()}/${url}`, {
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

  async delete(): Promise<{
    success: boolean
    item: any
    error: string
  }> {
    const res = await $axios.post(`${this.baseurl()}/delete`, this)
    return res.data
  }

  async addPhoto(uuid: string, key: string, name: string): Promise<{
    success: boolean
    item: any
    error: string
  }> {
    const res = await $axios.post(`${this.baseurl()}/addPhoto`, {
      id: this.id,
      model: this.modelname(),
      uuid,
      name,
      key,
    })
    return res.data
  }

  fileDownloadUrl(hash: string): string {
    return `/api/v1/cognito/default/file/${hash}`
  }
}

export { CognitoBase, CognitoFindManyParams, CognitoFindOneParams }
