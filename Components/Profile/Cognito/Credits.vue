<template>
  <div v-if="creditBalance > 0">
    <div class="overflow-hidden rounded-lg bg-green-100 text-black shadow">
      <div class="p-4">
        <div class="flex items-center">
          <div class="shrink-0">
            <i-heroicons-solid:currency-dollar />
          </div>
          <div class="ml-4 w-0 flex-1">
            <dl>
              <dt class="truncate text-sm font-medium text-gray-500">
                Credit Balance
              </dt>
              <dd>
                <div class="text-lg font-medium text-gray-900">
                  ${{ creditBalance.toFixed(2) }}
                </div>
              </dd>
            </dl>
            <div class="text-xs text-gray-500">
              To use with your next purchase
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { config } from '~/config'
import { CognitoUser } from '~cognito/models/Cognito/User'

const creditBalance = ref(0)

onMounted(() => {
  new CognitoUser().creditBalance(config.payment_to_user_id).then((data) => {
    creditBalance.value = data
  })
})
</script>
