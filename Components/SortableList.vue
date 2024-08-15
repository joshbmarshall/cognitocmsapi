<template>
  <div ref="sortableList">
    <slot :key="slotKey">
      <div v-for="item in items" :key="item" class="my-1 flex items-center divide-x divide-gray-500 rounded bg-gray-200">
        <div class="handle cursor-grab text-lg">
          <i-mdi:drag-vertical />
        </div>
        <div class="px-2">
          {{ item }}
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import Sortable from 'sortablejs'

const emit = defineEmits(['reordered'])

const items = defineModel<any[]>({ required: true })

const sortableList = ref()

const slotKey = ref(nanoid())

const createSortable = (elementRef: any) => {
  Sortable.create(elementRef, {
    animation: 150,
    handle: '.handle',
    ghostClass: 'opacity-50',
    forceFallback: true,
    fallbackTolerance: 3,
    swapThreshold: 0.6,

    onUpdate(event) {
      items.value.splice(event.newIndex || 0, 0, items.value.splice(event.oldIndex || 0, 1)[0])
      console.log(event.oldIndex, event.newIndex)
      emit('reordered')

      event.item.remove() // remove the item to stop sortablejs from conflicting with vue
      slotKey.value = nanoid() // change the key so list regenerates, otherwise items won't come back
    },
  })
}

onMounted(() => {
  createSortable(sortableList.value)
})

onUnmounted(() => {
  if (!sortableList.value) {
    return
  }
  sortableList.value.destroy()
})
</script>
