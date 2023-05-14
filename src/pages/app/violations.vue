<script setup lang="tsx">
import type { DataTableColumns, FormRules } from 'naive-ui'
import { NButton, NText } from 'naive-ui'
import type { FormFields, Queries } from '@/types'
import TableFieldUser from '@/components/table/field-user.vue'
import formState from '@/utils/formState'

definePage({
  name: 'Violations',
})

const attachments = reactive({
  show: false,
  foreignKeyValue: 0,
  title: '',
})

const columns: DataTableColumns = [
  {
    title: 'Driver',
    key: 'name',
    render(row) {
      return <TableFieldUser id={row.driver_id} fname={row.fname} lname={row.lname} user_image={row.user_image}></TableFieldUser>
    },
    sorter(rowA, rowB) {
      return (`${rowA.fname} ${rowA.lname}`).localeCompare(`${rowB.fname} ${rowB.lname}`)
    },
  },
  {
    title: 'Plate number',
    key: 'plate_number',
    sorter: 'default',
  },
  {
    title: 'Violation',
    key: 'violation_list.violation_code',
    sorter: (a: any, b: any) => a.violation_list.violation_code - b.violation_list.violation_code,
    render(row: Record<string, any>) {
      return <p>{row.violation_list.violation_code} - {row.violation_list.violation_description}<br/>
        <NText depth={3}>{{ 1: 'First', 2: 'Second', 3: 'Third' }[row.offense_level as number]} Offense - {row.violation_list[`${{ 1: 'first', 2: 'second', 3: 'third' }[row.offense_level as number]}_offense_charge`]} PhP</NText></p>
    },
  },
  {
    title: 'Status',
    key: 'status',
    sorter: 'default',
  },
  {
    title: 'Date happened',
    key: 'date_happened',
    sorter: 'default',
    render(row) {
      return dayjs(row.date_happened).format('MM/DD/YYYY')
    },
  },
  {
    title: 'Attachments',
    key: 'attachments',
    render(row) {
      return <NButton round type="primary" onClick={() => {
        attachments.foreignKeyValue = row.id as number
        // Title: driver name, plate number, date
        attachments.title = `${row.fname} ${row.lname} - ${row.plate_number} - ${dayjs(row.date_happened).format('MM/DD/YYYY')}`
        attachments.show = true
      }}>Attachments</NButton>
    },
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
  vehicle_id: {
    type: 'select',
    label: 'Vehicle',
    placeholder: 'Select vehicle...',
    queries: {
      all: 'vehicles',
      organization: 'vehicleOrganization',
    },
    format: vehicle => `${vehicle.plate_number} (${vehicle.manufacturer} ${vehicle.model_name})`,
  },
  violations_list_id: {
    type: 'select',
    label: 'Violation',
    placeholder: 'Select violation...',
    queries: {
      all: 'violationList',
    },
    format: violation => `${violation.violation_code} - ${violation.violation_description}`,
  },
  date_happened: {
    type: 'date',
    label: 'Date',
    placeholder: 'Select date...',
    span: 12,
  },
  time_happened: {
    type: 'time',
    label: 'Time',
    placeholder: 'Select time...',
    span: 12,
  },
  offense_level: {
    type: 'radio',
    label: 'Offense Level',
    span: 12,
    options: [
      {
        value: 1,
        label: 'First',
      },
      {
        value: 2,
        label: 'Second',
      },
      {
        value: 3,
        label: 'Third',
      },
    ],
  },
  status: {
    type: 'radio',
    label: 'Status',
    span: 12,
    options: [
      {
        value: 'Reported',
        label: 'Reported',
      },
      {
        value: 'In Progress',
        label: 'In Progress',
      },
      {
        value: 'Completed',
        label: 'Completed',
      },
    ],
  },
}

const rules: FormRules = {
  driver_id: {
    type: 'any',
    required: true,
  },
  vehicle_id: {
    type: 'any',
    required: true,
  },
  violations_list_id: {
    type: 'any',
    required: true,
  },
  date_happened: {
    required: true,
  },
  time_happened: {
    required: true,
    validator: (_, value) => {
      const input = dayjs(`${formState.value.date_happened} ${value}`, 'YYYY-MM-DD HH:mm:ss')
      const now = dayjs()
      return !input.isAfter(now) || new Error('Date and time must be before now')
    },
  },
  offense_level: {
    type: 'number',
    required: true,
  },
  status: {
    required: true,
  },
}

const queries: Queries = {
  all: 'violation',
  organization: 'violationsOrganizations',
  hasOrganizationField: true,
}
</script>

<template>
  <table-crud v-bind="{ columns, fields, rules, queries, ...$attrs }" name="violation" />

  <app-modal v-model:show="attachments.show" :title="`Attachments: ${attachments.title}`">
    <violations-attachments :foreign-key-value="attachments.foreignKeyValue" />
  </app-modal>
</template>
