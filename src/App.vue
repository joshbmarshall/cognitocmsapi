<template>
<div>
  Examples below
</div>
<div>
<FormInput label="This is label" v-model="inputText"></FormInput>
<FormInput type="password" label="This is password" v-model="inputText"></FormInput>
  </div>
  <div>
    {{ inputText }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInput } from './index'

const inputText = ref('')
</script>