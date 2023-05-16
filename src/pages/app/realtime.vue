<script setup lang="tsx">
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'
import type { FormFields } from '@/types'
import { useAuth } from '@/utils/auth'
import TableFieldUser from '@/components/table/field-user.vue'
import formState from '@/utils/formState'
import { validateMessages } from '@/utils/config'

definePage({
  name: 'Realtime Tracking',
})

const { isSuperadmin } = useAuth()
const message = useMessage()

const { data, loading, error, refresh } = useRequest(async () => {
  const res = await axios.get(isSuperadmin ? '/vehicles' : '/vehicleOrganization')
  const vehicles = res.data.results.filter(vehicle => vehicle?.iot_vehicle_id)
  return {
    active: vehicles.filter(vehicle => vehicle.user),
    inactive: vehicles.filter(vehicle => !vehicle.user),
  }
})

const assign = reactive({
  show: false,
  id: 0,
  plateNumber: '',
})

const { loading: postLoading, run: postRun } = useRequest(async (id: number) => {
  await axios.put(`/assignUserToVehicle/${id}`, {
    user_id_assigned: formState.value.driver_id,
  })
}, {
  manual: true,
  onSuccess() {
    refresh()
    message.success('Vehicle assigned')
    assign.show = false
  },
})

const { run: unassignRun } = useRequest(async (id: number) => {
  await axios.delete(`/removeUserFromVehicle/${id}`)
}, {
  manual: true,
  onSuccess() {
    refresh()
    message.success('Vehicle unassigned')
  },
})

const activeColumns: DataTableColumns = [
  ...isSuperadmin
    ? [{
        title: 'Organization',
        key: 'org_title',
      }]
    : [],
  {
    title: 'Plate number',
    key: 'plate_number',
  },
  {
    title: 'Type',
    key: 'vehicle_type',
    sorter: 'default',
  },
  {
    title: 'Driver',
    key: 'name',
    render(row) {
      return <TableFieldUser id={row.user.id} fname={row.user.fname} lname={row.user.lname} user_image={row.user.user_image}></TableFieldUser>
    },
    sorter(rowA, rowB) {
      return (`${rowA.fname} ${rowA.lname}`).localeCompare(`${rowB.fname} ${rowB.lname}`)
    },
  },
  {
    key: 'user_date_assigned',
    title: 'Date Assigned',
    sorter: 'default',
    render: row => dayjs(row.user_date_assigned).format('MM-DD-YYYY h:mm A'),
  },
  {
    key: 'assign',
    title: 'Assign',
    render: row =>
      <n-space><a href={`http://iot.pasadaph.com/monitor/${row.iot_vehicle_id}`} target="_blank">
        <n-button type="primary" round>Monitor</n-button>
      </a>
      <n-popconfirm positive-text="Unassign" positive-button-props={{ type: 'warning' }} on-positive-click={() => unassignRun(row.id)}>{{ trigger: () => <n-button round>Unassign</n-button>, default: () => `Unassign ${row.plate_number}?` }}</n-popconfirm></n-space>,
  },
]

const inactiveColumns: DataTableColumns = [
  ...isSuperadmin
    ? [{
        title: 'Organization',
        key: 'org_title',
      }]
    : [],
  {
    title: 'Plate number',
    key: 'plate_number',
  },
  {
    title: 'Type',
    key: 'vehicle_type',
    sorter: 'default',
  },
  {
    key: 'assign',
    title: 'Actions',
    render: row =>
      <n-button type="primary" round on-click={() => {
        formState.value = {
          organization_id: row.organization_id as number,
          driver_id: null,
        }
        assign.id = row.id as number
        assign.plateNumber = row.plate_number as string
        assign.show = true
      }}>Assign</n-button>,
  },
]

const fields: FormFields = {
  driver_id: {
    type: 'select-user',
    label: 'Driver',
    placeholder: 'Select driver...',
    queries: {
      all: 'getAllUsers',
      organization: 'getAllUsersOrganization',
    },
  },
}

const rules: FormRules = {
  driver_id: {
    type: 'any',
    required: true,
  },
}
const formRef = ref<FormInst | null>(null)
function handlePost(id) {
  formRef.value?.validate().then(() => {
    postRun(id)
  })
}
</script>

<template>
  <template v-if="loading && !data">
    Loading...
  </template>
  <template v-if="data">
    <n-card>
      <n-tabs size="large" type="line">
        <n-tab-pane tab="Assigned Vehicles" name="active">
          <table-base v-bind="{ data: data.active, columns: activeColumns, loading }" />
        </n-tab-pane>
        <n-tab-pane tab="Inactive Vehicles" name="inactive">
          <table-base v-bind="{ data: data.inactive, columns: inactiveColumns }" />
        </n-tab-pane>
        <template #suffix>
          <a href="http://iot.pasadaph.com/trackall" target="_blank">
            <n-button round type="primary"><template #icon><i-open-outline /></template>Track all vehicles</n-button></a>
        </template>
      </n-tabs>
    </n-card>
  </template>
  <app-error v-if="error" v-bind="{ loading }" @refresh="refresh()" />

  <app-modal v-model:show="assign.show" :title="`Assign vehicle: ${assign.plateNumber}`">
    <n-form ref="formRef" :model="formState" v-bind="{ rules, validateMessages }">
      <form-master v-bind="{ fields }" />
    </n-form>
    <template #footer>
      <NSpace justify="end">
        <NButton round @click="assign.show = false">
          Cancel
        </NButton>
        <NButton round type="primary" :loading="postLoading" @click="handlePost(assign.id)">
          Save
        </NButton>
      </NSpace>
    </template>
  </app-modal>
</template>
