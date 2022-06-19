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
      <input v-model="signup.email" type="text" required placeholder="Email" :class="inputClass">
      <input v-if="!omitFirstName" v-model="signup.first_name" type="text" required placeholder="First Name" :class="inputClass">
      <input v-if="!omitLastName" v-model="signup.last_name" type="text" required placeholder="Last Name" :class="inputClass">
      <input type="submit" :value="submitText" :class="btnClass">
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
import { $axios } from '~cognito/plugins/axios'
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
    default: 'grid grid-cols-1 md:grid-cols-4 gap-2',
  },
  inputClass: {
    type: String,
    default: 'appearance-none block rounded-md my-1 px-2 py-2 shadow-md dark:shadow-inner placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-slate-600 dark:text-gray-400',
  },
  btnClass: {
    type: String,
    default: 'shadow py-2 my-1 px-2 rounded-lg text-center select-none bg-indigo-600 dark:bg-blue-600 cursor-pointer hover:bg-indigo-700 dark:hover:bg-blue-700 sm:text-sm text-white',
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
  $axios
    .post('/api/v1/cognito/mailerlite/subscribe', signup.value)
    .then((res: any) => {
      is_loading.value = false
      if (res.data.success) {
        success.value = true
        message.value = props.successMessage
        return
      }
      fail.value = true
      message.value = res.data.error
    })
}
</script>
