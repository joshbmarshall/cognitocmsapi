<template>
  <div v-if="payment_ok">
    <cgn-alert-success class="mx-auto my-2 w-full max-w-2xl">
      Payment Successful.
      Please check your email for your invoice.
    </cgn-alert-success>
  </div>
  <form
    v-else
    @submit.prevent="sendContactForm()"
  >
    <template v-if="formdata?.questions.length > 0">
      <div v-for="question in formdata.questions" :key="question.id">
        <div v-if="question.field_type == 'content'" class="prose max-w-none dark:prose-invert" v-html="question.content" />
        <pre v-else>{{ question }}</pre>
      </div>
    </template>

    <template v-else>
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
    </template>
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
import { CognitoPayment } from '~cognito/models/Cognito/Payment'
import { $axios } from '~cognito/plugins/axios'

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
const formdata = ref<CognitoForm>()
const userStore = useUserStore()
const payment_ok = ref(null)
const payment_failed = ref(false)
const payment = ref(new CognitoPayment())

const loadForm = async () => {
  const data = await new CognitoForm().find_one_mapped({ id: props.templatevar.form })
  formdata.value = data
  if (!formdata.value) {
    return
  }
  // Clean up labels with trailing <br>
  for (let index = 0; index < formdata.value.data.length; index++) {
    formdata.value.data[index].label = formdata.value.data[index].label.replace('<br>', '')
  }
  if (formdata.value.must_be_logged_on) {
    userStore.checkLoggedIn()
  }
}

const formValues = computed(() => {
  return formdata.value?.data.reduce((obj, item) => Object.assign(obj, { [item.name]: item.value }), {})
})

const sendContactForm = () => {
  if (!formdata.value) {
    return
  }
  is_loading.value = true
  formdata.value.submit(formValues.value)
    .then((data) => {
      console.log({ data })
      submitted_ok.value = data.success
      submission_error.value = data.error
      is_loading.value = false
      if (submitted_ok.value) {
        formdata.value.message = ''
      }
      if (data.payment) {
        window.location = data.payment
      }
    })
}
watch(() => props, loadForm, { deep: true })

onMounted(() => {
  const payum_token = new URL(location.href).searchParams.get('payum_token')
  const url = btoa(location.href)

  if (payum_token) {
    $axios
      .get(
        `/api/v1/cognito/payment/checkPaid?url=${url}&payum_token=${payum_token}`,
      )
      .then((res) => {
        payment_ok.value = res.data.success
        payment_failed.value = !res.data.success
        payment.value = res.data.payment
      })
  }
  loadForm()
})
// TODO autocomplete, checkbox group, hidden input, radio group, header sizes, individual questions
</script>
