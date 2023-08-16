import { CognitoBase } from '../Cognito/Base'
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
  body_style_id: EventVehicleBodyStyle
  registration: string
  registration_state_id: CognitoState
  registration_expiry: string
  induction_type: EventVehicleInductionType
  induction_type_id: number
  engine_type: EventVehicleEngineType
  engine_type_id: number
  vehicle_owner: string
  owner_mobile: string

  baseurl() {
    return '/api/v1/event/vehicle'
  }

  constructor(source?: Partial<EventVehicle>) {
    super()
    this.make = ''
    this.year_of_manufacture = ''
    this.model = ''
    this.colour = ''
    this.body_style_id = new EventVehicleBodyStyle()
    this.registration = ''
    this.registration_state_id = new CognitoState()
    this.induction_type = new EventVehicleInductionType()
    this.induction_type_id = 0
    this.engine_type = new EventVehicleEngineType()
    this.engine_type_id = 0
    this.vehicle_owner = ''
    this.owner_mobile = ''
    this.registration_expiry = ''
    Object.assign(this, source)
  }

  registrationHasExpired(): boolean {
    return new CognitoTime(this.registration_expiry).isPast()
  }
}

export { EventVehicle }
