import { acceptHMRUpdate, defineStore } from 'pinia'
import { TicketTicket } from '~cognito/models/Ticket/Ticket'

export const useTicketStore = defineStore({
  id: 'ticket',

  state: () => {
    return {
      tickets: <TicketTicket[]>[],
      used_tickets_unsent: <TicketTicket[]>[],
    }
  },

  actions: {
    check(id: string) {
      // Search for ticket
      const ticket = this.tickets.find(e => e.id == id)
      return ticket
    },
    async load() {
      this.tickets = await new TicketTicket().getList()
    },
  },

  persist: true,
  share: {
    enable: true,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTicketStore, import.meta.hot))
}
