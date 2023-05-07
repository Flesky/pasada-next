<script setup lang="tsx">
import type { DataTableColumns, FormRules } from 'naive-ui'
import { NButton } from 'naive-ui'
import { RouterLink } from 'vue-router'
import type { FormFields, Queries } from '@/types'
import TableFieldUser from '@/components/table/field-user.vue'

definePage({
  name: 'Drivers',
})

const columns: DataTableColumns = [
  {
    title: 'Name',
    key: 'name',
    sorter(rowA, rowB) {
      return (`${rowA.fname} ${rowA.lname}`).localeCompare(`${rowB.fname} ${rowB.lname}`)
    },
    render(row) {
      return <TableFieldUser id={row.id} fname={row.fname} lname={row.lname} user_image={row.user_image}></TableFieldUser>
    },
  },
  {
    title: 'Email',
    key: 'email',
    sorter: 'default',
  },
  {
    title: 'Profile',
    key: 'profile',
    render(row) {
      return row.role_id === 4
        ? <RouterLink to={`/drivers/${row.id}`}
                                        target="_blank" as="template">
          <NButton round type="primary">Profile</NButton>
        </RouterLink>
        : ''
    },
  },
]

const fields: FormFields = {
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
    required: true,
    validator: (_, value) => /^639\d{9}$/.test(value) || new Error('Invalid format'),
  },
  email: {
    required: true,
    type: 'email',
  },
}

const queries: Queries = {
  all: 'userManagement',
  get: 'getAllUsers',
  // getAllUsersOrganization
  organization: 'getVerifiedMembersByOrg',
  hasOrganizationField: true,
  delete: false,
}
</script>

<template>
  <table-crud v-bind="{ columns, fields, rules, queries }" name="driver" />
</template>
