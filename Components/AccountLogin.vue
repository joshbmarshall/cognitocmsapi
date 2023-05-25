<template>
  <form @submit.prevent="userLogin">
    <cgn-form-input-email v-model="username" label="Email address" required />
    <cgn-form-input-password v-model="password" label="Password" required type="password" />
    <cgn-alert-danger
      v-if="isWrongPassword"
    >
      Password incorrect
      <cgn-link
        to="/forgotpassword"
        color-brand
        class="ml-3"
      >
        Forgot?
      </cgn-link>
    </cgn-alert-danger>

    <cgn-button
      fullwidth
      color-brand
      submit
    >
      Sign in
      <cgn-spinner v-if="isLoading" />
    </cgn-button>
    <div class="flex items-center justify-between">
      <div class="flex items-center" />
      <div class="text-sm">
        <cgn-link
          to="/forgotpassword"
          color-brand
        >
          Forgot your password?
        </cgn-link>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { login } from '~cognito/plugins/axios'
import { sitename } from '~/config'

const router = useRouter()
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const isWrongPassword = ref(false)
async function userLogin() {
  isLoading.value = true
  isWrongPassword.value = false
  isWrongPassword.value = !(await login(username.value, password.value, router))
  isLoading.value = false
}

useHead({
  title: `Log in - ${sitename}`,
  meta: [
    {
      name: 'description',
      content: '',
    },
  ],
})
</script>
