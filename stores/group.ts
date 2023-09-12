import { acceptHMRUpdate, defineStore } from 'pinia'
import { CognitoGroup } from '~cognito/models/Cognito/Group'
import { $axios } from '~cognito/plugins/axios'
import { CognitoTime } from '~cognito/models/Cognito/Time'
import initialData from '~/initialData.json'
import { config } from '~/config.js'

export const useGroupStore = defineStore('group', {
  state: () => {
    return {
      groups: [],
      lastUpdate: new CognitoTime('2000-01-01').toDateTimeString(),
    }
  },

  actions: {
    async loadGroupsIfNone() {
      if (this.groups.length == 0) {
        await this.loadGroups()
      }
    },
    async getTopLevelGroup(model: string): Promise<CognitoGroup> {
      await this.loadGroupsIfNone()
      const group = this.groups.find(e => e.root == e.id && e.model == model)
      return new CognitoGroup(group)
    },
    async getGroup(model: string, url: string): Promise<CognitoGroup> {
      await this.loadGroupsIfNone()
      const group = this.groups.find(e => e.url == url && e.model == model)
      return new CognitoGroup(group)
    },
    async getParents(model: string, lft: number, rgt: number): Promise<CognitoGroup[]> {
      await this.loadGroupsIfNone()
      return new CognitoGroup().map(this.groups.filter(e => e.model == model && e.lft < lft && e.rgt > rgt))
    },
    async getChildren(model: string, lft: number, rgt: number, maxlevel: number): Promise<CognitoGroup[]> {
      await this.loadGroupsIfNone()
      return new CognitoGroup().map(this.groups.filter(e => e.model == model && e.lft > lft && e.rgt < rgt && e.level <= maxlevel))
    },
    async loadGroups() {
      this.groups = initialData.groups.data
      this.lastUpdate = new CognitoTime('').toDateTimeString()
      if ($axios.isSSR()) {
        return
      }
      setTimeout(async () => {
        const res = await $axios.get('/api/v1/cognito/group', {
          params: {
            image_aspect: config.group_args.image_aspect,
            image_width: config.group_args.image_width,
          },
        })
        this.groups = res.data.data
        this.lastUpdate = new CognitoTime('').toDateTimeString()
      }, 1000)
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
