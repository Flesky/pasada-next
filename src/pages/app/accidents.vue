<script setup lang="tsx">
import type { DataTableColumns, FormRules } from 'naive-ui'
import jsPDF from 'jspdf'
import banner from '/images/banner.png'
import type { FormFields, Queries } from '@/types'
import TableFieldUser from '@/components/table/field-user.vue'
import formState from '@/utils/formState'
import { useAuth } from '@/utils/auth'

definePage({
  name: 'Accidents',
})

const attrs = useAttrs()
const columns: DataTableColumns = [
  ...attrs['foreign-key']
    ? []
    : [{
        title: 'Driver',
        key: 'name',
        render(row) {
          return <TableFieldUser id={row.driver_id} fname={row.fname} lname={row.lname} user_image={row.user_image}></TableFieldUser>
        },
        sorter(rowA, rowB) {
          return (`${rowA.fname} ${rowA.lname}`).localeCompare(`${rowB.fname} ${rowB.lname}`)
        },
      }],
  {
    title: 'Plate number',
    key: 'plate_number',
    sorter: 'default',
  },
  {
    title: 'Accident offense',
    key: 'accident_offense',
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
  // accident_offense: {
  //   type: 'textarea',
  //   label: 'Offense description',
  //   placeholder: 'e.g. "Hit and run"',
  // },
  accident_offense_id: {
    type: 'select',
    label: 'Accident offense',
    placeholder: 'Select offense...',
    queries: {
      all: 'accidentList',
    },
    format: accident => `${accident.accident_offense}`,
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
  accident_offense_id: {
    required: true,
    type: 'any',
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

// Using jsPDF
const auth = useAuth()
const generatePDF = (data) => {
  const pdfData = data.flat().map(row => ({
    ...(auth.isSuperadmin ? { Organization: row.org_title } : {}),
    'Driver': `${row.fname} ${row.lname}`,
    'Accident': row.accident_offense || '-',
    'Plate Number': row.plate_number || '-',
    'Date': dayjs(row.date_committed).format('MM/DD/YYYY'),
  }))

  const headers = [...(auth.isSuperadmin ? ['Organization'] : []), 'Driver', 'Accident', 'Plate Number', 'Date']

  // eslint-disable-next-line new-cap
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.addImage(banner, 'PNG', 4, 4, 100, 12)
  doc.text(`Accidents: ${auth.isSuperadmin ? 'All organizations' : auth.user.organization.org_title}`, 4, 24)
  doc.table(4, 30, pdfData, headers, { autoSize: true })
  doc.save('accidents.pdf')
}
</script>

<template>
  <table-crud :pdf="generatePDF" v-bind="{ columns, fields, rules, queries, ...$attrs }" name="accident" />
</template>
