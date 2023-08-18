<template>
  <cgn-modal v-model="deleting_modal">
    <template #icon>
      <div
        class="
            flex h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-red-100
            text-red-800
            sm:h-10 sm:w-10
          "
      >
        <i-heroicons-solid:trash />
      </div>
    </template>
    <template #content>
      <h3 class="select-none text-lg font-medium leading-6 text-gray-900">
        Deleting {{ deleting_signon?.name }}
      </h3>
      <div class="mt-2">
        <cgn-lazy-image :image="deleting_signon?.photo" class="max-h-32 rounded-xl" />
        <div class="whitespace-pre-line font-medium">
          {{ deleting_signon?.extra_details }}
        </div>
      </div>
    </template>
    <template #button-footer>
      <div class="flex gap-6 px-4 py-3 sm:px-6">
        <button
          class="
              mt-4
              inline-flex
              w-full
              justify-center
              rounded-md
              bg-white
              px-4
              py-2
              font-medium
              text-gray-700
              drop-shadow
              hover:bg-gray-50
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              focus:ring-offset-2
              sm:mt-0 sm:w-auto sm:text-sm
            " @click="cancelRemove"
        >
          <span class="flex flex-row items-center gap-2">
            <i-heroicons-solid:x /> Cancel
          </span>
        </button>
        <button
          class="
              mt-4
              inline-flex
              w-full
              justify-center
              rounded-md
              bg-red-100
              px-4
              py-2
              text-base
              font-medium
              text-red-800
              drop-shadow
              hover:bg-red-200
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              focus:ring-offset-2
              sm:mt-0 sm:w-auto sm:text-sm
            " @click="confirmRemove"
        >
          <span class="flex flex-row items-center gap-2">
            <i-heroicons-solid:trash /> Delete
          </span>
        </button>
      </div>
    </template>
  </cgn-modal>
  <cgn-modal v-model="approving_modal">
    <template #icon>
      <div
        class="
            flex h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-green-100
            text-green-800
            sm:h-10 sm:w-10
          "
      >
        <i-heroicons-solid:check />
      </div>
    </template>
    <template #content>
      <h3 class="select-none text-lg font-medium leading-6 text-gray-900">
        Approving {{ approving_signon?.name }}
      </h3>
      <div class="mt-2">
        <cgn-lazy-image :image="approving_signon?.photo" class="max-h-32 rounded-xl" />
        <div class="whitespace-pre-line font-medium">
          {{ approving_signon?.extra_details }}
        </div>
      </div>
      <div v-if="approving_signon?.adult_name" class="mt-4 grid grid-cols-2">
        <span class="col-span-2 text-lg">Guardian details</span>
        <cgn-lazy-image :image="approving_signon?.adult_signature" class="max-h-20 rounded-md border-2 border-gray-200" />
        <cgn-lazy-image :image="approving_signon?.adult_photo" class="max-h-32 rounded-xl" />
        <div class="col-span-2 font-medium">
          <span class="block text-lg text-gray-800">{{ approving_signon?.adult_name }}</span>
          <span class="text-sm text-gray-700">{{ approving_signon?.adult_relationship }}</span>
        </div>
      </div>
      <div :style="{ backgroundColor: approving_signon?.armband_colour }" class="h-10 w-full" />
    </template>
    <template #button-footer>
      <div class="flex gap-6 px-4 py-3 sm:px-6">
        <button
          class="
              mt-4
              inline-flex
              w-full
              justify-center
              rounded-md
              bg-white
              px-4
              py-2
              font-medium
              text-gray-700
              drop-shadow
              hover:bg-gray-50
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              focus:ring-offset-2
              sm:mt-0 sm:w-auto sm:text-sm
            " @click="cancelApprove"
        >
          <span class="flex flex-row items-center gap-2">
            <i-heroicons-solid:x /> Cancel
          </span>
        </button>
        <button
          class="
              mt-4
              inline-flex
              w-full
              justify-center
              rounded-md
              bg-green-100
              px-4
              py-2
              text-base
              font-medium
              text-green-800
              drop-shadow
              hover:bg-green-200
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              focus:ring-offset-2
              sm:mt-0 sm:w-auto sm:text-sm
            " @click="confirmApprove"
        >
          <span class="flex flex-row items-center gap-2">
            <i-heroicons-solid:check /> Approve
          </span>
        </button>
      </div>
    </template>
  </cgn-modal>
  <div class="mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-gray-200 bg-white">
    <div class="grid grid-cols-2 gap-2 bg-gray-50 p-4 sm:grid-cols-3">
      <div class="flex gap-4 text-white">
        <button
          class="select-none rounded-lg border px-4 py-1.5 text-center drop-shadow"
          :class="order_by === 'name' ? 'text-indigo-800 border-indigo-600' : 'hover:bg-indigo-700 bg-indigo-600'"
          @click="order_by = 'latest'"
        >
          <span class="flex flex-row items-center gap-2">
            Latest
          </span>
        </button>
        <button
          class="select-none rounded-lg border px-4 py-1.5 text-center drop-shadow"
          :class="order_by === 'latest' ? 'text-indigo-800 border-indigo-600' : 'hover:bg-indigo-700 bg-indigo-600'"
          @click="order_by = 'name'"
        >
          <span class="flex flex-row items-center gap-2">
            Name A-Z
          </span>
        </button>
      </div>
      <div class="text-center">
        <span class="mt-1 block text-xl font-medium">{{ first_name }} {{ last_name }}</span>
      </div>
      <div style="font-size: 17px;" class="col-span-2 sm:col-span-1">
        <div class="relative my-1 rounded-md shadow-sm">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1 text-gray-500 dark:text-white"
          >
            <i-heroicons-solid:search />
          </div>
          <input
            v-model="search_term" type="text"
            class="block w-full appearance-none rounded-md p-2 pl-7 shadow-md placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
        </div>
      </div>
    </div>
    <div class="p-4">
      <div class="flex flex-col divide-y-2 divide-gray-200">
        <div v-if="!sign_ons_filtered.length" class="px-2 py-6">
          <div class="flex flex-col gap-2">
            <span class="text-xl">No sign ons found</span>
            <span v-if="search_term" class="cursor-pointer text-blue-700" @click="clearSearch">See all</span>
          </div>
        </div>
        <div
          v-for="sign_on in sign_ons_filtered" :key="sign_on.id"
          class="grid grid-cols-2 gap-4 px-2 py-6 sm:grid-cols-4"
        >
          <div class="flex flex-col gap-2 text-gray-500">
            <div>
              <cgn-lazy-image :image="sign_on.signature" class="max-h-20 rounded-md border-2 border-gray-200" />
            </div>
          </div>

          <div class="col-span-2">
            <cgn-lazy-image :image="sign_on.photo" class="max-h-32 rounded-xl" />
            <div class="pb-2 text-xl">
              {{ sign_on.name }}
            </div>
            <div class="whitespace-pre-line font-medium">
              {{ sign_on?.extra_details }}
            </div>
          </div>

          <div class="col-span-4 flex flex-col gap-6 sm:col-span-1">
            <button
              class="select-none rounded-lg bg-green-100 px-4 py-5 text-center text-green-800 drop-shadow hover:bg-green-200"
              @click="approve(sign_on)"
            >
              <span class="flex flex-row items-center gap-2">
                <i-heroicons-solid:check /> Approve
              </span>
            </button>
            <button
              class="select-none rounded-lg bg-red-100 px-4 py-1.5 text-center text-red-800 drop-shadow hover:bg-red-200"
              @click="remove(sign_on)"
            >
              <span class="flex flex-row items-center gap-2">
                <i-heroicons-solid:trash /> Delete
              </span>
            </button>
            <div :style="{ backgroundColor: sign_on?.armband_colour }" class="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SignonSignOn, SignonStaffSignOnResults } from '~cognito/models/Signon/SignOn'

