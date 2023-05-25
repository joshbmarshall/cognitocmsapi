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
    <div class="bg-white dark:bg-slate-800 py-8 px-4 drop-shadow-lg rounded-lg sm:px-10">
      <form class="space-y-4" @submit.prevent="registerAccount()">
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
        <cgn-form-input-password v-model="formValues.password" label="Password" type="password" suggest-password required />

        <cgn-button color-brand fullwidth submit>
          Sign up
          <cgn-spinner v-if="isLoading" />
        </cgn-button>
        <cgn-alert-danger v-if="errorMessage">
          An account with that email address already exists.
          Please recover your password.
          <router-link to="/forgotpassword" class="text-indigo-600 dark:text-indigo-300">
            Recover now
          </router-link>
        </cgn-alert-danger>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $axios, login } from '~cognito/plugins/axios'
import { sitename } from '~/config'

const router = useRouter()

const isLoading = ref(false)
const errorMessage = ref(false)
const formValues = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
})

function registerAccount() {
  isLoading.value = true
  // check that the user doesn't already have a profile, add their profile to the system
  $axios
    .post('/api/v1/cognito/user/register', formValues.value)
    .then(() => {
      login(formValues.value.email, formValues.value.password, router)
        .then((success) => {
          isLoading.value = false
          if (!success) {
            errorMessage.value = true
          }
        })
    })
    .catch(() => {
      alert('Problem signing up')
    })
}

useHead({
  title: `Sign up - ${sitename}`,
  meta: [
    {
      name: 'description',
      content: '',
    },
  ],
})
</script>
