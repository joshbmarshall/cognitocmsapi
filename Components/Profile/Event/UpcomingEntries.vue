<template>
  <div
    v-if="entries.length > 0"
    class="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg"
  >
    <div class="p-3 bg-gray-100 dark:bg-gray-800">
      <span class="capitalize text-xl">Upcoming Entries</span>
    </div>
    <div>
      <div
        v-for="(entry, index) in entries"
        :key="index"
        class="divide-y-2"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800 divide-gray-400 dark:divide-gray-600' : 'bg-white dark:bg-gray-900 divide-gray-300 dark:divide-gray-700'"
      >
        <div class="grid grid-cols-3 gap-2 p-3 select-none">
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
