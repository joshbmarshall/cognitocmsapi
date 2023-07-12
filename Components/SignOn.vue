<template>
  <!--
  <pre class="text-xs">{{ signer }}</pre>
  -->
  <cgn-alert-danger v-if="!signonType.id">
    Can't find that sign on type
  </cgn-alert-danger>
  <cgn-alert-danger v-else-if="signer.already_signed_on">
    You have already signed on
  </cgn-alert-danger>
  <div v-else class="max-w-md w-full mx-auto bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div v-if="form_success">
      <div class="p-2 bg-green-400 text-white w-full">
        <i-heroicons-solid:check />
      </div>
      <div class="p-8 pt-4" v-html="signonType.success_content" />
    </div>
    <form v-if="!form_success" class="p-8 pt-6" @submit.prevent="submitForm">
      <cgn-form-input v-model="signer.first_name" label="First Name" required />
      <cgn-form-input v-model="signer.last_name" label="Last Name" required />
      <cgn-form-input v-if="!blankSigner?.date_of_birth" v-model="signer.date_of_birth" label="Date of Birth" required inputmask="date" placeholder="dd/mm/yyyy" />
      <cgn-form-input v-if="!blankSigner?.phone" v-model="signer.phone" type="phone" label="Phone" required />
      <cgn-form-input v-if="!blankSigner?.email" v-model="signer.email" type="email" label="Email" required />
      <cgn-address-lookup
        v-if="!blankSigner?.address?.line1"
        v-model="signer.address"
        here-api-key="GOBLSSIkkrgjhMahFmXPramj-95rVXZYpj-0pj7DsFU"
        label="Address"
        required
      />
      <cgn-form-input v-if="!blankSigner?.emergency_contact" v-model="signer.emergency_contact" label="Emergency Contact" required />
      <cgn-form-input v-if="!blankSigner?.emergency_contact_phone" v-model="signer.emergency_contact_phone" type="phone" label="Emergency Contact Phone" required />
      <div v-for="indemnity in signonType.indemnities" :key="indemnity.id">
        <div class="mt-2" v-html="indemnity.content" />
        <div class="text-lg mt-2">
          <label>
            <input type="checkbox" required>
            I have read, understood &amp; agree to the above terms &amp; conditions
          </label>
        </div>
      </div>
      <cgn-form-instant-photo v-model="signer.photo" label="Your photo" file-button-label="Take Photo" class="mt-2" />
      <small>
        It is compulsory to take a photo
      </small>
      <div class="flex flex-col gap-8 sm:gap-5 mt-2">
        <SignaturePad
          ref="signaturePad" width="100%" height="200"
          class="border-4 border-solid border-gray-400 rounded-md"
        />
      </div>

      <div v-if="show_parent_details" class="mt-8">
        <span class="text-lg">Parent / Guardian details</span>
        <cgn-form-input v-model="signer.adult_name" label="Name" required />
        <cgn-form-input v-model="signer.adult_relationship" label="Parent / Guardian relationship" required />
        <cgn-form-input v-if="!blankSigner?.adult_phone" v-model="signer.adult_phone" type="phone" label="Phone" required />
        <cgn-form-input v-if="!blankSigner?.adult_email" v-model="signer.adult_email" type="email" label="Email" required />
        <cgn-address-lookup
          v-if="!blankSigner?.adult_address?.line1"
          v-model="signer.adult_address"
          here-api-key="GOBLSSIkkrgjhMahFmXPramj-95rVXZYpj-0pj7DsFU"
          label="Address"
          required
        />
        <div v-for="indemnity in signonType.indemnities" :key="indemnity.id">
          <div v-if="indemnity.adult_terms_for_minor_content">
            <div class="mt-2" v-html="indemnity.adult_terms_for_minor_content" />
            <div class="text-lg mt-2">
              <label>
                <input type="checkbox" required>
                I have read, understood &amp; agree to the above terms &amp; conditions
              </label>
            </div>
          </div>
        </div>
        <cgn-form-instant-photo v-model="signer.adult_photo" label="Photo" class="mt-2" />
        <div class="flex flex-col gap-8 sm:gap-5">
          <SignaturePad
            ref="adult_signaturePad" width="100%" height="200"
            class="border-4 border-solid border-gray-400 rounded-md"
          />
        </div>
      </div>

      <cgn-alert-danger v-if="form_error" class="mt-2">
        {{ form_error }}
      </cgn-alert-danger>
      <div class="flex justify-end">
        <cgn-button color-brand submit :disabled="form_disabled">
          Sign on now
        </cgn-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import SignaturePad from 'vue3-signature-pad'
import { SignonSignOn } from '~cognito/models/Signon/SignOn'
import { SignonType } from '~cognito/models/Signon/Type'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  blankSigner: {
    type: SignonSignOn,
  },
})

const signer = ref<SignonSignOn>(new SignonSignOn())
const signaturePad = ref()
const adult_signaturePad = ref()

const form_disabled = ref(false)
const form_success = ref(false)
const form_error = ref('')

const signonType = ref<SignonType>(new SignonType())

const show_parent_details = computed(() => {
  if (signer.value.isMinor()) {
    return true
  }
  return false
})

const testAdultSignature = () => {
  if (!show_parent_details.value) {
    return false
  }
  const { isEmpty, data } = adult_signaturePad.value.saveSignature()

  if (isEmpty) {
    return false
  }
  return data
}

const submitForm = () => {
  form_disabled.value = true
  form_error.value = ''

  if (!signer.value.address?.city) {
    form_error.value = 'Please enter your address'
    form_disabled.value = false
    return
  }

  if (!signer.value.photo) {
    form_error.value = 'Please take your photo'
    form_disabled.value = false
    return
  }
  const { isEmpty, data } = signaturePad.value.saveSignature()

  signer.value.signature = data

  if (isEmpty) {
    form_error.value = 'Missing your signature. Please sign in the box above'
    form_disabled.value = false
    return
  }

  if (signer.value.isMinor()) {
    if (!signer.value.adult_address?.city) {
      form_error.value = 'Please enter the adult\'s address'
      form_disabled.value = false
      return
    }

    if (!signer.value.adult_photo) {
      form_error.value = 'Please take the adult\'s photo'
      form_disabled.value = false
      return
    }
    signer.value.adult_signature = testAdultSignature()

    if (!signer.value.adult_signature) {
      form_error.value = 'Missing the adult\'s signature. Please sign in the box above'
      form_disabled.value = false
      return
    }
  }

  (new SignonSignOn(signer.value)).create()
    .then((data) => {
      form_success.value = data.success
      form_error.value = data.error
      if (form_success.value) {
        window.scrollTo(0, 0)
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      } else {
        form_disabled.value = false
      }
    })
    .catch(() => {
      form_disabled.value = false
    })
  return false
}
const loadType = () => {
  window.scrollTo(0, 0)
  if (props.blankSigner) {
    signer.value = new SignonSignOn(props.blankSigner)
  }

  new SignonType({ url: props.type }).getDetails(signer.value.extra_term_ids).then((data) => {
    signonType.value = data
    signer.value.type_id = signonType.value.id
    signer.value.indemnity_ids = signonType.value.indemnities.map(e => e.id)
  })
}
watch (() => props.type, loadType)
watch (() => props.blankSigner?.first_name, loadType)
onMounted(() => {
  loadType()
})
</script>
