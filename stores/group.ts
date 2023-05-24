import { acceptHMRUpdate, defineStore } from 'pinia'
import { CognitoGroup } from '~cognito/models/Cognito/Group'
import { $axios } from '~cognito/plugins/axios'
import { CognitoTime } from '~cognito/models/Cognito/Time'

export const useGroupStore = defineStore({
  id: 'group',

  state: () => {
    return {
      image_aspect: '1x1',
      image_width: 300,
      groups: <CognitoGroup[]>[],
      lastUpdate: new CognitoTime('2000-01-01').toDateTimeString(),
    }
  },

  actions: {
    async getGroup(model: string, url: string): Promise<CognitoGroup> {
      if (this.groups.length == 0) {
        await this.loadGroups()
      }
      const group = this.groups.find(e => e.url == url && e.model == model)
      return Promise.resolve(new CognitoGroup(group))
    },
    async loadGroups() {
      const res = await $axios.get('/api/v1/cognito/group', {
        params: {
          image_aspect: this.image_aspect,
          image_width: this.image_width,
        },
      })
      this.groups = res.data.data // For some reason this causes a Proxy object could not be cloned error
      this.lastUpdate = new CognitoTime('').toDateTimeString()
    },
  },

  persist: false,
  share: {
    enable: true,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGroupStore, import.meta.hot))
}
