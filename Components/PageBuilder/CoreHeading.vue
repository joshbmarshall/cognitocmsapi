<template>
  <div class="prose dark:prose-invert">
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
