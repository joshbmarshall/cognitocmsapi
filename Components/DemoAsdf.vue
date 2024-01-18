<template>
  <div class="">
    <div>
      <!-- ALERTS, notification blocks to give feedback -->
      <h1 class="font-display text-3xl">
        Alerts
      </h1>
      <cgn-alert-danger>Danger alert</cgn-alert-danger>
      <cgn-alert-warning>warning alert</cgn-alert-warning>
      <cgn-alert-info>info alert</cgn-alert-info>
      <cgn-alert-success>Success alert</cgn-alert-success>
      <cgn-alert-brand>Brand alert</cgn-alert-brand>
      <cgn-alert-primary>Primary alert</cgn-alert-primary>
      <cgn-alert-secondary>
        Secondary alert
      </cgn-alert-secondary>
      <cgn-alert color="bg-slate-300">
        Custom icon and colour
        <template #icon>
          <i-heroicons-solid:chevron-double-right />
        </template>
      </cgn-alert>
      <cgn-alert-info>
        With action button
        <template #btn>
          <cgn-button color-info>
            Button
          </cgn-button>
        </template>
      </cgn-alert-info>
      <cgn-alert-info dismissable>
        Dismissable alert with action button
        <template #btn>
          <cgn-button color-info>
            Button
          </cgn-button>
        </template>
      </cgn-alert-info>
      <cgn-alert-info dismissable>
        Dismissable alert
      </cgn-alert-info>
      <cgn-alert-info dismiss-after="3000">
        Auto-dismissed alert after 3 seconds
      </cgn-alert-info>
    </div>
    <div>
      <!-- Badges -->
      <h1 class="font-display text-3xl">
        Badges
      </h1>
      <cgn-badge-danger>Danger badge</cgn-badge-danger>
      <cgn-badge-warning>warning badge</cgn-badge-warning>
      <cgn-badge-info>info badge</cgn-badge-info>
      <cgn-badge-success>Success badge</cgn-badge-success>
      <cgn-badge-brand>Brand badge</cgn-badge-brand>
      <cgn-badge-primary>Primary badge</cgn-badge-primary>
      <cgn-badge-secondary>
        Secondary badge
      </cgn-badge-secondary>
      <cgn-badge color="bg-slate-300 text-slate-800">
        Custom colour
      </cgn-badge>
    </div>
    <div>
      <!-- FORM INPUTS, all things form related -->
      <h1 class="font-display text-3xl">
        Form inputs
      </h1>
      <cgn-form-label label="form label" />
      <cgn-form-input label="form input" />
      <cgn-form-input placeholder="unlabeled field" />
      <cgn-form-input-email required label="email input" />
      <cgn-form-input-password suggest-password required label="password input" />
      <cgn-form-input-text label="form input text" placeholder="text placeholder" />
      <cgn-form-input-textarea label="form input textarea" />
      <cgn-form-dropdown label="form dropdown" :options="[{ id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' }]" />
      <cgn-form-radio-button label="form radio button" :options="[{ id: 1, name: 'Option 1', content: 'Second Line' }, { id: 2, name: 'Option 2' }]" />
      <cgn-form-instant-photo label="form instant photo" />
      <cgn-form-photos label="form multiple photos" />

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
      <cgn-button class="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 dark:hover:bg-yellow-300" @click="modal_open = true">
        custom coloured modal button
      </cgn-button>
      <cgn-button color-primary @click="toast_fail_open = true">
        Primary toast fail button
      </cgn-button>
      <cgn-button fullwidth color-secondary @click="toast_success_open = true">
        fullwidth secondary toast success button
      </cgn-button>
      <cgn-button size-large color-brand>
        Large button
      </cgn-button>
    </div>

    <div>
      <!-- NAVIGATION, for getting around the site -->
      <h1 class="font-display text-3xl">
        Navigation
      </h1>
      <span class="text-lg">breadcrumbs</span>
      <cgn-breadcrumb :links="breadcrumbs_dummydata" />
      <span class="text-lg">pagination</span>
      <cgn-pagination :page-count="15" url-prefix="articles" />
    </div>

    <div>
      <!-- LOGINS, for allowing users to access their accounts -->
      <h1 class="font-display text-3xl">
        Logins
      </h1>
      <span class="text-lg">login</span>
      <cgn-login />
      <span class="text-lg">forgot password</span>
      <cgn-forgot-password />
    </div>

    <div>
      <!-- MISC, random items that don't fit into a category -->
      <h1 class="font-display text-3xl">
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
            class="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 sm:size-10"
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
          <div class="flex w-full flex-col justify-between gap-2 px-2 md:flex-row">
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
