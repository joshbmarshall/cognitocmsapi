<template>
  <div
    v-if="entries.length > 0"
    class="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900"
  >
    <div class="bg-gray-100 p-3 dark:bg-gray-800">
      <span class="text-xl capitalize">Upcoming Entries</span>
    </div>
    <div>
      <div
        v-for="(entry, index) in entries"
        :key="index"
        class="divide-y-2"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800 divide-gray-400 dark:divide-gray-600' : 'bg-white dark:bg-gray-900 divide-gray-300 dark:divide-gray-700'"
      >
        <div class="grid select-none grid-cols-3 gap-2 p-3">
          <div>
            {{ entry.event }}
          </div>
          <div>
            {{ entry.name }}
          </div>
          <div class="text-right">
            {{ entry.date.toHumanDateString(true) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEntry } from '~cognito/models/Event/Entry'

const entries = ref<EventEntry[]>([])

onMounted(() => {
  new EventEntry().myUpcomingEntries()
    .then((data) => {
      entries.value = data
    })
})
</script>
