<template>
  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md text-sm text-center">
    Already have an account?
    <cgn-link
      to="/login"
      color-brand
    >
      Log in now
    </cgn-link>
  </div>
  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white dark:bg-darkbg-700 py-8 px-4 drop-shadow-lg rounded-lg sm:px-10">
      <form v-if="!sentEmail" class="space-y-4" @submit.prevent="registerAccount()">
        <div class="flex flex-col sm:flex-row gap-4">
          <cgn-form-input-text
            v-model="formValues.first_name"
            label="First name"
            type="text"
            class="w-full sm:w-1/2"
            required
          />
          <cgn-form-input-text
            v-model="formValues.last_name"
            label="Last name"
            type="text"
            class="w-full sm:w-1/2"
            required
          />
        </div>

        <cgn-form-input-email v-model="formValues.email" label="Email address" type="email" required />

        <cgn-button color-brand fullwidth submit>
          Sign up
          <cgn-spinner v-if="isLoading" />
        </cgn-button>
      </form>
      <cgn-account-test-otp-code v-else :username="formValues.email" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { $axios } from '~cognito/plugins/axios'

const isLoading = ref(false)
const sentEmail = ref(false)
const formValues = ref({
  first_name: '',
  last_name: '',
  email: '',
  fingerprint: useUserStore().getAuthFingerprint(),
})

function registerAccount() {
  isLoading.value = true
  // check that the user doesn't already have a profile, add their profile to the system
  $axios
    .post('/api/v1/cognito/user/registerLink', formValues.value)
    .then(() => {
      sentEmail.value = true
    })
    .catch(() => {
      useToastStore().addToast('Problem signing up', 'danger', 5000)
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>
