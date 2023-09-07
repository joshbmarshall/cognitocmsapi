import { useRacersUserStore } from '~cognito/stores/racersUser'
import { CgnAxios } from '~cognito/plugins/cgnAxios'
import { config } from '~/config'

const $racersaxios = new CgnAxios({
  baseURL: 'https://racers.world',
  userStore: useRacersUserStore,
  clientId: config.racers.clientApiId,
})

export { $racersaxios }
