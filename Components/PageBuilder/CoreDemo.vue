<template>
  <div class="max-w-7xl w-full p-2 mx-auto flex flex-col gap-6">
    <div>
      <!-- ALERTS, notification blocks to give feedback -->
      <h1 class="text-3xl font-display">
        Alerts
      </h1>
      <cgn-alert-base>alert base! ALERT</cgn-alert-base>
      <cgn-alert-danger>Danger alert</cgn-alert-danger>
      <cgn-alert-warning>warning alert, also info</cgn-alert-warning>
      <cgn-alert-success>Success! your form has been submitted</cgn-alert-success>
    </div>
    <div>
      <!-- FORM INPUTS, all things form related -->
      <h1 class="text-3xl font-display">
        Form inputs
      </h1>
      <cgn-form-label label="form label" />
      <cgn-form-input label="form input" />
      <cgn-form-input placeholder="unlabeled field" />
      <cgn-form-input-email required label="email input" />
      <cgn-form-input-password suggest-password required label="password input" />
      <cgn-form-input-text label="form input text" placeholder="text placeholder" />
      <cgn-form-input-textarea label="form input textarea" />
      <cgn-form-instant-photo label="form instant photo" />

      <cgn-address-lookup
        v-model="address_lookup_modelvalue" :here-api-key="here_api_key"
        label="Address lookup"
      />
      <span>Address lookup address: {{ address_lookup_modelvalue }}</span>

      <cgn-form-dropdown :options="dropdown_options" label="form dropdown" />

      <cgn-upload-image label="upload an image" required />

      <cgn-button url="/" disabled color-brand>
        disabled button
      </cgn-button>
      <cgn-button url="/" color-brand>
        button with url
      </cgn-button>
      <cgn-button url="/" newtab color-brand>
        button with url, opens in new tab
      </cgn-button>
      <cgn-button class="bg-yellow-400 hover:bg-yellow-500 dark:hover:bg-yellow-300 text-yellow-900" @click="modal_open = true">
        custom coloured modal button
      </cgn-button>
      <cgn-button color-primary @click="toast_fail_open = true">
        Primary toast fail button
      </cgn-button>
      <cgn-button fullwidth color-secondary @click="toast_success_open = true">
        fullwidth secondary toast success button
      </cgn-button>
    </div>

    <div>
      <!-- NAVIGATION, for getting around the site -->
      <h1 class="text-3xl font-display">
        Navigation
      </h1>
      <span class="text-lg">breadcrumbs</span>
      <cgn-breadcrumb :links="breadcrumbs_dummydata" />
      <span class="text-lg">pagination</span>
      <cgn-pagination :page-count="15" url-prefix="articles" />
    </div>

    <div>
      <!-- LOGINS, for allowing users to access their accounts -->
      <h1 class="text-3xl font-display">
        Logins
      </h1>
      <span class="text-lg">login</span>
      <cgn-login />
      <span class="text-lg">forgot password</span>
      <cgn-forgot-password />
    </div>

    <div>
      <!-- MISC, random items that don't fit into a category -->
      <h1 class="text-3xl font-display">
        Misc
      </h1>
      <span class="text-lg">cart shipping quote</span>
      <cgn-cart-shipping-quote />

      <span class="text-lg">newsletter sign up</span>
      <cgn-newsletter-sign-up />

      <span class="text-lg">social sharing</span>
      <cgn-social-share
        url="/sitelink" title="Absolutely epic demopage!" description="Go test it now!" facebook twitter
        linkedin
      />

      <span class="text-lg">progress bar</span>
      <cgn-progress :progress="32" />

      <span class="text-lg">spinner icon</span>
      <cgn-spinner />
    </div>

    <div>
      <!-- MODALS and TOASTS, absolute popups used to notify users of something significant -->
      <cgn-modal v-model="modal_open">
        <template #icon>
          <div
            class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 sm:h-10 sm:w-10"
          >
            <i-heroicons-solid:exclamation />
          </div>
        </template>
        <template #content>
          this is some modal content
        </template>
        <template #clean-content>
          this is clean content, it works best when there is no icon
        </template>
        <template #button-footer>
          <div class="px-2 flex flex-col md:flex-row gap-2 justify-between w-full">
            <cgn-button color-info>
              Button Info
            </cgn-button>
            <cgn-button color-warning>
              Button Warning
            </cgn-button>
            <cgn-button color-danger>
              Button Danger
            </cgn-button>
            <cgn-button color-success>
              Button Success
            </cgn-button>
            <cgn-button color-brand>
              Button Brand
            </cgn-button>
          </div>
        </template>
      </cgn-modal>
      <cgn-toast
        v-model="toast_fail_open" type="fail"
        message="you have failed me! You probably did something wrong"
      />
      <cgn-toast v-model="toast_success_open" type="success" message="you did it! Congratulations!" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CognitoAddressLookup } from '~cognito/models/Cognito/AddressLookup'

const address_lookup_modelvalue = ref(new CognitoAddressLookup())
const here_api_key = ref('GOBLSSIkkrgjhMahFmXPramj-95rVXZYpj-0pj7DsFU')

const dropdown_options = ref([
  { name: 'Cheese', id: 1 },
  { name: 'Cake', id: 1 },
  { name: 'Icecream', id: 1 },
  { name: 'Chocolate', id: 1 },
])

const modal_open = ref(false)
const toast_fail_open = ref(false)
const toast_success_open = ref(false)

const breadcrumbs_dummydata = ref([
  { name: 'Articles', url: '/articles' },
  { name: 'Food', url: '/articles/food' },
  { name: 'Icecream is bad', url: '/article/icecream-is-bad' },
])
// TODO update all cgn blocks with new colors and inputs
// TODO make sure all sites get updated tailwind.css and tailwind config
</script>
