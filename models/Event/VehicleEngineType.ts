import { CognitoBase } from '../Cognito/Base'

class EventVehicleEngineType extends CognitoBase {
  name: string

  baseurl() {
    return '/api/v1/event/vehicleEngineType'
  }

  constructor(source?: Partial<EventVehicleEngineType>) {
    super()
    this.name = ''
    Object.assign(this, source)
  }
}

export { EventVehicleEngineType }
