<template>
  <div class="prose dark:prose-invert" :class="{ 'max-w-none text-center': props.templatevar.centered }">
    <h1 v-if="templatevar.heading_type == 'h1'">
      {{ templatevar.heading }}
    </h1>
    <h2 v-if="templatevar.heading_type == 'h2'">
      {{ templatevar.heading }}
    </h2>
    <h3 v-if="templatevar.heading_type == 'h3'">
      {{ templatevar.heading }}
    </h3>
    <h4 v-if="templatevar.heading_type == 'h4'">
      {{ templatevar.heading }}
    </h4>
  </div>
</template>

<script lang="ts">
class Templatevars {
  heading_type?: string
  heading?: string
  centered?: boolean
}
</script>

<script setup lang="ts">
const props = defineProps({
  templatevar: {
    type: Templatevars,
    required: true,
  },
})
</script>