const sign_ons = ref<SignonStaffSignOnResults[]>([])

const userStore = useUserStore()
const first_name = ref(userStore.user.first_name)
const last_name = ref(userStore.user.last_name)

const approving_modal = ref(false)
const approving_signon = ref<SignonStaffSignOnResults | null>(null)

const deleting_modal = ref(false)
const deleting_signon = ref<SignonStaffSignOnResults | null>(null)

const search_term = ref('')
const order_by = ref('latest')

const clearSearch = () => {
  search_term.value = ''
}

const fetchSignOns = () => {
  (new SignonSignOn()).getStaffSignons(order_by.value)
    .then((data) => {
      sign_ons.value = data.data
    })
}

const remove = (signon: SignonStaffSignOnResults) => {
  deleting_signon.value = new SignonStaffSignOnResults(signon)
  deleting_modal.value = true
}

const cancelRemove = () => {
  deleting_signon.value = null
  deleting_modal.value = false
}

const confirmRemove = () => {
  deleting_modal.value = false

  deleting_signon.value?.confirmDelete()
    .then(() => {
      deleting_signon.value = null
      fetchSignOns()
    })
}

const cancelApprove = () => {
  approving_signon.value = null
  approving_modal.value = false
}

const confirmApprove = () => {
  approving_modal.value = false

  approving_signon.value?.confirmApprove()
    .then((result) => {
      approving_signon.value = null
      fetchSignOns()
    })
}

const approve = (signon: SignonStaffSignOnResults) => {
  approving_signon.value = new SignonStaffSignOnResults(signon)
  approving_modal.value = true
}

const sign_ons_filtered = computed<SignonStaffSignOnResults[]>(() => {
  if (!search_term.value) {
    return sign_ons.value
  }
  return sign_ons.value.filter((item) => {
    return search_term.value
      .toLowerCase()
      .split(' ')
      .every(character => item.name.toLowerCase().includes(character))
  })
})

watch(() => order_by.value, () => {
  fetchSignOns()
})

onMounted(() => {
  setInterval(fetchSignOns, 10000)
  fetchSignOns()
})
</script>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
