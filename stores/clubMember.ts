import { acceptHMRUpdate, defineStore } from 'pinia'
import { format } from 'date-fns'
import { $axios } from '~cognito/plugins/axios'
import { CognitoTime } from '~cognito/models/Cognito/Time'

export const useClubMemberStore = defineStore({
  id: 'clubmember',

  state: () => {
    return {
      number: 0,
      racers_id: 0,
      name: '',
      valid_to: '',
    }
  },
  getters: {
    valid_to_formatted(state) {
      if (!state.valid_to) {
        return ''
      }
      return format(new Date(state.valid_to), 'do LLL yyyy')
    },
    canRenew(state) {
      if (!state.valid_to) {
        return true
      }
      return new CognitoTime(state.valid_to).subMonths(1).isPast()
    },
    needsRenewal(state) {
      if (!state.valid_to) {
        return true
      }
      return new CognitoTime(state.valid_to).isPast()
    },
  },
  actions: {
    refresh() {
      $axios.get('/api/v1/club/member/getMembership')
        .then((res) => {
          this.number = res.data.number
          this.name = res.data.name
          this.valid_to = res.data.valid_to
          this.racers_id = res.data.racers_id
        })
    },
    setRacersId(racers_id: number) {
      this.racers_id = racers_id
      // Send to site
      $axios.post('/api/v1/club/member/setRacersId', {
        racers_id,
      })
    },
  },
  persist: true,
  share: {
    enable: true,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useClubMemberStore, import.meta.hot))
}