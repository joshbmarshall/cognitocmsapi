class PageBlockTemplate {
  name: string
  fields: {
    name: string
    display_name: string
    type: string
    default_value: any
    description: string
    options: string
  }[]

  constructor(source?: Partial<PageBlockTemplate>) {
    this.name = ''
    this.fields = []
    Object.assign(this, source)
  }
}

export { PageBlockTemplate }
