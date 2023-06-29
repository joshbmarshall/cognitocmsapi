<template>
  <div>
    We've sent you a link to sign in to your account
    <form class="space-y-6" @submit.prevent="testResetCode">
      <cgn-form-input-text v-model="otp" label="OTP code" required />

      <cgn-alert-danger v-if="errorMessage">
        {{ errorMessage }}
      </cgn-alert-danger>
      <div>
        <cgn-button
          type="submit"
          color-brand
          fullwidth
        >
          Use one-time code
        </cgn-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { CognitoUser } from '~cognito/models/Cognito/User'
import { login } from '~cognito/plugins/axios'

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const otp = ref('')
const errorMessage = ref('')

function testResetCode() {
  errorMessage.value = ''
  // test server with OTP, only proceed if correct, get back password from server
  new CognitoUser().checkRecoveryCode({
    email: props.username,
    code: otp.value,
  })
    .then((data) => {
      if (data.message) {
        errorMessage.value = data.message
      } else {
        login(props.username, data.newPassword, router)
      }
    })
    .catch(() => {
      errorMessage.value = 'OTP Incorrect'
    })
}
</script>
