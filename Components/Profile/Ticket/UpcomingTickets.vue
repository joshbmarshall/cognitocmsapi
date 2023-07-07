<template>
  <div
    v-if="tickets.length > 0"
    class="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg"
  >
    <div class="p-3 bg-gray-100 dark:bg-gray-800">
      <span class="capitalize text-xl">Upcoming Tickets</span>
    </div>
    <div>
      <div
        v-for="(ticket, index) in tickets"
        :key="index"
        class="divide-y-2"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800 divide-gray-400 dark:divide-gray-600' : 'bg-white dark:bg-gray-900 divide-gray-300 dark:divide-gray-700'"
      >
        <div class="grid grid-cols-3 gap-2 p-3 select-none">
          <div>
            {{ ticket.display_name }}
          </div>
          <div>
            {{ ticket.valid_from.toHumanDateString(true) }}
          </div>
          <div class="flex justify-end">
            <router-link :to="`/print-tickets/${ticket.id}`" title="Print tickets" target="_blank">
              <i-heroicons-solid:printer
                class="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
              />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TicketTicket } from '~cognito/models/Ticket/Ticket'

const tickets = ref<TicketTicket[]>([])

onMounted(() => {
  new TicketTicket().myUpcomingEntries()
    .then((data) => {
      tickets.value = data
    })
})
</script>
