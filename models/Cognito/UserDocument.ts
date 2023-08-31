import { CognitoBase } from './Base'
import { CognitoTime } from './Time'
import { CognitoUserDocumentType } from './UserDocumentType'
import { $axios } from '~cognito/plugins/axios'

class CognitoUserDocument extends CognitoBase {
  type: CognitoUserDocumentType
  is_approved: boolean
  expiry: CognitoTime
  download_url: string
  baseurl(): string {
    return '/api/v1/cognito/userDocument'
  }

  constructor(source?: Partial<CognitoUserDocument>) {
    super()
    this.type = new CognitoUserDocumentType()
    this.is_approved = false
    this.download_url = ''
    Object.assign(this, source)
    this.expiry = new CognitoTime(source?.expiry)
  }

  async myList() {
    const data = await $axios.get(`${this.baseurl()}/myList`)
    return new CognitoUserDocument().map(data.data)
  }
}

export { CognitoUserDocument }
