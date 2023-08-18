<template>
  <div v-show="open" class="relative z-10" @close="open = false">
    <div class="fixed inset-0" />

    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <transition
            enter-from-class="translate-x-full"
            enter-to-class="translate-x-0"
            leave-class="transform transition ease-in-out duration-500 sm:duration-700"
            leave-from-class="translate-x-0"
            leave-to-class="translate-x-full"
            class="transition duration-500 ease-in-out sm:duration-700"
          >
            <div v-if="open" class="pointer-events-auto w-screen max-w-md">
              <div class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                <div class="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                  <div class="px-4 sm:px-6">
                    <div class="flex items-start justify-between">
                      <div class="text-base font-semibold leading-6 text-gray-900">
                        {{ props.title }}
                      </div>
                      <div class="ml-3 flex h-7 items-center">
                        <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" @click="open = false">
                          <span class="sr-only">Close panel</span>
                          <i-heroicons-outline:x class="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="relative mt-6 flex-1 px-4 sm:px-6">
                    <!-- Your content -->
                    <slot
                      :submitted="submitted"
                      :signup="signup"
                      :is_loading="is_loading"
                      :message="message"
                      :success="success"
                      :fail="fail"
                    >
                      Put your text and form in the slot
                    </slot>
                    <cgn-spinner v-if="is_loading" />
                    <cgn-alert-success v-if="success">
                      {{ message }}
                    </cgn-alert-success>
                    <cgn-alert-danger v-if="fail">
                      {{ message }}
                    </cgn-alert-danger>
                  </div>
                </div>
                <!--
                  <div class="flex flex-shrink-0 justify-end px-4 py-4">
                    <button type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400" @click="open = false">
                      Cancel
                    </button>
                    <button type="submit" class="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                      Save
                    </button>
                  </div>
                  -->
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CognitoMailerlite } from '~cognito/models/Cognito/Mailerlite'
import { NewsletterSubscriber } from '~cognito/models/Newsletter/Subscriber'

const props = defineProps({
  title: {
    type: String,
  },
  newsletterType: {
    type: String,
    default: 'mailerlite',
  },
  successMessage: {
    type: String,
    default: 'Subscription successful',
  },
})
const open = ref(false)
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
const newsletterStore = useNewsletterStore()
const checkPopup = () => {
  if (newsletterStore.shouldIshow()) {
    open.value = true
    newsletterStore.recordOpened(1440) // Do not open for 1 day
  }
}
onMounted(() => {
  setInterval(checkPopup, 60000)
})
</script>
