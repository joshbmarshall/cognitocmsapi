import { CognitoBase } from '../Cognito/Base'

class EventVehicleInductionType extends CognitoBase {
  name: string

  baseurl() {
    return '/api/v1/event/vehicleInductionType'
  }

  constructor(source?: Partial<EventVehicleInductionType>) {
    super()
    this.name = ''
    Object.assign(this, source)
  }
}

export { EventVehicleInductionType }
