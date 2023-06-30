<template>
  <div>
    <cgn-modal v-model="fail" :timeout="3000">
      <template #icon>
        <div
          class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 sm:h-10 sm:w-10"
        >
          <i-heroicons-solid:exclamation />
        </div>
      </template>

      <template #content>
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white select-none">
          Failed
        </h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500 dark:text-gray-400 select-none">
            {{ message }}
          </p>
        </div>
      </template>

      <template #button-footer>
        <div class="px-4 py-2">
          <cgn-button color-brand @click="fail = false">
            Close
          </cgn-button>
        </div>
      </template>
    </cgn-modal>

    <cgn-modal v-model="success" :timeout="3000">
      <template #icon>
        <div
          class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-80 dark:bg-green-800 dark:text-green-100 sm:h-10 sm:w-10"
        >
          <i-heroicons-solid:check />
        </div>
      </template>

      <template #content>
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white select-none">
          Success!
        </h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500 dark:text-gray-400 select-none">
            {{ message }}
          </p>
        </div>
      </template>

      <template #button-footer>
        <div class="px-4 py-2">
          <cgn-button color-brand @click="success = false">
            Close
          </cgn-button>
        </div>
      </template>
    </cgn-modal>

    <div>
      <form class="max-w-4xl px-4 py-8 mx-auto space-y-4" @submit.prevent="submitted">
        <div class="space-y-8 sm:space-y-5">
          <div class="flex flex-row justify-between gap-8 sm:gap-5">
            <div class="text-xl">
              <span class="text-lg text-gray-700 dark:text-gray-300">Welcome</span>
              {{ userStore.user.first_name }}
              {{ userStore.user.last_name }}
              <span
                v-if="!name_field_visible"
                class="block sm:inline-block text-xs cursor-pointer sm:pl-1"
                @click="changeName()"
              >change</span>
            </div>
            <div
              class="text-right font-medium cursor-pointer"
              title="logout"
              @click="logout()"
            >
              <i-heroicons-solid:logout />
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-2">
            <cgn-form-input-text
              v-if="name_field_visible"
              v-model="userStore.user.first_name"
              label="First name"
              required
            />
            <cgn-form-input-text
              v-if="name_field_visible"
              v-model="userStore.user.last_name"
              label="Last name"
              required
            />

            <cgn-form-image
              v-model="formValues.image"
              :thumbnail="userStore.user.thumbnail"
              :width="160"
              label="Photo"
            />

            <cgn-form-input-email v-model="formValues.email" label="Email" required />
            <cgn-form-input-phone
              v-model="formValues.mobile_phone"
              label="Phone"
              required
            />

            <cgn-form-input-text
              v-model="formValues.drivers_licence_number"
              label="Drivers Licence Number"
            />
            <cgn-form-input
              v-model="formValues.drivers_licence_expiry"
              type="date"
              label="Drivers Licence Expiry"
            />
            <cgn-form-dropdown v-model="formValues.drivers_licence_state_of_issue_id" :options="states" label="Drivers Licence State of Issue" />

            <cgn-form-input-text
              v-model="formValues.emergency_contact_name"
              label="Emergency Contact Name"
            />
            <cgn-form-input-phone
              v-model="formValues.emergency_contact_phone"
              label="Emergency Contact Phone"
            />
          </div>

          <cgn-button color-brand submit>
            <span class="flex flex-row gap-2 items-center">
              Submit
              <cgn-spinner v-if="is_loading" />
            </span>
          </cgn-button>

          <div v-if="isEcommerce">
            <cgn-profile-previous-orders />
            <cgn-profile-sell-addresses />
          </div>

          <ProfileElements />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEcommerce } from '~/config'
import { CognitoState } from '~cognito/models/Cognito/State'
import { $axios, getUser } from '~cognito/plugins/axios'

const router = useRouter()
const userStore = useUserStore()

const is_loading = ref(false)
const success = ref(false)
const fail = ref(false)
const message = ref('')
const formValues = ref({
  id: userStore.user.id,
  first_name: '',
  last_name: '',
  email: '',
  mobile_phone: '',
  newpassword: '',
  drivers_licence_number: '',
  drivers_licence_expiry: '',
  drivers_licence_state_of_issue_id: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  image: '',
  addresses: [],
})
const states = ref<CognitoState[]>([])

const name_field_visible = ref(false)
function changeName() {
  name_field_visible.value = true
}
function submitted() {
  is_loading.value = true
  $axios
    .post('/api/v1/cognito/user/update', formValues.value)
    .then((res: any) => {
      formValues.value = res.data.item
      is_loading.value = false
      if (res.data.success) {
        success.value = true
        message.value = 'Profile has been updated successfully'
        getUser()
        return
      }
      fail.value = true
      message.value = res.data.error
    })
}
function logout() {
  router.push('/logout')
}

onMounted(async () => {
  await getUser()
  states.value = (await new CognitoState().find_many({})).data
  formValues.value = userStore.user
})
</script>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
