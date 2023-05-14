<script setup lang="tsx">
import type { DataTableColumns, FormRules } from 'naive-ui'
import type { FormFields, Queries } from '@/types'
import TableFieldUser from '@/components/table/field-user.vue'
import formState from '@/utils/formState'

definePage({
  name: 'Accidents',
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
    key: 'vehicles.plate_number',
    sorter(rowA: Record<string, any>, rowB: Record<string, any>) {
      return rowA.vehicles.plate_number.localeCompare(rowB.vehicles.plate_number)
    },
  },
  {
    title: 'Accident type',
    key: 'accident_type',
    sorter: 'default',
  },
  {
    title: 'Place',
    key: 'place_commission',
    sorter: 'default',
  },
  {
    title: 'Status',
    key: 'case_status',
    sorter: 'default',
  },
  {
    title: 'Date happened',
    key: 'date_committed',
    sorter: 'default',
    render(row) {
      return dayjs(row.date_committed).format('MM/DD/YYYY')
    },
  },
]

const fields: FormFields = {
  driver_id: {
    type: 'select-user',
    label: 'Driver',
    placeholder: 'Select driver...',
    span: 12,
    queries: {
      all: 'getAllUsers',
      organization: 'getAllUsersOrganization',
    },
  },
  vehicle_id: {
    type: 'select',
    label: 'Vehicle',
    placeholder: 'Select vehicle...',
    span: 12,
    queries: {
      all: 'vehicles',
      organization: 'vehicleOrganization',
    },
    format: vehicle => `${vehicle.plate_number} (${vehicle.manufacturer} ${vehicle.model_name})`,
  },
  accident_type: {
    type: 'radio',
    label: 'Accident type',
    span: 12,
    options: [
      {
        label: 'Vehicular',
        value: 'Vehicular',
      },
      {
        label: 'Others',
        value: 'Others',
      },
    ],
  },
  accident_offense: {
    type: 'textarea',
    label: 'Offense description',
    placeholder: 'e.g. "Hit and run"',
  },
  station_reported: {
    type: 'input',
    label: 'Police station reported',
    placeholder: 'e.g. "Cubao Police Station 7"',
    span: 12,
  },
  barangay: {
    type: 'input',
    label: 'Barangay reported',
    placeholder: 'e.g. "Cubao"',
    span: 12,
  },
  street: {
    type: 'input',
    label: 'Street reported',
    placeholder: 'e.g. "New York Street"',
    span: 12,
  },
  place_commission:
  {
    type: 'input',
    label: 'Place/establishment of accident',
    placeholder: 'e.g. "SM Cubao"',
    span: 12,
  },
  date_committed: {
    type: 'date',
    label: 'Date of accident',
    placeholder: 'Select date...',
    span: 12,
  },
  time_committed: {
    type: 'time',
    label: 'Time of accident',
    placeholder: 'Select time...',
    span: 12,
  },
  date_reported: {
    type: 'date',
    label: 'Date reported',
    placeholder: 'Select date...',
    span: 12,
  },
  time_reported: {
    type: 'time',
    label: 'Time reported',
    placeholder: 'Select time...',
    span: 12,
  },
  case_status: {
    type: 'radio',
    label: 'Case status',
    span: 12,
    options: [
      {
        label: 'Pending',
        value: 'Pending',
      },
      {
        label: 'Closed',
        value: 'Closed',
      },
    ],
  },
  accident_cost: {
    type: 'number',
    label: 'Settlement cost',
    placeholder: 'Enter cost...',
    span: 12,
    suffix: 'PhP',
  },
  police_narrative: {
    type: 'textarea',
    label: 'Police narrative',
    placeholder: 'Enter police narrative...',
  },
  driver_narrative: {
    type: 'textarea',
    label: 'Driver narrative',
    placeholder: 'Enter driver narrative...',
  },
  investigator: {
    type: 'input',
    label: 'Investigator',
    placeholder: 'e.g. "Juan dela Cruz"',
  },
  victim_count: {
    type: 'number',
    label: 'Victim count',
    placeholder: 'Enter count...',
    span: 12,
  },
  suspect_count: {
    type: 'number',
    label: 'Suspect count',
    placeholder: 'Enter count...',
    span: 12,
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
  accident_type: {
    required: true,
  },
  accident_offense: {
    required: true,
  },
  station_reported: {
    required: true,
  },
  barangay: {
    required: true,
  },
  street: {
    required: true,
  },
  place_commission: {
    required: true,
  },
  date_committed: {
    required: true,
  },
  time_committed: {
    required: true,
    validator: (_, value) => {
      const input = dayjs(`${formState.value.date_committed} ${value}`, 'YYYY-MM-DD HH:mm:ss')
      return !input.isAfter(dayjs()) || new Error('Accident date and time must be before now')
    },
  },
  date_reported: {
    required: true,
  },
  time_reported: {
    required: true,
    validator: (_, value) => {
      const { date_committed, time_committed, date_reported } = formState.value
      const committed = dayjs(`${date_committed} ${time_committed}`, 'YYYY-MM-DD HH:mm:ss')
      const reported = dayjs(`${date_reported} ${value}`, 'YYYY-MM-DD HH:mm:ss')
      const now = dayjs()
      if (reported.isBefore(committed))
        return new Error('Report must be after accident date and time')
      return !reported.isAfter(dayjs()) || new Error('Reported date and time must be before now')
    },
  },
  case_status: {
    required: true,
  },
  accident_cost: {
    type: 'number',
  },
  victim_count: {
    type: 'number',
  },
  suspect_count: {
    type: 'number',
  },
}

const queries: Queries = {
  all: 'accidents',
  organization: 'accidentsOrganization',
  hasOrganizationField: true,
}
</script>

<template>
  <table-crud v-bind="{ columns, fields, rules, queries, ...$attrs }" name="accident" />
</template>
