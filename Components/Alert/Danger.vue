<template>
  <cgn-alert color="bg-danger-400">
    <template #icon>
      <slot name="icon">
        <i-heroicons-solid:exclamation />
      </slot>
    </template>
    <slot />
    <template #btn>
      <slot name="btn" />
    </template>
  </cgn-alert>
</template>
