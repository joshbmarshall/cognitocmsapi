<template>
  <div>
    <form v-if="password" class="space-y-6" @submit.prevent="userLogin">
      <div class="mt-1">
        <ss-input-read-only label="Your new password">
          {{ password }}
        </ss-input-read-only>
      </div>
      <div>
        <ss-button
          extra-classes="w-full"
        >
          Sign in
          <cgn-spinner v-if="login_loading" />
        </ss-button>
      </div>
    </form>
    <form v-else-if="success" class="space-y-6" @submit.prevent="testResetCode">
      <ss-input v-model="otp" label="OTP code" required />

      <div>
        <ss-button
          type="submit"
          extra-classes="w-full"
        >
          Test code
        </ss-button>
        <span>
          Please check your email for the recovery code. Remember to check your spam folder.
        </span>
        <!--
            <ss-button
              @click="sendResetCode"
            >
              Resend code
            </ss-button>
            -->
      </div>
    </form>
    <form v-else class="space-y-6" @submit.prevent="sendResetCode">
      <ss-input-email v-model="username" label="Email address" required />

      <div>
        <ss-button
          type="submit"
          extra-classes="w-full"
        >
          Email reset code
        </ss-button>
      </div>
    </form>
    <cgn-alert-danger v-if="message" class="mt-2">
      {{ message }}
      <div>{{ props.userNotFoundInfo }}</div>
    </cgn-alert-danger>
  </div>
</template>

<script setup lang="ts">
import { CognitoUser } from '~cognito/models/Cognito/User'
import { login } from '~cognito/plugins/axios'

const props = defineProps({
  userNotFoundInfo: {
    type: String,
  },
})

const router = useRouter()

const username = ref('')
const password = ref('')
const otp = ref('')
const message = ref('')
const success = ref(false)
const login_loading = ref(false)
const userLogin = async () => {
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
const sendResetCode = () => {
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
const testResetCode = () => {
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
