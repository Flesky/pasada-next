<script setup lang="ts">
import type { FormInst, FormRules, MenuOption } from 'naive-ui'
import type { Component } from 'vue'
import { RouterLink } from 'vue-router'
import { zxcvbn } from '@zxcvbn-ts/core'
import Dashboard from '~icons/ion/SpeedometerOutline'
import Analytics from '~icons/ion/AnalyticsOutline'
import IOT from '~icons/ion/NavigateCircleOutline'
import Learning from '~icons/ion/SchoolOutline'
import Modules from '~icons/ion/BookOutline'
import Lessons from '~icons/ion/DocumentTextOutline'
import Quizzes from '~icons/ion/ListOutline'
import Books from '~icons/ion/LibraryOutline'
import Drivers from '~icons/ion/PeopleOutline'
import Organizations from '~icons/ion/MedicalOutline'
import Driver from '~icons/ion/PersonCircleOutline'
import Vehicle from '~icons/ion/CarOutline'
import Incentive from '~icons/ion/StarOutline'
import Reminders from '~icons/ion/NotificationsOutline'
import Webinars from '~icons/ion/VideocamOutline'
import Reports from '~icons/ion/FileTrayFullOutline'
import Complaints from '~icons/ion/ReaderOutline'
import Violations from '~icons/ion/WarningOutline'
import Accidents from '~icons/ion/MedkitOutline'
import { useAuth } from '@/utils/auth'
import formState from '@/utils/formState'
import { validateMessages } from '@/utils/config'
import type { FormFields } from '@/types'

const isCollapsed = useLocalStorage('isCollapsed', true)
const router = useRouter()
const auth = useAuth()

const renderLabel = (label: string, to: string) => () => h(RouterLink, { to }, () => label)
const renderIcon = (icon: Component) => () => h(icon)

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

const menu: MenuOption[] = [
  {
    label: renderLabel('Dashboard', '/dashboard'),
    key: 'dashboard',
    icon: renderIcon(Dashboard),
  },
  {
    label: renderLabel('Realtime Tracking', '/realtime'),
    key: 'realtime',
    icon: renderIcon(IOT),
  },
  {
    label: renderLabel('Analytics', '/analytics'),
    key: 'analytics',
    icon: renderIcon(Analytics),
  },
  {
    label: 'Learning Content',
    key: 'learning',
    icon: renderIcon(Learning),
    children: [
      {
        label: renderLabel('Modules', '/modules'),
        key: 'modules',
        icon: renderIcon(Modules),
      },
      {
        label: renderLabel('Lessons', '/lessons'),
        key: 'lessons',
        icon: renderIcon(Lessons),
      },
      {
        label: renderLabel('Quizzes', '/quizzes'),
        key: 'quizzes',
        icon: renderIcon(Quizzes),
      },
      {
        label: renderLabel('Books', '/books'),
        key: 'books',
        icon: renderIcon(Books),
      },
    ],
  },
  {
    label: 'Drivers',
    key: 'drivers',
    icon: renderIcon(Drivers),
    children: [
      {
        label: renderLabel('Organizations', '/organizations'),
        key: 'organizations',
        icon: renderIcon(Organizations),
        show: auth.isSuperadmin,
      },
      {
        label: renderLabel('Members', '/members'),
        key: 'members',
        icon: renderIcon(Organizations),
        show: !auth.isSuperadmin,
      },
      {
        label: renderLabel('Drivers', '/drivers'),
        key: 'drivers',
        icon: renderIcon(Driver),
      },
      {
        label: renderLabel('Vehicles', '/vehicles'),
        key: 'vehicles',
        icon: renderIcon(Vehicle),
      },
      {
        label: renderLabel('Incentives', '/incentives'),
        key: 'incentives',
        icon: renderIcon(Incentive),
      },
      {
        label: renderLabel('Reminders', '/reminders'),
        key: 'reminders',
        icon: renderIcon(Reminders),
      },
      {
        label: renderLabel('Webinars', '/webinars'),
        key: 'webinars',
        icon: renderIcon(Webinars),
      },
    ],
  },
  {
    label: 'Reports',
    key: 'reports',
    icon: renderIcon(Reports),
    children: [
      {
        label: renderLabel('Complaints', '/complaints'),
        key: 'complaints',
        icon: renderIcon(Complaints),
      },
      {
        label: renderLabel('Violations', '/violations'),
        key: 'violations',
        icon: renderIcon(Violations),
      },
      {
        label: renderLabel('Accidents', '/accidents'),
        key: 'accidents',
        icon: renderIcon(Accidents),
      },
    ],
  },
]

const fields: FormFields = {
  ...auth.isSuperadmin
    ? {
        organization_id: {
          type: 'select',
          label: 'Organization',
          queries: { all: 'organization' },
          format: org => org.org_title,
        },
      }
    : {},
  fname: {
    type: 'input',
    label: 'First name',
    placeholder: 'e.g. "Juan"',
    span: 8,
  },
  mname: {
    type: 'input',
    label: 'Middle name',
    placeholder: 'e.g. "Bautista"',
    span: 8,
  },
  lname: {
    type: 'input',
    label: 'Last name',
    placeholder: 'e.g. "Dela Cruz"',
    span: 8,
  },
  birthdate: {
    type: 'date',
    label: 'Birthday',
    placeholder: 'Select birthday...',
    span: 12,
  },
  email: {
    type: 'input',
    label: 'Email',
    placeholder: 'e.g. "juandelacruz@gmail.com"',
    span: 12,
  },
  mobile_number: {
    type: 'input',
    label: 'Mobile number',
    placeholder: 'e.g. "639123456789"',
    span: 12,
  },
}

