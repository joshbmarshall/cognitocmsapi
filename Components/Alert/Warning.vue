<template>
  <cgn-alert color="bg-warning-400">
    <template #icon>
      <slot name="icon">
        <i-heroicons-solid:information-circle />
      </slot>
    </template>
    <slot />
    <template #btn>
      <slot name="btn" />
    </template>
  </cgn-alert>
</template>
