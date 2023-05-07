<script setup lang="tsx">
import type { DataTableColumns, FormRules } from 'naive-ui'
import { NButton, NTag } from 'naive-ui'
import type { FormFields, Queries } from '@/types'

// definePage({
//   name: 'Incentives',
// })

const rewards = reactive({
  show: false,
  foreignKeyValue: 0,
  title: '',
})

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
  {
    title: 'Rewards',
    key: 'rewards',
    render(row) {
      return <NButton round type="primary" onClick={() => {
        rewards.foreignKeyValue = row.id as number
        rewards.title = row.is_title as string
        rewards.show = true
      }}>Rewards</NButton>
    },
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

  <app-modal v-model:show="rewards.show" :title="`Rewards: ${rewards.title}`">
    <incentives-rewards :foreign-key-value="rewards.foreignKeyValue" />
  </app-modal>
</template>
