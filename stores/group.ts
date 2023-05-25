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
      groups_encoded: '[]',
      lastUpdate: new CognitoTime('2000-01-01').toDateTimeString(),
    }
  },

  actions: {
    async getGroup(model: string, url: string): Promise<CognitoGroup> {
      let groups = JSON.parse(this.groups_encoded)
      if (groups.length == 0) {
        await this.loadGroups()
        groups = JSON.parse(this.groups_encoded)
      }
      const group = groups.find(e => e.url == url && e.model == model)
      return Promise.resolve(new CognitoGroup(group))
    },
    async loadGroups() {
      const res = await $axios.get('/api/v1/cognito/group', {
        params: {
          image_aspect: this.image_aspect,
          image_width: this.image_width,
        },
      })
      this.groups_encoded = JSON.stringify(res.data.data)
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
