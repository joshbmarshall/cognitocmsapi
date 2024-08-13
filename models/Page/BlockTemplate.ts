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

  fullwidth: boolean

  constructor(source?: Partial<PageBlockTemplate>) {
    this.name = ''
    this.fields = []
    this.fullwidth = false
    Object.assign(this, source)
  }
}

export { PageBlockTemplate }
