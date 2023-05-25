import { CognitoBase } from './Base'
import { CognitoImage } from './Image'
import { $axios } from '~cognito/plugins/axios'

class CognitoGroup extends CognitoBase {
  name: string
  url: string
  slug: string
  content: string
  image: CognitoImage
  children: CognitoGroup[]
  model: string
  root: number
  lft: number
  rgt: number
  level: number

  constructor(source?: Partial<CognitoGroup>) {
    super()
    this.name = ''
    this.url = ''
    this.slug = ''
    this.content = ''
    this.image = new CognitoImage()
    this.children = []
    this.model = ''
    this.root = 0
    this.lft = 0
    this.rgt = 0
    this.level = 0
    Object.assign(this, source)
  }

  async findByUrl(model: string, url: string): Promise<CognitoGroup> {
    return await useGroupStore().getGroup(model, url)
  }

  async getParents(): Promise<CognitoGroup[]> {
    return useGroupStore().getParents(this.model, this.lft, this.rgt)
  }

  async getChildren(): Promise<CognitoGroup[]> {
    return useGroupStore().getChildren(this.model, this.lft, this.rgt)
  }

  // deprecated
  async find_many(data: {
    namespace: string
    model: string
    image_aspect?: string
    image_width?: number
  }): Promise<CognitoGroup[]> {
    const res = await $axios.get(`/api/v1/cognito/group/${data.namespace}/${data.model}`, { params: data })
    return res.data
  }

  // deprecated
  async find_one(data: {
    namespace: string
    model: string
    group: string
    image_aspect?: string
    image_width?: number
  }): Promise<CognitoGroup> {
    const res = await $axios.get(`/api/v1/cognito/group/details/${data.namespace}/${data.model}/${data.group}`, {
      params: data,
    })
    return res.data
  }
}

export { CognitoGroup }
