<script setup lang="ts">
import { useAuth } from '@/utils/auth'

const auth = useAuth()
const message = useMessage()
const router = useRouter()
const route = useRoute()

axios.interceptors.response.use(
  response => response,
  (error) => {
    switch (error.response.status) {
      case 400:
      case 422: {
        const { data } = error.response
        if (Array.isArray(data?.errors) || Array.isArray(data)) {
          Object.values(data?.errors || data).forEach((errorMessage) => {
            message.error(errorMessage[0] as Array<string>)
          })
        }
        else { message.error(data.message) }
        break
      }
      case 401:
        if (auth.credentials) {
          message.error('Unauthorized')
          auth.logout()
          router.push('/login')
        }
        break
      case 413:
        message.error('File too large')
        break
      case 429:
        message.error('Too many requests. Please try again after a few minutes')
    }
    return Promise.reject(error)
  },
)
</script>

<template>
  <router-view />

<!--  TODO: Add hasOrganizationField to: Incentives, Reminders, Webinars, Flipbooks? -->
</template>

<style>
html, body, #app {
  @apply h-full
}
</style>
