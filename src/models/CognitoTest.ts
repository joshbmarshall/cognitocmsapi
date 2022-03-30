class CognitoTest {
  id: string
  platform: string // 'vimeo', 'youtube'
  name: string
  slug: string
  length: number
  slate: string

  constructor(source?: Partial<CognitoTest>) {
    this.id = ''
    this.platform = 'youtube'
    this.name = ''
    this.slug = ''
    this.length = 0
    this.slate = ''
    Object.assign(this, source)
  }
}

export { CognitoTest }
