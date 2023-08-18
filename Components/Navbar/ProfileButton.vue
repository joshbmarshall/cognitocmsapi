<template>
  <div class="h-8 w-8">
    <router-link to="/profile" class="cursor-pointer">
      <span v-if="gravatarSrc" title="My Profile">
        <img :src="gravatarSrc" class="h-8 w-8 rounded-full bg-white object-cover">
      </span>
      <span v-else title="Log In">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

      </span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import gravatar from 'gravatar'
import { useUserStore } from '~cognito/stores/user'

const userStore = useUserStore()

const gravatarSrc = computed(() => {
  if (userStore.user.thumbnail) {
    return userStore.user.thumbnail
  }
  if (!userStore.user.email) {
    return ''
  }
  return gravatar.url(userStore.user.email, {
    d: 'retro',
  })
})
</script>
