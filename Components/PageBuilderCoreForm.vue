<template>
  <div>
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
        <div class="prose dark:prose-invert max-w-none">
          <p>{{ input.label }}</p>
        </div>
      </div>
      <div v-if="input.type == 'header'">
        <div class="prose dark:prose-invert max-w-none">
          <h1>{{ input.label }}</h1>
        </div>
      </div>
      <div v-if="input.type == 'button'">
        <cgn-button color-brand>
          {{ input.label }}
        </cgn-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CognitoForm } from '~cognito/models/Cognito/Form'
class Templatevars {
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})

const formdata = ref()

const form = new CognitoForm().find_one({ id: 2 }).then((data) => {
  formdata.value = data
})
// TODO autocomplete, checkbox group, hidden input, radio group, header sizes, form submit
// TODO id hardcoded?
</script>
