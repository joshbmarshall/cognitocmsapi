import { CognitoBase } from '../Cognito/Base'
import { CognitoTime } from '../Cognito/Time'
import { EventEngineType } from './EngineType'
import { EventInductionType } from './InductionType'

class EventVehicle extends CognitoBase {
  make: string
  year_of_manufacture: string
  model: string
  colour: string
  body_style: string
  registration: string
  registration_state: string
  registration_expiry: CognitoTime
  induction_type: EventInductionType
  engine_type: EventEngineType
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
    this.body_style = ''
    this.registration = ''
    this.registration_state = ''
    this.induction_type = new EventInductionType()
    this.engine_type = new EventEngineType()
    this.vehicle_owner = ''
    this.owner_mobile = ''
    Object.assign(this, source)
    this.registration_expiry = new CognitoTime(source?.registration_expiry)
  }
}

export { EventVehicle }
