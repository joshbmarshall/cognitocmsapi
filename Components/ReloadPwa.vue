<template>
  <div
    v-if="needRefresh"
    class="fixed inset-x-0 bottom-0 z-50 p-2"
  >
    <div class="ml-auto w-full max-w-sm">
      <cgn-alert-brand dismiss-after="6000">
        <span>
          New content available
        </span>
        <template #btn>
          <cgn-button color-brand @click="updateServiceWorker()">
            Update
          </cgn-button>
        </template>
      </cgn-alert-brand>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()
</script>
