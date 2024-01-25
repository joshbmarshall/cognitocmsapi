<template>
  <div class="pointer-events-none fixed inset-x-0 top-0 z-50 p-2">
    <div v-for="toast in useToastStore().toasts" :key="toast.id" class="ml-auto w-full max-w-sm">
      <cgn-alert-success v-if="toast.type == 'success'">
        {{ toast.message }}
      </cgn-alert-success>
      <cgn-alert-info v-if="toast.type == 'info'">
        {{ toast.message }}
      </cgn-alert-info>
      <cgn-alert-danger v-if="toast.type == 'fail'">
        {{ toast.message }}
      </cgn-alert-danger>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '~cognito/stores/toast'
</script>
