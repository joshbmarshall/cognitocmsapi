<template>
  <div class="flex flex-row gap-2 p-6">
    <cgn-spinner />
    Please wait, loading...
  </div>
</template>

<script setup lang="ts">
import { TicketTicket } from '~cognito/models/Ticket/Ticket'

const props = defineProps({
  id: {
    type: String,
  },
})
function loadTicket() {
  new TicketTicket().printTickets(props.id)
    .then((data) => {
      window.location = data.pdf
    })
}
onMounted(() => {
  loadTicket()
})
</script>