const rules: FormRules = {
  fname: {
    required: true,
  },
  mname: {
    required: true,
  },
  lname: {
    required: true,
  },
  birthdate: {
    required: true,
    validator: (_, value) => {
      return dayjs().diff(dayjs(value, 'YYYY-MM-DD'), 'year') >= 18 || new Error('Must be 18 years old or above')
    },
  },
  mobile_number: {
    type: 'input',
    required: true,
    validator: (_, value) => /^639\d{9}$/.test(value) || new Error('Invalid format'),
  },
  email: {
    required: true,
  },
}

const message = useMessage()
const modal = ref(false)
const openModal = () => {
  modal.value = true
  formState.value = { ...auth.user! }
}
const { loading: postLoading, run: postRun } = useRequest(
  () => {
    const data = { ...formState.value }
    data._method = 'PUT'
    data.updated_by = auth.credentials!.id
    data.organization_id = auth.user!.organization_id
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      value ??= ''
      formData.append(key, value as string)
    })
    return axios.post(`/userManagement/${auth.credentials!.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  }, {
    manual: true,
    onSuccess: () => {
      message.success('Saved profile')
      window.location.reload()
      modal.value = false
    },
  },
)
const formRef = ref<FormInst | null>(null)
function handlePost() {
  formRef.value?.validate().then(() => {
    postRun()
  })
}

const oldPassword = ref('')
const newPassword = ref('')
const currentTab = ref('profile')
const passwordScore = ref(0)

async function useZxcvbn() {
  const { score } = await zxcvbn(newPassword.value)
  passwordScore.value = score
}

watchDebounced(newPassword, () => {
  useZxcvbn()
}, { debounce: 300, maxWait: 2000 })

const { loading: passwordLoading, run: passwordRun } = useRequest(
  () => {
    const data = {
      email: auth.user?.email,
      current_password: oldPassword.value,
      new_password: newPassword.value,
      new_password_confirmation: newPassword.value,
    }
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      value ??= ''
      formData.append(key, value as string)
    })
    return axios.post('/password/change', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  }, {
    manual: true,
    onSuccess: () => {
      message.success('Changed password')
      window.location.reload()
    },
  },
)
</script>

<template>
  <n-layout-sider
    class="h-full"
    bordered
    show-trigger
    collapse-mode="width" :width="240" :collapsed-width="64"
    content-style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden;"
    v-bind="{ collapsed: isCollapsed }"
    @collapse="isCollapsed = true"
    @expand="isCollapsed = false"
  >
    <div>
      <n-thing class="px-4 py-[15px]" @click="openModal()">
        <template #avatar>
          <button-user-side :collapsed="!isCollapsed" v-bind="auth.user" />
        </template>
      </n-thing>
      <n-divider class="!my-0" />

      <n-menu
        accordion
        :options="menu"
        :indent="20"
        :collapsed-width="64"
        :value="useRoute().path.slice(1)"
      />
    </div>
    <n-card content-style="padding: 12px;">
      <div class="flex flex-col">
        <n-button round secondary type="error" @click="handleLogout()">
          <template v-if="!isCollapsed">
            Log out
          </template>
          <template #icon>
            <i-power-outline />
          </template>
        </n-button>
      </div>
    </n-card>

    <app-modal
      v-model:show="modal" title="Account settings"
    >
      <n-tabs v-model:value="currentTab" size="large" type="line">
        <n-tab-pane tab="Profile" name="profile">
          <n-form ref="formRef" :model="formState" v-bind="{ rules, validateMessages }" class="grid gap-x-3" style="grid-template-columns: repeat(24, minmax(0, 1fr))">
            <form-master v-bind="{ fields }" />
          </n-form>
        </n-tab-pane>
        <n-tab-pane tab="Password" name="password">
          <n-form :show-feedback="false">
            <n-form-item label="Old password">
              <n-input v-model:value="oldPassword" show-password-on="click" type="password" placeholder="" />
            </n-form-item>
            <n-form-item class="mt-4" label="New password">
              <n-input v-model:value="newPassword" show-password-on="click" type="password" placeholder="" />
            </n-form-item>
            <n-p class="!mb-2">
              Password strength
            </n-p>
            <div class="grid grid-cols-4 gap-2">
              <n-progress type="line" :status="passwordScore <= 2 ? 'warning' : passwordScore === 3 ? 'success' : 'default'" :percentage="passwordScore > 0 ? 100 : 0" :show-indicator="false" />
              <n-progress type="line" :status="passwordScore <= 2 ? 'warning' : passwordScore === 3 ? 'success' : 'default'" :percentage="passwordScore > 1 ? 100 : 0" :show-indicator="false" />
              <n-progress type="line" :status="passwordScore <= 2 ? 'warning' : passwordScore === 3 ? 'success' : 'default'" :percentage="passwordScore > 2 ? 100 : 0" :show-indicator="false" />
              <n-progress type="line" :status="passwordScore <= 2 ? 'warning' : passwordScore === 3 ? 'success' : 'default'" :percentage="passwordScore > 3 ? 100 : 0" :show-indicator="false" />
            </div>
            <n-p v-if="passwordScore < 3">
              Please select a strong password.
            </n-p>
          </n-form>
        </n-tab-pane>
      </n-tabs>

      <template #footer>
        <NSpace justify="end">
          <NButton round @click="modal = false">
            Cancel
          </NButton>
          <NButton round :disabled="currentTab === 'password' && passwordScore < 3" type="primary" :loading="postLoading || passwordLoading" @click="currentTab === 'password' ? passwordRun() : handlePost()">
            Save
          </NButton>
        </NSpace>
      </template>
    </app-modal>
  </n-layout-sider>
</template>
