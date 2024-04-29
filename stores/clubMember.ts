import { acceptHMRUpdate, defineStore } from 'pinia'
import { format } from 'date-fns'
import { $axios } from '~cognito/plugins/axios'
import { CognitoTime } from '~cognito/models/Cognito/Time'

export const useClubMemberStore = defineStore({
  id: 'clubmember',

  state: () => {
    return {
      number: '',
      racers_id: 0,
      name: '',
      additional_member: '',
      valid_to: '',
      hasPrior: false,
      is_approved: false,
      home_track: 0,
      type: '',
      color: '#ffffff',
      track_color: '#ffffff',
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
    async refresh() {
      const res = await $axios.get('/api/v1/club/member/getMembership')
      this.number = res.data.number
      this.name = res.data.name
      this.additional_member = res.data.additional_member
      this.valid_to = res.data.valid_to
      this.racers_id = res.data.racers_id
      this.type = res.data.type
      this.color = res.data.colour
      this.hasPrior = res.data.hasPrior
      this.is_approved = res.data.is_approved
      this.home_track = res.data.home_track
      this.track_color = res.data.track_color
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
