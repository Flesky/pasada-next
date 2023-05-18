<script setup lang="tsx">
import type { DataTableColumns, FormRules } from 'naive-ui'
import type { FormFields, Queries } from '@/types'

definePage({
  name: '',
})

const columns: DataTableColumns = [
  {
    key: 'remind_driver_title',
    title: 'Title',
  },
  {
    key: 'remind_driver_content',
    title: 'Description',
  },
  {
    key: 'created_at',
    title: 'Date',
    sorter: 'default',
    render: row => dayjs(row.created_at).format('MM/DD/YYYY'),
  },
]

const fields: FormFields = {
  remind_driver_title: {
    label: 'Title',
    type: 'input',
  },
  remind_driver_content: {
    label: 'Description',
    type: 'textarea',
  },
}

const rules: FormRules = {
  remind_driver_title: { required: true },
  remind_driver_content: { required: true },
}

const queries: Queries = {
  all: 'remindDriver',
  get: 'getRemindDriverByUserID',
  create: 'Create reminder',
}
</script>

<template>
  <table-crud v-bind="{ columns, fields, rules, queries }" name="" />
</template>
