import { $axios } from '~cognito/plugins/axios'

class NewsletterSubscriber {
  async subscribe(data: {
    email: string
    first_name?: string
    last_name?: string
  }): Promise<{
    success: string
    message: string
  }> {
    const res = await $axios
      .post('/api/v1/newsletter/subscriber/subscribe', {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      })
    return res.data
  }
}

export { NewsletterSubscriber }
