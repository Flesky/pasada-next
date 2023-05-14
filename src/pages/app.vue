<script setup lang="ts">
definePage({
  path: '/',
  meta: {
    requiresAuth: true,
  },
})
</script>

<template>
  <n-layout
    has-sider class="h-full !bg-transparent"
  >
    <app-sider />
    <n-layout class="h-full">
      <n-layout-header v-if="$route.name !== 'Analytics'" class="sticky top-0 z-50 flex h-16 justify-between">
        <div style="background: linear-gradient(128deg, rgba(61,83,164,1) 80%, rgba(250,250,250,255) 90%);" class="flex h-full grow items-center bg-none px-4">
          <n-h2 class="!mb-0 !text-white">
            {{ $route.name }}
          </n-h2>
        </div>
        <div class="flex h-full shrink-0 items-center bg-[#fafafa] px-4">
          <img class="w-96" src="/images/banner.png">
        </div>
      </n-layout-header>

      <n-layout-content
        :class="$route.name === 'Analytics' ? 'h-full' : 'p-4'" class="!bg-transparent"
        style="background: linear-gradient(90deg, #fafafa 21px, transparent 1%) center, linear-gradient(#fafafa 21px, transparent 1%) center, #a799cc;
  background-size: 22px 22px;"
      >
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
