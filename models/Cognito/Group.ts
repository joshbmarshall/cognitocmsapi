import { CognitoImage } from './Image'
import { $axios } from '~cognito/plugins/axios'

class CognitoGroup {
  name: string
  slug: string
  content: string
  image: CognitoImage
  children: CognitoGroup[]

  constructor(source?: Partial<CognitoGroup>) {
    this.name = ''
    this.slug = ''
    this.content = ''
    this.image = new CognitoImage()
    this.children = []
    Object.assign(this, source)
  }

  async find_many(data: {
    namespace: string
    model: string
  }): Promise<CognitoGroup[]> {
    const res = await $axios.get(`/api/v1/cognito/group/${data.namespace}/${data.model}`)
    return res.data
  }

  async find_one(data: {
    namespace: string
    model: string
    group: string
  }): Promise<CognitoGroup> {
    const res = await $axios.get(`/api/v1/cognito/group/details/${data.namespace}/${data.model}/${data.group}`)
    return res.data
  }
}

export { CognitoGroup }
