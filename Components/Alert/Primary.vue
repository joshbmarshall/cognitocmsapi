<template>
  <cgn-alert-base color="bg-primary-400">
    <template #icon>
      <slot name="icon">
        <i-heroicons-solid:information-circle />
      </slot>
    </template>
    <slot />
  </cgn-alert-base>
</template>
