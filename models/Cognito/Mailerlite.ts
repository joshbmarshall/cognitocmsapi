import { $axios } from '~cognito/plugins/axios'

class CognitoMailerlite {
  async subscribe(data: {
    email: string
    first_name?: string
    last_name?: string
  }): Promise<{
    success: string
    message: string
  }> {
    const res = await $axios
      .post('/api/v1/cognito/mailerlite/subscribe', {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      })
    return res.data
  }
}

export { CognitoMailerlite }
