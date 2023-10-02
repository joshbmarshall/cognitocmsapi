class CognitoMapSite {
  id: string
  pos_x: number
  pos_y: number
  pos_width: number
  pos_height: number
  rotation: number
  available: boolean
  hoverText: string

  is_hovered?: boolean
  hover_x?: number
  hover_y?: number
  align?: string
  valign?: string
  x?: number
  y?: number
  width?: number
  height?: number
  fill?: string
  stroke?: string
  opacity?: string
  strokeWidth?: number

  baseurl(): string {
    return '/api/v1/cognito/mapSite'
  }

  constructor(source?: Partial<CognitoMapSite>) {
    this.pos_x = 0
    this.pos_y = 0
    this.pos_width = 0
    this.pos_height = 0
    this.rotation = 0
    this.available = false
    this.hoverText = ''
    Object.assign(this, source)
  }
}

export { CognitoMapSite }
