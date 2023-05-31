<template>
  <div class="min-h-full flex flex-col justify-center py-12 px-6">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Recover your password
      </h2>
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-slate-800 py-8 px-4 drop-shadow-lg rounded-lg sm:px-10">
        <form v-if="password" class="space-y-6" @submit.prevent="userLogin">
          <div>
            <cgn-form-input-text v-model="password" label="Your new password" readonly />
          </div>
          <div>
            <cgn-button
              type="submit"
              color-brand
              fullwidth
            >
              <span :class="login_loading ? 'pr-4' : ''">Sign in</span>
              <cgn-spinner v-if="login_loading" />
            </cgn-button>
          </div>
        </form>
        <form v-else-if="success" class="space-y-6" @submit.prevent="testResetCode">
          <cgn-form-input-text v-model="otp" label="OTP code" required />

          <div>
            <cgn-button
              type="submit"
              color-brand
              fullwidth
            >
              Test code
            </cgn-button>
          </div>
        </form>
        <form v-else class="space-y-6" @submit.prevent="sendResetCode">
          <cgn-form-input-email v-model="username" label="Email address" required />
          <div>
            <cgn-button
              type="submit"
              color-brand
              fullwidth
            >
              Email reset code
            </cgn-button>
          </div>
        </form>
        <cgn-alert-danger v-if="message" class="mt-2">
          {{ message }}
        </cgn-alert-danger>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CognitoUser } from '~cognito/models/Cognito/User'
import { login } from '~cognito/plugins/axios'

const router = useRouter()

const username = ref('')
const password = ref('')
const otp = ref('')
const message = ref('')
const success = ref(false)
const login_loading = ref(false)
async function userLogin() {
  try {
    // start spinner
    login_loading.value = true
    await login(username.value, password.value, router)
  } catch (err) {
    // Error shouldn't happen but notify just in case
    alert(err)
  }
  // stop spinner
  login_loading.value = false
}
function sendResetCode() {
  // get server to send reset code email, only proceed if email is in system
  new CognitoUser().recoverPassword(username.value)
    .then((data) => {
      success.value = data.success
      message.value = ''
    })
    .catch(() => {
      message.value = 'User not found'
    })
}
function testResetCode() {
  // test server with OTP, only proceed if correct, get back password from server
  new CognitoUser().checkRecoveryCode({
    email: username.value,
    code: otp.value,
  })
    .then((data) => {
      password.value = data.newPassword
      message.value = ''
    })
    .catch(() => {
      message.value = 'OTP Incorrect'
    })
}
</script>
