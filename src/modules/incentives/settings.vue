<script setup lang="tsx">
import type { DataTableColumns, FormRules } from 'naive-ui'
import { NTag } from 'naive-ui'
import type { FormFields, Queries } from '@/types'

const columns: DataTableColumns = [
  {
    title: 'Title',
    key: 'is_title',
    sorter: 'default',
  },
  {
    title: 'Description',
    key: 'is_description',
    sorter: 'default',
  },
  {
    title: 'Status',
    key: 'is_status',
    render(row) {
      return <NTag type={{
        Inactive: 'warning',
        Active: 'success',
      }[row.is_status as string] as 'success' | 'warning'}>{row.is_status}</NTag>
    },
    sorter: 'default',
  },
]

const fields: FormFields = {
  is_title: {
    type: 'input',
    label: 'Title',
    placeholder: 'e.g. "Free gasoline"',
  },
  is_description: {
    type: 'textarea',
    label: 'Description',
    placeholder: 'Type description here...',
  },
  is_status: {
    type: 'radio',
    label: 'Status',
    options: [
      {
        label: 'Active',
        value: 'Active',
      },
      {
        label: 'Inactive',
        value: 'Inactive',
      },
    ],
  },
}

const rules: FormRules = {
  is_title: {
    required: true,
  },
  is_description: {
    required: true,
  },
  is_status: {
    required: true,
  },
}

const queries: Queries = {
  all: 'incentive',
  organization: 'incentiveSettingsOrganization',
  hasOrganizationField: true,
}
</script>

<template>
  <table-crud v-bind="{ columns, fields, rules, queries }" name="incentive" />
</template>
