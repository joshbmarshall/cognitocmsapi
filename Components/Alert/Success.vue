<template>
  <cgn-alert color="bg-success-400">
    <template #icon>
      <slot name="icon">
        <i-heroicons-solid:check />
      </slot>
    </template>
    <slot />
    <template #btn>
      <slot name="btn" />
    </template>
  </cgn-alert>
</template>
