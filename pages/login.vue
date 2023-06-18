<template>
  <div class="min-h-full flex flex-col justify-center py-12 px-6">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Sign in to your account
      </h2>
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md text-sm text-center">
      Don't have an account?
      <cgn-link
        color-brand
        to="/signup"
      >
        Sign up now
      </cgn-link>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-darkbg-700 py-8 px-4 drop-shadow-lg rounded-lg sm:px-10">
        <cgn-account-login />
      </div>
    </div>
  </div>
</template>
