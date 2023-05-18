<script setup lang="ts">
import type { DataTableColumn } from 'naive-ui'
import formState from '@/utils/formState'
import Complaints from '@/pages/app/complaints.vue'
import Violations from '@/pages/app/violations.vue'
import Accidents from '@/pages/app/accidents.vue'

definePage({
  name: 'Profile',
  path: '/drivers/:id',
})

const route = useRoute()
const id = parseInt(route.params.id)

const { data, loading, error, run: refresh } = useRequest(async () => {
  const res = await Promise.all([
    axios.get(`/userManagement/${id}`),
    axios.get(`/driversInformationUserID/${id}`),
    axios.get(`/getOrganizationHistoryByUserID/${id}`),
    axios.get(`/getUserVehicleHistoryByUserID/${id}`),
  ])

  return {
    userManagement: res[0].data.results[0],
    driverInformation: res[1].data.results,
    organizationHistory: res[2].data.results,
    vehicleHistory: res[3].data.results,
  }
}, {
  onSuccess: () => {
    formState.value = data.value!.driverInformation
  },
})

const organizationHistoryColumns: DataTableColumn[] = [
  {
    title: 'Organization',
    key: 'org_title',
    sorter: 'default',
  },
  {
    title: 'Assigned by',
    key: 'assigned_by',
    sorter: 'default',
    render: row => `${row.assigned_by.fname} ${row.assigned_by.lname}`,
  },
  {
    title: 'Date',
    key: 'date',
    sorter: 'default',
    render: (row) => {
      const assigned_at = dayjs(row.assigned_at || row.created_at).format('MM/DD/YYYY h:mm A')
      const unassigned_at = row.unassigned_at ? dayjs(row.unassigned_at).format(' - MM/DD/YYYY h:mm A') : ' '
      return assigned_at + unassigned_at
    },
  },
]

const vehicleHistoryColumns: DataTableColumn[] = [
  {
    title: 'Plate number',
    key: 'vehicle_id.plate_number',
    sorter: 'default',
  },
  {
    title: 'Type',
    key: 'vehicle_id.vehicle_type',
    sorter: 'default',
  },
  {
    title: 'Date',
    key: 'date',
    sorter: 'default',
    render: (row) => {
      const assigned_at = dayjs(row.assigned_at || row.created_at).format('MM/DD/YYYY h:mm A')
      const unassigned_at = row.unassigned_at ? dayjs(row.unassigned_at).format(' - MM/DD/YYYY h:mm A') : ' '
      return assigned_at + unassigned_at
    },
  },
]

const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/api/fileUserImage/`
</script>

<template>
  <div v-if="loading">
    Loading...
  </div>
  <div v-else-if="data" class="flex flex-col gap-3">
    <!--      xl:flex-row -->
    <n-card class="h-max shrink-0 ">
      <!--        xl:max-w-xs -->
      <div class="flex flex-col text-center xl:flex-row">
        <div class="flex flex-col items-center xl:flex-row">
          <NAvatar
            class="shrink-0" round
            :src="`${avatarURL}${data.userManagement.user_image}`"
            :size="100" fallback-src="/images/default.svg"
          />
          <div class="xl:!ml-4 xl:text-left">
            <n-h2 class="!mt-4 !mb-2 xl:!my-0">
              {{ data.userManagement.fname }} {{ data.userManagement.lname }}
            </n-h2>
            <div>
              {{ data.userManagement.organization.org_title }}
              <TableFieldRole class="ml-1" :role_id="data.userManagement.role_id" />
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2 xl:ml-12 xl:flex-row xl:gap-12">
          <div class="flex items-center gap-2">
            <i-mail-outline />
            <a class="underline" :href="`mailto:${data.userManagement.email}`">
              {{ data.userManagement.email }}
            </a>
          </div>
          <div class="flex items-center gap-2">
            <i-call-outline />
            {{ data.userManagement.mobile_number }}
          </div>
          <div class="flex items-center gap-2">
            <i-calendar-outline />
            {{ dayjs(data.userManagement.birthdate).format('MM/DD/YYYY') }}
          </div>
        </div>
      </div>
    </n-card>

    <n-card class="h-max" content-style="padding-top: 4px;">
      <n-tabs type="line" size="large">
        <n-tab-pane display-directive="show:lazy" name="information" tab="Information">
          <drivers-information />
        </n-tab-pane>
        <template v-if="data.userManagement.role_id === 4">
          <n-tab-pane display-directive="show:lazy" name="reminders" tab="Reminders">
            <DriversReminders foreign-key="user_id" :foreign-key-value="id" />
          </n-tab-pane>
          <n-tab-pane name="vehicles" tab="Vehicle History">
            <table-base v-bind="{ data: data.vehicleHistory, columns: vehicleHistoryColumns }" />
          </n-tab-pane>
          <n-tab-pane name="organizations" tab="Organization History">
            <table-base v-bind="{ data: data.organizationHistory, columns: organizationHistoryColumns }" />
          </n-tab-pane>
          <n-tab-pane display-directive="show:lazy" name="quiz" tab="Quiz Attempts">
            <QuizzesAttempts :foreign-key-value="id" />
          </n-tab-pane>
          <n-tab-pane display-directive="show:lazy" name="complaints" tab="Complaints">
            <Complaints
              :queries="{
                all: 'complaint',
                get: 'complaintByDriverID',
                create: false,
              }" foreign-key="driver_id" :foreign-key-value="id"
            />
          </n-tab-pane>
          <n-tab-pane display-directive="show:lazy" name="violations" tab="Violations">
            <Violations
              :queries="{
                all: 'violation',
                get: 'violationByDriverID',
                create: false,
              }" foreign-key="driver_id" :foreign-key-value="id"
            />
          </n-tab-pane>
          <n-tab-pane display-directive="show:lazy" name="accidents" tab="Accidents">
            <Accidents
              :queries="{
                all: 'accidents',
                get: 'accidentByDriverID',
                create: false,
              }" foreign-key="driver_id" :foreign-key-value="id"
            />
          </n-tab-pane>
        </template>
      </n-tabs>
    </n-card>
  </div>
  <app-error v-else-if="error" :loading="loading" @refresh="refresh()" />
</template>
