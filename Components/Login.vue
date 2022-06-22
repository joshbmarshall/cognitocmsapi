<template>
  <form @submit.prevent="userLogin">
    <ss-input-email v-model="username" label="Email address" required />
    <ss-input-password v-model="password" label="Password" required type="password" suggest-password />
    <div
      v-if="isWrongPassword"
      class="
              transition
              duration-150
              ease-in-out
              w-full
              bg-white
              dark:bg-gray-800
              shadow
              rounded
              flex
              items-center
              flex-row
              justify-between
            "
    >
      <div class="flex items-center flex-row">
        <div class="mr-3 p-2 bg-red-400 rounded-l text-white">
          <i-heroicons-solid:exclamation />
        </div>
        <p
          class="
                  mr-2
                  my-0
                  text-sm
                  dark:text-gray-400
                  text-gray-600 text-left
                "
        >
          Password incorrect
        </p>
        <div
          class="h-1 w-1 bg-gray-300 dark:bg-gray-700 rounded-full mr-2"
        />
        <ss-link
          to="/forgotpassword"
        >
          Forgot?
        </ss-link>
      </div>
    </div>

    <ss-button
      submit
      extra-classes="w-full"
    >
      <span :class="isLoading ? 'pr-4' : ''">Sign in</span>
      <cgn-spinner v-if="isLoading" />
    </ss-button>
    <div class="flex items-center justify-between">
      <div class="flex items-center" />
      <div class="text-sm">
        <ss-link
          to="/forgotpassword"
        >
          Forgot your password?
        </ss-link>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { login } from '~cognito/plugins/axios'
const router = useRouter()
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const isWrongPassword = ref(false)
const userLogin = async () => {
  isLoading.value = true
  isWrongPassword.value = false
  isWrongPassword.value = !(await login(username.value, password.value, router))
  isLoading.value = false
}
</script>
