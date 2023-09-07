import type { CognitoFindManyParams } from '~cognito/models/Cognito/Base'
import { CognitoBase } from '~cognito/models/Cognito/Base'
import type { CognitoPhoto } from '~cognito/models/Cognito/Photo'
import { $axios } from '~cognito/plugins/axios'

class ClubVehicle extends CognitoBase {
  make: string
  model: string
  colour: string
  special_vehicle: boolean
  photos: CognitoPhoto[]

  constructor(source?: Partial<ClubVehicle>) {
    super()
    this.make = ''
    this.model = ''
    this.colour = ''
    this.special_vehicle = false
    this.photos = []
    Object.assign(this, source)
  }

  modelname(): string {
    return 'Club\\Vehicle'
  }

  baseurl(): string {
    return '/api/v1/club/vehicle'
  }

  async myGarage(data: CognitoFindManyParams): Promise<{
    num_items: number
    num_pages: number
    data: any[]
  }> {
    const res = await $axios.get(`${this.baseurl()}/myGarage`, {
      params: data,
    })
    return res.data
  }
}

export { ClubVehicle }
