<template>
  <div class="min-h-full flex flex-col justify-center py-12 px-6">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
      >
        Register an account
      </h2>
    </div>
    <cgn-account-signup />
  </div>
</template>

<script setup lang="ts">
const start = () => {
  usePageStore().setSEO({
    title: 'Sign Up',
    canonical: '/signup',
  })
}
onMounted(start)
onServerPrefetch(start)
</script>
