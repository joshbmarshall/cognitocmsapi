<template>
  <div
    v-if="tickets.length > 0"
    class="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900"
  >
    <div class="bg-gray-100 p-3 dark:bg-gray-800">
      <span class="text-xl capitalize">Upcoming Tickets</span>
    </div>
    <div>
      <div
        v-for="(ticket, index) in tickets"
        :key="index"
        class="divide-y-2"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800 divide-gray-400 dark:divide-gray-600' : 'bg-white dark:bg-gray-900 divide-gray-300 dark:divide-gray-700'"
      >
        <div class="grid select-none grid-cols-3 gap-2 p-3">
          <div>
            {{ ticket.display_name }}
          </div>
          <div>
            {{ ticket.valid_from.toHumanDateString(true) }}
          </div>
          <div class="flex justify-end">
            <router-link :to="`/print-tickets/${ticket.id}`" title="Print tickets" target="_blank">
              <i-heroicons-solid:printer
                class="cursor-pointer text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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
