<template>
  <div>
    Examples below
  </div>
  <div>
    <FormInput v-model="inputText" label="This is label" />
    <FormInput v-model="inputText" type="password" label="This is password" />
  </div>
  <FormProgress :progress="25" />
  <div>
    {{ inputText }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CognitoTest } from './models/CognitoTest'
import { FormInput } from './index'

const inputText = ref('')
const test = ref(new CognitoTest())
</script>
