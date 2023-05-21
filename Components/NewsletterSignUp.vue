<template>
  <slot
    :signup="signup"
    :submitted="submitted"
    :is_loading="is_loading"
    :message="message"
    :success="success"
    :fail="fail"
  >
    <form :class="formClass" @submit.prevent="submitted">
      <cgn-form-input-email v-model="signup.email" required label="Email" />
      <cgn-form-input v-if="!omitFirstName" v-model="signup.first_name" required label="First Name" />
      <cgn-form-input v-if="!omitLastName" v-model="signup.last_name" required label="Last Name" />
      <div class="flex items-end">
        <cgn-button submit color-brand fullwidth="">
          {{ submitText }}
        </cgn-button>
      </div>
    </form>
    <cgn-spinner v-if="is_loading" />
    <cgn-alert-success v-if="success">
      {{ message }}
    </cgn-alert-success>
    <cgn-alert-danger v-if="fail">
      {{ message }}
    </cgn-alert-danger>
  </slot>
</template>

<script setup lang="ts">
import { CognitoMailerlite } from '~cognito/models/Cognito/Mailerlite'
import { NewsletterSubscriber } from '~cognito/models/Newsletter/Subscriber'

const props = defineProps({
  omitFirstName: {
    type: Boolean,
    default: false,
  },
  omitLastName: {
    type: Boolean,
    default: false,
  },
  submitText: {
    type: String,
    default: 'Sign me up',
  },
  successMessage: {
    type: String,
    default: 'Subscription successful',
  },
  formClass: {
    type: String,
    default: 'grid md:grid-flow-col auto-cols-max gap-2',
  },
  newsletterType: {
    type: String,
    default: 'mailerlite',
  },
})

const signup = ref({
  email: '',
  first_name: '',
  last_name: '',
})
const is_loading = ref(false)
const success = ref(false)
const fail = ref(false)
const message = ref('')

const submitted = () => {
  is_loading.value = true
  success.value = false
  fail.value = false

  if (props.newsletterType === 'mailerlite') {
    new CognitoMailerlite().subscribe(signup.value)
      .then((data: any) => {
        is_loading.value = false
        if (data.success) {
          success.value = true
          message.value = props.successMessage
          return
        }
        fail.value = true
        message.value = data.error
      })
  } else {
    new NewsletterSubscriber().subscribe(signup.value)
      .then((data: any) => {
        is_loading.value = false
        if (data.success) {
          success.value = true
          message.value = props.successMessage
          return
        }
        fail.value = true
        message.value = data.error
      })
  }
}
</script>
