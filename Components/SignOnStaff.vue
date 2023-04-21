<template>
  <cgn-modal v-model="deleting_modal">
    <template #icon>
      <div
        class="
            flex-shrink-0 flex
            items-center
            justify-center
            h-12
            w-12
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
      <h3 class="text-lg leading-6 font-medium text-gray-900 select-none">
        Deleting {{ deleting_signon?.name }}
      </h3>
      <div class="mt-2">
        <cgn-lazy-image :image="deleting_signon?.photo" class="rounded-xl max-h-32" />
        <div class="font-medium whitespace-pre-line">
          {{ deleting_signon?.extra_details }}
        </div>
      </div>
    </template>
    <template #button-footer>
      <div class="flex px-4 py-3 sm:px-6 gap-6">
        <button
          class="
              mt-4
              w-full
              inline-flex
              justify-center
              rounded-md
              drop-shadow
              px-4
              py-2
              bg-white
              font-medium
              text-gray-700
              hover:bg-gray-50
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-indigo-500
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
              w-full
              inline-flex
              justify-center
              rounded-md
              drop-shadow
              px-4
              py-2
              bg-red-100
              text-base
              font-medium
              text-red-800
              hover:bg-red-200
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-indigo-500
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
            flex-shrink-0 flex
            items-center
            justify-center
            h-12
            w-12
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
      <h3 class="text-lg leading-6 font-medium text-gray-900 select-none">
        Approving {{ approving_signon?.name }}
      </h3>
      <div class="mt-2">
        <cgn-lazy-image :image="approving_signon?.photo" class="rounded-xl max-h-32" />
        <div class="font-medium whitespace-pre-line">
          {{ approving_signon?.extra_details }}
        </div>
      </div>
      <div v-if="approving_signon?.adult_name" class="mt-4 grid grid-cols-2">
        <span class="col-span-2 text-lg">Guardian details</span>
        <cgn-lazy-image :image="approving_signon?.adult_signature" class="rounded-md max-h-20 border-gray-200 border-2" />
        <cgn-lazy-image :image="approving_signon?.adult_photo" class="rounded-xl max-h-32" />
        <div class="font-medium col-span-2">
          <span class="block text-lg text-gray-800">{{ approving_signon?.adult_name }}</span>
          <span class="text-sm text-gray-700">{{ approving_signon?.adult_relationship }}</span>
        </div>
      </div>
      <div :style="{ backgroundColor: approving_signon?.armband_colour }" class="w-full h-10" />
    </template>
    <template #button-footer>
      <div class="flex px-4 py-3 sm:px-6 gap-6">
        <button
          class="
              mt-4
              w-full
              inline-flex
              justify-center
              rounded-md
              drop-shadow
              px-4
              py-2
              bg-white
              font-medium
              text-gray-700
              hover:bg-gray-50
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-indigo-500
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
              w-full
              inline-flex
              justify-center
              rounded-md
              drop-shadow
              px-4
              py-2
              bg-green-100
              text-base
              font-medium
              text-green-800
              hover:bg-green-200
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-indigo-500
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
  <div class="rounded-lg overflow-hidden border border-gray-200 bg-white max-w-3xl w-full mx-auto">
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 p-4">
      <div class="flex gap-4 text-white">
        <button
          class="drop-shadow py-1.5 px-4 rounded-lg text-center select-none border"
          :class="order_by === 'name' ? 'text-indigo-800 border-indigo-600' : 'hover:bg-indigo-700 bg-indigo-600'"
          @click="order_by = 'latest'"
        >
          <span class="flex flex-row items-center gap-2">
            Latest
          </span>
        </button>
        <button
          class="drop-shadow py-1.5 px-4 rounded-lg text-center select-none border"
          :class="order_by === 'latest' ? 'text-indigo-800 border-indigo-600' : 'hover:bg-indigo-700 bg-indigo-600'"
          @click="order_by = 'name'"
        >
          <span class="flex flex-row items-center gap-2">
            Name A-Z
          </span>
        </button>
      </div>
      <div class="text-center">
        <span class="text-xl font-medium mt-1 block">{{ first_name }} {{ last_name }}</span>
      </div>
      <div style="font-size: 17px;" class="col-span-2 sm:col-span-1">
        <div class="relative rounded-md shadow-sm my-1">
          <div
            class="absolute inset-y-0 left-0 pl-1 flex items-center text-gray-500 dark:text-white pointer-events-none"
          >
            <i-heroicons-solid:search />
          </div>
          <input
            v-model="search_term" type="text"
            class="appearance-none block rounded-md px-2 py-2 w-full shadow-md placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pl-7"
          >
        </div>
      </div>
    </div>
    <div class="p-4">
      <div class="divide-y-2 divide-gray-200 flex flex-col">
        <div v-if="!sign_ons_filtered.length" class="px-2 py-6">
          <div class="flex flex-col gap-2">
            <span class="text-xl">No sign ons found</span>
            <span v-if="search_term" class="text-blue-700 cursor-pointer" @click="clearSearch">See all</span>
          </div>
        </div>
        <div
          v-for="sign_on in sign_ons_filtered" :key="sign_on.id"
          class="px-2 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <div class="flex flex-col gap-2 text-gray-500">
            <div>
              <cgn-lazy-image :image="sign_on.signature" class="rounded-md max-h-20 border-gray-200 border-2" />
            </div>
          </div>

          <div class="col-span-2">
            <cgn-lazy-image :image="sign_on.photo" class="rounded-xl max-h-32" />
            <div class="text-xl pb-2">
              {{ sign_on.name }}
            </div>
            <div class="font-medium whitespace-pre-line">
              {{ sign_on?.extra_details }}
            </div>
          </div>

          <div class="col-span-4 sm:col-span-1 gap-6 flex flex-col">
            <button
              class="drop-shadow py-5 px-4 rounded-lg text-center select-none text-green-800 bg-green-100 hover:bg-green-200"
              @click="approve(sign_on)"
            >
              <span class="flex flex-row items-center gap-2">
                <i-heroicons-solid:check /> Approve
              </span>
            </button>
            <button
              class="drop-shadow py-1.5 px-4 rounded-lg text-center select-none text-red-800 bg-red-100 hover:bg-red-200"
              @click="remove(sign_on)"
            >
              <span class="flex flex-row items-center gap-2">
                <i-heroicons-solid:trash /> Delete
              </span>
            </button>
            <div :style="{ backgroundColor: sign_on?.armband_colour }" class="w-full h-10" />
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
    .then((result) => {
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
