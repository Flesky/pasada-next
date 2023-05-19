<script setup lang="tsx">
import type { DataTableColumns, FormRules } from 'naive-ui'
import type { FormFields, Queries } from '@/types'
import TableFieldUser from '@/components/table/field-user.vue'
import formState from '@/utils/formState'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useAuth } from '@/utils/auth'
definePage({
  name: 'Complaints',
})

const attrs = useAttrs()
const columns: DataTableColumns = [
  ...attrs.foreignKey
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
    title: 'Complaint',
    key: 'complaint_subject',
    sorter: 'default',
  },
  {
    title: 'Date',
    key: 'date_happened',
    sorter: 'default',
    render(row) {
      return dayjs(row.date_happened).format('MM/DD/YYYY')
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
  complaint_subject_id: {
    type: 'select',
    label: 'Complaint subject',
    placeholder: 'Select subject...',
    queries: {
      all: 'complaintList',
    },
    format: complaint => `${complaint.complaint_subject}`,
  },
  complaint_description: {
    type: 'textarea',
    label: 'Description',
    placeholder: 'e.g. "Overspeeding on Main Road"',
  },
  complainant: {
    type: 'input',
    label: 'Complainant name',
    placeholder: 'Leave blank if anonymous',
    span: 12,
  },
  complainant_type: {
    type: 'dropdown',
    label: 'Complainant type',
    placeholder: 'Select complainant type...',
    span: 12,
    options: [
      {
        label: 'Passenger',
        value: 'Passenger',
      },
      {
        label: 'Concerned citizen',
        value: 'Concerned citizen',
      },
      {
        label: 'Conductor',
        value: 'Conductor',
      },
      {
        label: 'Operator',
        value: 'Operator',
      },
      {
        label: 'Others',
        value: 'Others',
      },
    ],
  },
  complainant_email: {
    type: 'input',
    label: 'Complainant email',
    placeholder: 'Leave blank if anonymous',
    span: 12,
  },
  complainant_contact_num: {
    type: 'number',
    label: 'Complainant contact number',
    placeholder: 'e.g. "639123456789"',
    span: 12,
  },
  date_happened: {
    type: 'date',
    label: 'Date happened',
    placeholder: 'Select date...',
    span: 12,
  },
  time_happened: {
    type: 'time',
    label: 'Time happened',
    placeholder: 'Select time...',
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
  complaint_subject_id: {
    required: true,
    type: 'any',
  },
  complaint_description: {
    required: true,
  },
  complainant_type: {
    required: true,
  },
  complainant_contact_num: {
    type: 'number',
    required: true,
    validator: (_, value) => /^639\d{9}$/.test(value) || new Error('Invalid format'),
  },
  date_happened: {
    required: true,
  },
  time_happened: {
    required: true,
    validator: (_, value) => {
      const input = dayjs(`${formState.value.date_happened} ${value}`, 'YYYY-MM-DD HH:mm:ss')
      const now = dayjs()
      return input.isBefore(now) || input.isSame(now) || new Error('Time must be before current time')
    },
  },
}

const queries: Queries = {
  all: 'complaint',
  organization: 'complaintOrganization',
  hasOrganizationField: true,
}

// Using jsPDF
const auth = useAuth()
const generatePDF = (data) => {
  const pdfData = data.map(row => ({
    ...(auth.isSuperadmin ? { Organization: row.org_title } : {}),
    'Driver': `${row.lname}, ${row.fname}`,
    'Driver ID': `${row.driver_id}`,
    'Complaint': row.complaint_subject || '-',
    'Plate Number': row.plate_number || '-',
    'Date': dayjs(row.date_committed).format('MM/DD/YYYY'),
  }))

  const headers = [...(auth.isSuperadmin ? ['Organization'] : []), 'Driver', 'Driver ID', 'Complaint', 'Plate Number', 'Date']
  const dateAcquisition = dayjs().format('MMMM DD, YYYY')
  const dateRetrieved = dayjs().format('MM/DD/YYYY')
  const timeRetrieved = dayjs().format('MM/DD/YYYY h:mm A')

  // eslint-disable-next-line new-cap
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.addImage('images/banner.png', 'PNG', 75, 25, 150, 18)
  doc.setFontSize(11).setTextColor('#3D53A4')
  doc.text('P.U.V.\'s Pattern and Attitude on the Streets Using Artificial Intelligence and Data Analytics', 150, 50, null, null, 'center')

  doc.setFont('helvetica', 'bold').setFontSize(36)
  doc.text('COMPILATION OF COMPLAINTS', 150, 100, null, null, 'center')

  doc.setFont('helvetica', 'normal').setFontSize(20)
  doc.text(` ${auth.isSuperadmin ? 'All Organizations' : auth.user.organization.org_title}`, 150, 120, null, null, 'center')

  doc.setFontSize(16)
  doc.text(dateAcquisition, 150, 190, null, null, 'center')

  doc.setFont('helvetica', 'normal').setFontSize(9)

  doc.addPage().setFontSize(9).setTextColor('black')
  doc.addImage('images/banner.png', 'PNG', 10, 8, 100, 12)
  doc.table(10, 25, pdfData, headers,
    { printHeaders: true, autoSize: true, fontSize: 10, margins: { top: 25, right: 20, bottom: 9, left: 14 } })

  // iterating page number and time of generation
  let currentPage = 1
  const limitPage = doc.getNumberOfPages()
  let foo
  for (currentPage; currentPage < limitPage; currentPage++) {
    foo = currentPage + 1
    doc.setPage(foo)
    doc.addImage('images/banner.png', 'PNG', 10, 8, 100, 12)
    doc.text(`Page ${foo} of ${limitPage}`, 285, 202, null, null, 'right')
    doc.text(`Generated on: ${timeRetrieved}`, 10, 202)
  }
  doc.save(`Complaints ${dateRetrieved}.pdf`)
}
</script>

<template>
  <table-crud :pdf="generatePDF" v-bind="{ columns, fields, rules, queries, ...$attrs }" name="complaint" />
</template>
