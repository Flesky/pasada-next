<script setup lang="tsx">
import type { DataTableColumns, FormRules } from 'naive-ui'
import type { FormFields, Queries } from '@/types'

const columns: DataTableColumns = [
  {
    title: 'Title',
    key: 'ir_title',
    sorter: 'default',
  },
  {
    title: 'Money',
    key: 'ir_money',
    sorter: 'default',
  },
  {
    title: 'Sponsor',
    key: 'ir_sponsor',
    sorter: 'default',
  },
  {
    title: 'Quantity',
    key: 'ir_qty',
    sorter: 'default',
  },
]

const fields: FormFields = {
  is_id: {
    type: 'select',
    label: 'Incentive',
    placeholder: 'Select incentive...',
    queries: {
      all: 'incentive',
      organization: 'incentiveSettingsOrganization',
    },
    format: incentive => `${incentive.is_title} - ${incentive.is_status}`,
  },
  ir_title: {
    type: 'input',
    label: 'Title',
    placeholder: 'e.g. "Giveaway sponsored by PASADA"',
  },
  ir_sponsor: {
    type: 'input',
    label: 'Sponsor',
    placeholder: 'e.g. "PASADA"',
  },
  ir_qty: {
    type: 'number',
    label: 'Quantity',
    span: 6,
  },
  ir_money: {
    type: 'number',
    label: 'Fare rate',
    span: 6,
    suffix: 'PhP',
  },
}

const rules: FormRules = {
  is_id: {
    type: 'any',
    required: true,
  },
  ir_title: {
    required: true,
  },
  ir_qty: {
    type: 'number',
  },
  ir_money: {
    type: 'number',
  },
}

const queries: Queries = {
  all: 'incentiveReward',
  get: 'incentiveRewardsByIncentiveID',
}
</script>

<template>
  <table-crud v-bind="{ columns, fields, rules, queries }" name="reward" foreign-key="is_id" />
</template>
