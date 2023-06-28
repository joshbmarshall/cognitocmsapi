import { CognitoBase } from '../Cognito/Base'

class EventVehicleBodyStyle extends CognitoBase {
  name: string

  baseurl() {
    return '/api/v1/event/vehicleBodyStyle'
  }

  constructor(source?: Partial<EventVehicleBodyStyle>) {
    super()
    this.name = ''
    Object.assign(this, source)
  }
}

export { EventVehicleBodyStyle }
