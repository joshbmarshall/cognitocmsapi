<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        <div v-if="signingIn">
          Signing you in
        </div>
        <div v-else-if="formSubmitted">
          Check your email
        </div>
        <div v-else>
          Send Sign In Link
        </div>
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="rounded-lg bg-white px-4 py-8 drop-shadow-lg dark:bg-darkbg-700 sm:px-10">
        <div v-if="signingIn" class="text-center">
          <cgn-spinner />
        </div>
        <div v-else-if="formSubmitted" class="text-center">
          <div v-if="sending">
            <div class="mb-3">
              Sending you a link to sign in
            </div>
            <cgn-spinner />
          </div>
          <div v-else>
            <cgn-account-test-otp-code :username="username" />
          </div>
        </div>

        <form v-else @submit.prevent="sendLink">
          <p v-if="!createAccountMode">
            Please enter your email below to log in or sign up.
          </p>
          <cgn-form-input-email v-model="username" label="Email address" required />
          <div v-if="createAccountMode">
            <cgn-alert-info>
              Account not found.
              Add your details to create an account.
            </cgn-alert-info>
            <cgn-form-input-text v-model="first_name" label="First Name" required />
            <cgn-form-input-text v-model="last_name" label="Last Name" required />
            <cgn-form-input-date-of-birth
              v-if="config.signUp.ask_date_of_birth"
              v-model="date_of_birth"
              label="Date of Birth"
              required
            />
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
        <div v-if="showOtherLogins">
          <div class="text-center">
            -- OR --
          </div>
          <div v-if="showGoogleLogin" class="text-right">
            <cgn-button color-danger :url="`${config.baseURL}/cms/cognito/default/goToSite/google`" fullwidth>
              <i-ri:google-fill class="inline" />
              Log on with Google
            </cgn-button>
          </div>
          <div v-if="showLogonPasswordLink" class="text-right">
            <cgn-button color-secondary :url="`${config.baseURL}/cms/cognito/default/goToSite`" fullwidth>
              Log on with a password
            </cgn-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { config } from '~/config'
import { CognitoUser } from '~cognito/models/Cognito/User'
import { $axios } from '~cognito/plugins/axios'

const sending = ref(false)
const formSubmitted = ref(false)
const createAccountMode = ref(false)
const errorMessage = ref('')
const username = ref('')
const first_name = ref('')
const last_name = ref('')
const date_of_birth = ref('')
const signingIn = ref(false)

const sendLink = () => {
  formSubmitted.value = true
  sending.value = true
  errorMessage.value = ''
  if (createAccountMode.value) {
    new CognitoUser().signup({
      email: username.value,
      first_name: first_name.value,
      last_name: last_name.value,
      date_of_birth: date_of_birth.value,
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
      .catch((error) => {
        formSubmitted.value = false
        sending.value = false
        createAccountMode.value = error.response.data.message == 'User not found'
        errorMessage.value = error.response.data.content
      })
  }
}
const showLogonPasswordLink = computed(() => {
  if (createAccountMode.value) {
    return false
  }
  if (config.login.code_only) {
    return false
  }
  return true
})

const showGoogleLogin = computed(() => {
  return config.login.google
})

const showOtherLogins = computed(() => {
  if (showLogonPasswordLink.value) {
    return true
  }
  if (showGoogleLogin.value) {
    return true
  }
  return false
})

onMounted(async () => {
  if ($axios.isSSR()) {
    return
  }
  signingIn.value = true
  await $axios.tokenlogin()
  signingIn.value = false
})
</script>
