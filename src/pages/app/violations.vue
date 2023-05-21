<script setup lang="tsx">
import {useAuth} from "@/utils/auth";
import jsPDF from "jspdf";
import type { DataTableColumns, FormRules } from 'naive-ui'
import { NButton } from 'naive-ui'
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
    title: 'Violation',
    key: 'violation_list',
    sorter: (a: any, b: any) => a.violation_code - b.violation_code,
    render(row: Record<string, any>) {
      return <p>{row.violation_code} - {row.violation_description}<br/>
        <NText depth={3}>{{ 1: 'First', 2: 'Second', 3: 'Third' }[row.offense_level as number]} Offense - {row[`${{ 1: 'first', 2: 'second', 3: 'third' }[row.offense_level as number]}_offense_charge`]} PhP</NText></p>
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

// Using jsPDF
const auth = useAuth()
const generatePDF = (data) => {
  const pdfData = data.flat().map(row => ({
    ...(auth.isSuperadmin ? { Organization: row.org_title } : {}),
    'Driver': `${row.fname} ${row.lname}`,
    // 'Violations': row.violation_code || '-',
    'Plate Number': row.plate_number || '-',
    'Date': dayjs(row.date_committed).format('MM/DD/YYYY'),
  }))

  const headers = [...(auth.isSuperadmin ? ['Organization'] : []), 'Driver', 'Plate Number', 'Date']
  const dateAcquisition = dayjs().format('MMMM DD, YYYY')
  const dateRetrieved = dayjs().format('MM/DD/YYYY')
  const timeRetrieved = dayjs().format('MM/DD/YYYY h:mm A')

  // eslint-disable-next-line new-cap
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.addImage('images/banner.png', 'PNG', 75, 25, 150, 18,  )
  doc.setFontSize(11).setTextColor('#3D53A4')
  doc.text("P.U.V.'s Pattern and Attitude on the Streets Using Artificial Intelligence and Data Analytics", 150, 50, null, null, 'center' )

  doc.setFont('helvetica', 'bold').setFontSize(36)
  doc.text(`COMPILATION OF VIOLATIONS`, 150, 100, null, null, 'center')

  doc.setFont('helvetica', 'normal').setFontSize(20)
  doc.text(` ${auth.isSuperadmin ? 'All Organizations' : auth.user.organization.org_title}`, 150, 120, null, null, 'center')

  doc.setFontSize(16)
  doc.text(dateAcquisition,150, 190, null, null, 'center')

  doc.addPage().setFontSize(9).setTextColor('black')
  doc.addImage('images/banner.png', 'PNG', 10, 8, 100, 12)
  doc.table(10, 25, pdfData, headers,
      { printHeaders:true, autoSize:true, fontSize:10, margins: {top: 25, right: 20, bottom: 9, left: 14}
      })

  //iterating page number and time of generation
  let currentPage = 1
  let limitPage = doc.getNumberOfPages()
  let foo
  for (currentPage; currentPage < limitPage; currentPage++){
    foo = currentPage + 1
    doc.setPage(foo)
    doc.addImage('images/banner.png', 'PNG', 10, 8, 100, 12)
    doc.text("Page " + foo + " of " + limitPage, 285, 202, null, null, "right")
    doc.text("Generated on: " + timeRetrieved, 10, 202)
  }
  doc.save('Violations ' +  dateRetrieved + '.pdf')
}
</script>

<template>
  <table-crud :pdf="generatePDF" v-bind="{ columns, fields, rules, queries, ...$attrs }" name="violation" />

  <app-modal v-model:show="attachments.show" :title="`Attachments: ${attachments.title}`">
    <violations-attachments :foreign-key-value="attachments.foreignKeyValue" />
  </app-modal>
</template>
