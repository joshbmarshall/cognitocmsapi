import { CognitoBase } from '~cognito/models/Cognito/Base'
import { $axios } from '~cognito/plugins/axios'

class ClubMembershipType extends CognitoBase {
  name: string
  subtitle: string
  price: string

  constructor(source?: Partial<ClubMembershipType>) {
    super()
    this.name = ''
    this.subtitle = ''
    this.price = ''
    Object.assign(this, source)
  }

  modelname(): string {
    return 'Club\\MembershipType'
  }

  baseurl(): string {
    return '/api/v1/club/membershipType'
  }

  async getCanPurchase(): Promise<ClubMembershipType[]> {
    const res = await $axios.get('/api/v1/club/membershipType/getCanPurchase')
    return res.data
  }

  renew() {
    const formValues = {
      type_id: this.id,
      url: btoa(location.href),
    }
    $axios.post(`${this.baseurl()}/renew`, formValues)
      .then((res) => {
        if (res.data.success) {
          window.location = res.data.payment
        }
      })
  }

  apply(applicationForm: any) {
    const formValues = {
      form: applicationForm,
      url: btoa(location.href),
    }
    $axios.post(`${this.baseurl()}/apply`, formValues)
      .then((res) => {
        if (res.data.success) {
          window.location = res.data.payment
        }
      })
  }
}

export { ClubMembershipType }
