<template>
  <div
    v-if="stallSites.length > 0"
    class="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900"
  >
    <div class="bg-gray-100 p-3 dark:bg-gray-800">
      <span class="text-xl capitalize">Upcoming Stall Sites</span>
    </div>
    <div>
      <div
        v-for="(stallSite, index) in stallSites"
        :key="index"
        class="divide-y-2"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800 divide-gray-400 dark:divide-gray-600' : 'bg-white dark:bg-gray-900 divide-gray-300 dark:divide-gray-700'"
      >
        <div class="grid select-none grid-cols-3 gap-2 p-3">
          <div>
            {{ stallSite.event }}
            <div class="text-muted text-sm">
              {{ stallSite.date.toHumanDateString(true) }}
            </div>
          </div>
          <div>
            {{ stallSite.name }}
          </div>
          <div class="text-right">
            <span v-if="stallSite.approved">
              Approved
            </span>
            <span v-else>
              Awaiting Approval
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventStallSite } from '~cognito/models/Event/StallSite'

const stallSites = ref<EventStallSite[]>([])

onMounted(() => {
  new EventStallSite().myUpcoming()
    .then((data) => {
      stallSites.value = data
    })
})
</script>
