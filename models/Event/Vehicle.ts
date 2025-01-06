import { CognitoBase } from '../Cognito/Base'
import { CognitoImage } from '../Cognito/Image'
import { CognitoState } from '../Cognito/State'
import { CognitoTime } from '../Cognito/Time'
import { EventVehicleBodyStyle } from './VehicleBodyStyle'
import { EventVehicleEngineType } from './VehicleEngineType'
import { EventVehicleInductionType } from './VehicleInductionType'

class EventVehicle extends CognitoBase {
  make: string
  year_of_manufacture: string
  model: string
  colour: string
  body_style_id: number
  body_style: EventVehicleBodyStyle
  registration: string
  registration_state_id: number
  registration_state: CognitoState
  registration_expiry: string
  induction_type: EventVehicleInductionType
  induction_type_id: number
  engine_type: EventVehicleEngineType
  engine_type_id: number
  vehicle_owner: string
  racing_number?: number
  owner_mobile: string
  photo: CognitoImage

  baseurl() {
    return '/api/v1/event/vehicle'
  }

  constructor(source?: Partial<EventVehicle>) {
    super()
    this.make = ''
    this.year_of_manufacture = ''
    this.model = ''
    this.colour = ''
    this.body_style_id = 0
    this.body_style = new EventVehicleBodyStyle()
    this.registration = ''
    this.registration_state_id = 0
    this.registration_state = new CognitoState()
    this.induction_type = new EventVehicleInductionType()
    this.induction_type_id = 0
    this.engine_type = new EventVehicleEngineType()
    this.engine_type_id = 0
    this.vehicle_owner = ''
    this.owner_mobile = ''
    this.registration_expiry = ''
    Object.assign(this, source)
    this.photo = new CognitoImage(source?.photo)
  }

  registrationHasExpired(): boolean {
    if (!this.registration_expiry) {
      return true
    }
    return new CognitoTime(this.registration_expiry).isPast()
  }
}

export { EventVehicle }
