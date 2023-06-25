<template>
  <div class="min-h-full flex flex-col justify-center py-12 px-6">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        <div v-if="formSubmitted">
          Check your email
        </div>
        <div v-else>
          Send Sign In Link
        </div>
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-darkbg-700 py-8 px-4 drop-shadow-lg rounded-lg sm:px-10">
        <div v-if="formSubmitted" class="text-center">
          <div v-if="sending">
            <div class="mb-3">
              Sending you a link to sign in
            </div>
            <cgn-spinner />
          </div>
          <div v-else>
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
        </div>

        <form v-else @submit.prevent="sendLink">
          <cgn-form-input-email v-model="username" label="Email address" required />
          <div v-if="createAccountMode">
            <cgn-alert-info>
              Account not found.
              Add your details to create an account.
            </cgn-alert-info>
            <cgn-form-input-text v-model="first_name" label="First Name" required />
            <cgn-form-input-text v-model="last_name" label="Last Name" required />
          </div>
          <cgn-alert-danger v-if="errorMessage">
            {{ errorMessage }}
          </cgn-alert-danger>
          <cgn-button
            fullwidth
            color-brand
            submit
          >
            <span v-if="createAccountMode">
              Create Account
            </span>
            <span v-else>
              Send Email
            </span>
          </cgn-button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CognitoUser } from '~cognito/models/Cognito/User'
import { login } from '~cognito/plugins/axios'

const router = useRouter()
const sending = ref(false)
const formSubmitted = ref(false)
const createAccountMode = ref(false)
const errorMessage = ref('')
const username = ref('')
const first_name = ref('')
const last_name = ref('')
const otp = ref('')

const sendLink = () => {
  formSubmitted.value = true
  sending.value = true
  errorMessage.value = ''
  if (createAccountMode.value) {
    new CognitoUser().signup({
      email: username.value,
      first_name: first_name.value,
      last_name: last_name.value,
    })
      .then((data) => {
        errorMessage.value = data.error
        sending.value = false
        createAccountMode.value = false
      })
  } else {
    new CognitoUser().sendLoginLink(username.value)
      .then((data) => {
        errorMessage.value = data.error
        sending.value = false
      })
      .catch(() => {
        formSubmitted.value = false
        sending.value = false
        createAccountMode.value = true
      })
  }
}
function testResetCode() {
  errorMessage.value = ''
  // test server with OTP, only proceed if correct, get back password from server
  new CognitoUser().checkRecoveryCode({
    email: username.value,
    code: otp.value,
  })
    .then((data) => {
      if (data.message) {
        errorMessage.value = data.message
      } else {
        login(username.value, data.newPassword, router)
      }
    })
    .catch(() => {
      errorMessage.value = 'OTP Incorrect'
    })
}
</script>
