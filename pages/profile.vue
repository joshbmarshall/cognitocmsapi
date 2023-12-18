<template>
  <div>
    <cgn-modal v-model="fail" :timeout="3000">
      <template #icon>
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 sm:h-10 sm:w-10"
        >
          <i-heroicons-solid:exclamation />
        </div>
      </template>

      <template #content>
        <h3 class="select-none text-lg font-medium leading-6 text-gray-900 dark:text-white">
          Failed
        </h3>
        <div class="mt-2">
          <p class="select-none text-sm text-gray-500 dark:text-gray-400">
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
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success-100 text-success-700 dark:bg-success-700 dark:text-success-100 sm:h-10 sm:w-10"
        >
          <i-heroicons-solid:check />
        </div>
      </template>

      <template #content>
        <h3 class="select-none text-lg font-medium leading-6 text-gray-900 dark:text-white">
          Success!
        </h3>
        <div class="mt-2">
          <p class="select-none text-sm text-gray-500 dark:text-gray-400">
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

    <div class="overflow-hidden">
      <div
        class="
          bg-gray-300
          py-12
          text-center
          font-display
          text-2xl
          uppercase
          dark:bg-darkbg-700
        "
      >
        User profile
      </div>
      <div class="mx-auto max-w-6xl">
        <label class="ml-2 mt-2 flex sm:ml-4">
          <cgn-upload-image
            v-slot="slot" v-model="headshot"
            :thumbnail="userStore.user.thumbnail"
            :on-success="uploadHeadshot"
          >
            <div
              class="
            -mt-16
            h-32
            w-32
            cursor-pointer
            select-none
            rounded-full
            border-4
            border-gray-50
            bg-gray-800/0
            bg-cover
            bg-center
            py-12 text-center
            font-medium
            text-white
            text-opacity-0
            bg-blend-overlay transition
            duration-200
            ease-in-out
            hover:bg-gray-800/90
            hover:text-opacity-100
          " :style="{ backgroundImage: `url(${slot.thumb})` }"
            >
              Edit headshot
            </div>
            <div>
              <div class="-ml-6 -mt-10 h-7 w-7 rounded-full bg-black/75 p-1 text-center text-white">
                <i-heroicons-solid:pencil />
              </div>
              <input type="file" class="hidden" @change="slot.upload">
            </div>
            <div>
              <cgn-progress v-if="slot.progress > 0" :progress="slot.progress" />
            </div>
          </cgn-upload-image>
        </label>
      </div>
    </div>
    <div>
      <form class="mx-auto max-w-4xl space-y-4 px-4 py-8" @submit.prevent="submitted">
        <div class="space-y-8 sm:space-y-5">
          <div class="flex flex-row justify-between gap-8 sm:gap-5">
            <div class="text-xl">
              <span class="text-lg text-gray-700 dark:text-gray-300">Welcome</span>
              {{ userStore.user.first_name }}
              {{ userStore.user.last_name }}
              <span
                v-if="!name_field_visible"
                class="block cursor-pointer text-xs sm:inline-block sm:pl-1"
                @click="changeName()"
              >change</span>
            </div>
            <div
              class="cursor-pointer text-right font-medium"
              title="logout"
              @click="logout()"
            >
              <i-heroicons-solid:logout />
            </div>
          </div>

          <cgn-profile-cognito-credits />

          <div class="grid gap-2 sm:grid-cols-2">
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

            <cgn-form-input-email v-model="formValues.email" label="Email" required />
            <cgn-form-input-phone
              v-model="formValues.mobile_phone"
              label="Phone"
              required
            />

            <cgn-form-input-date-of-birth
              v-if="config.profile.edit_date_of_birth"
              v-model="formValues.date_of_birth"
              label="Date of Birth"
            />

            <cgn-form-input-text
              v-if="config.profile.edit_company_name"
              v-model="formValues.company_name"
              label="Company Name"
            />

            <cgn-form-input-text
              v-if="config.profile.edit_abn"
              v-model="formValues.abn"
              label="ABN"
            />

            <cgn-form-input-text
              v-if="config.profile.edit_trading_name"
              v-model="formValues.trading_name"
              label="Trading Name"
            />

            <cgn-form-input-phone
              v-if="config.profile.edit_company_phone"
              v-model="formValues.company_phone"
              label="Company Phone"
            />

            <cgn-form-input-text
              v-if="config.profile.edit_website"
              v-model="formValues.website"
              label="Website"
            />

            <cgn-form-input-text
              v-if="config.profile.edit_facebook"
              v-model="formValues.facebook_link"
              label="Facebook"
            />

            <template v-if="config.profile.edit_drivers_licence">
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
            </template>

            <template v-if="config.profile.edit_emergency_contact">
              <cgn-form-input-text
                v-model="formValues.emergency_contact_name"
                label="Emergency Contact Name"
              />
              <cgn-form-input-phone
                v-model="formValues.emergency_contact_phone"
                label="Emergency Contact Phone"
              />
            </template>
          </div>

          <cgn-button color-brand submit>
            <span class="flex flex-row items-center gap-2">
              Save Profile
              <cgn-spinner v-if="is_loading" />
            </span>
          </cgn-button>

          <div v-if="config.isEcommerce">
            <cgn-profile-previous-orders />
            <cgn-profile-sell-addresses />
          </div>

          <cgn-profile-cognito-invoices />

          <cgn-profile-event-upcoming-entries />

          <cgn-profile-event-upcoming-stall-sites />

          <cgn-profile-event-my-documents />

          <cgn-profile-ticket-upcoming-tickets />

          <cgn-profile-cognito-addresses v-if="config.profile.manage_addresses" />

          <ProfileElements />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { config } from '~/config'
import { CognitoState } from '~cognito/models/Cognito/State'
import { CognitoUser } from '~cognito/models/Cognito/User'
import { $axios, getUser } from '~cognito/plugins/axios'

const router = useRouter()
const userStore = useUserStore()

const is_loading = ref(false)
const success = ref(false)
const fail = ref(false)
const message = ref('')
const headshot = ref('')
const formValues = ref({
  id: userStore.user.id,
  first_name: '',
  last_name: '',
  email: '',
  mobile_phone: '',
  date_of_birth: '',
  company_name: '',
  company_phone: '',
  trading_name: '',
  abn: '',
  website: '',
  facebook_link: '',
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

const uploadHeadshot = () => {
  new CognitoUser().uploadImage(headshot.value)
    .then((res) => {
      if (res.error) {
        fail.value = true
        message.value = res.error
      }
    })
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
