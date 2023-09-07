import type { CognitoFindManyParams } from '~cognito/models/Cognito/Base'
import { CognitoBase } from '~cognito/models/Cognito/Base'
import { CognitoPhoto } from '~cognito/models/Cognito/Photo'
import { $axios } from '~cognito/plugins/axios'

class ClubSpecialVehicle extends CognitoBase {
  make: string
  model: string
  colour: string
  registration_number: string
  vin_chassis_number: string
  manufacture_month: string
  manufacture_year: string
  vehicle_photo: CognitoPhoto
  vin_photo: CognitoPhoto
  build_date_photo: CognitoPhoto

  constructor(source?: Partial<ClubSpecialVehicle>) {
    super()
    this.make = ''
    this.model = ''
    this.colour = ''
    this.registration_number = ''
    this.vin_chassis_number = ''
    this.manufacture_month = ''
    this.manufacture_year = ''
    this.vehicle_photo = new CognitoPhoto()
    this.vin_photo = new CognitoPhoto()
    this.build_date_photo = new CognitoPhoto()
    Object.assign(this, source)
  }

  modelname(): string {
    return 'Club\\SpecialVehicle'
  }

  baseurl(): string {
    return '/api/v1/club/specialVehicle'
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

export { ClubSpecialVehicle }
