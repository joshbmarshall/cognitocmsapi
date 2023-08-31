<template>
  <div
    v-if="documents.length > 0"
    class="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900"
  >
    <div class="bg-gray-100 p-3 dark:bg-gray-800">
      <span class="text-xl capitalize">My Documents</span>
    </div>
    <div>
      <div
        v-for="(document, index) in documents"
        :key="index"
        class="divide-y-2"
        :class="index % 2 ? 'bg-gray-100 dark:bg-gray-800 divide-gray-400 dark:divide-gray-600' : 'bg-white dark:bg-gray-900 divide-gray-300 dark:divide-gray-700'"
      >
        <div class="grid select-none grid-cols-3 gap-2 p-3">
          <div>
            {{ document.type.name }}
            <div class="text-muted text-sm">
              Exp: {{ document.expiry.toHumanDateString(true) }}
            </div>
          </div>
          <div class="text-center">
            <cgn-link :to="document.download_url">
              <i-heroicons-solid:download class="inline" />
            </cgn-link>
          </div>
          <div class="text-right">
            <cgn-button is-label color-brand title="Upload new" @click="selectDocument(document)">
              <i-heroicons-solid:upload class="inline" />
            </cgn-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <cgn-modal v-model="showModal">
    <template #content>
      <form @submit.prevent="uploadDocument">
        <cgn-form-input-file v-model="newDocument" :label="`Upload new ${selectedDocument?.type.name} Document`" required />
        <cgn-form-input v-model="newDocumentExpiry" type="date" label="Expiry Date" required />
        <cgn-button color-brand>
          Upload
        </cgn-button>
      </form>
    </template>
  </cgn-modal>
</template>

<script setup lang="ts">
import { CognitoUserDocument } from '~cognito/models/Cognito/UserDocument'

const showModal = ref(false)
const documents = ref<CognitoUserDocument[]>([])

const selectedDocument = ref<CognitoUserDocument | null>(null)

const newDocument = ref('')
const newDocumentExpiry = ref('')

const selectDocument = (document: CognitoUserDocument) => {
  selectedDocument.value = document
  showModal.value = true
}

const loadDocuments = () => {
  new CognitoUserDocument().myList()
    .then((data) => {
      documents.value = data
    })
}

const uploadDocument = () => {
  new CognitoUserDocument({
    type_id: selectedDocument.value?.type.id,
    expiry: newDocumentExpiry.value,
    file: newDocument.value,
  }).save()
    .then(() => {
      useToastStore().addToast('Document Uploaded', 'success', 3000)
      showModal.value = false
      loadDocuments()
    })
}

onMounted(() => {
  loadDocuments()
})
</script>
