<template>
  <form
    @submit.prevent="sendContactForm()"
  >
    <div v-for="input in formdata?.data" :key="input.name">
      <div v-if="input.type == 'text'">
        <cgn-form-input v-model="input.value" :type="input.subtype" :label="input.label" :placeholder="input.placeholder" :required="input.required" />
      </div>
      <div v-if="input.type == 'textarea'">
        <cgn-form-input-textarea v-model="input.value" :type="input.subtype" :label="input.label" :placeholder="input.placeholder" :required="input.required" />
      </div>
      <div v-if="input.type == 'number'">
        <cgn-form-input v-model="input.value" type="number" :label="input.label" :placeholder="input.placeholder" :required="input.required" :min-amount="input.min" :max-amount="input.max" />
      </div>
      <div v-if="input.type == 'date'">
        <cgn-form-input v-model="input.value" inputmask="date" :type="input.subtype" :label="input.label" placeholder="dd/mm/yyyy" :required="input.required" />
      </div>
      <div v-if="input.type == 'select'">
        <cgn-form-dropdown v-model="input.value" :options="input.values" :prompt="input.placeholder || '-- Select --'" :required="input.required" :label="input.label" />
      </div>
      <div v-if="input.type == 'paragraph'">
        <div class="prose max-w-none dark:prose-invert">
          <p>{{ input.label }}</p>
        </div>
      </div>
      <div v-if="input.type == 'header'">
        <div class="prose max-w-none dark:prose-invert">
          <h1>{{ input.label }}</h1>
        </div>
      </div>
      <div v-if="input.type == 'button' && !submitted_ok">
        <cgn-button color-brand>
          {{ input.label }}
        </cgn-button>
      </div>
    </div>
  </form>

  <cgn-alert-danger v-if="submission_error">
    {{ submission_error }}
  </cgn-alert-danger>
  <cgn-alert-success v-if="submitted_ok">
    Thank you, your message has been sent
  </cgn-alert-success>
</template>

<script lang="ts">
import { CognitoForm } from '~cognito/models/Cognito/Form'
import { CognitoFormSubmit } from '~cognito/models/Cognito/FormSubmit'

class Templatevars {
  form?: number
  framework?: string // unused
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})

const is_loading = ref(false)
const submitted_ok = ref(false)
const submission_error = ref('')
const formdata = ref()

const form = new CognitoForm().find_one({ id: props.templatevar.form }).then((data) => {
  formdata.value = data
  // Clean up labels with trailing <br>
  for (let index = 0; index < formdata.value.data.length; index++) {
    formdata.value.data[index].label = formdata.value.data[index].label.replace('<br>', '')
  }
})

const formValues = computed(() => {
  return formdata.value?.data.reduce((obj, item) => Object.assign(obj, { [item.name]: item.value }), {})
})

const sendContactForm = () => {
  is_loading.value = true
  new CognitoFormSubmit({
    form_id: props.templatevar.form,
    details: formValues.value,
  }).save()
    .then((data) => {
      submitted_ok.value = data.success
      submission_error.value = data.error
      is_loading.value = false
      if (submitted_ok.value) {
        formdata.value.message = ''
      }
    })
}
// TODO autocomplete, checkbox group, hidden input, radio group, header sizes
</script>
