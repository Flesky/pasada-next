<script setup lang="ts">
const props = defineProps<{
  path: string
  name?: string
}>()

const src = computed(() => `${import.meta.env.VITE_BACKEND_URL}/api/${props.path}/${props.name}`)
</script>

<template>
  <n-image :src="name ? src : undefined" object-fit="cover" class="w-16">
    <template #placeholder />
  </n-image>
</template>

<style>
.n-image-preview-toolbar {
  @apply gap-4 px-5
}
.n-image-preview-toolbar .n-base-icon {
  @apply p-0
}
</style>
