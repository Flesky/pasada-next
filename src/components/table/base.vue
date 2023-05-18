<script setup lang="ts">
import type { DataTableColumns, PaginationProps } from 'naive-ui'
import { NButton } from 'naive-ui'
import SearchOutline from '~icons/ion/SearchOutline'
const props = defineProps<{
  columns: DataTableColumns
  loading?: boolean
  data: object[]
  pdf?: Function
}>()

const pagination: PaginationProps = {
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  prefix: (info) => {
    if (info.itemCount)
      return `${info.startIndex + 1} to ${info.endIndex + 1} of ${info.itemCount} items`
  },

}

const search = ref('')
const filteredData = computed(() => {
  if (!search.value)
    return props.data
  return props.data.filter((row) => {
    // Convert object values to string recursively
    delete row.mname
    const values = Object.values(row).map((value) => {
      if (typeof value === 'object' && value)
        return Object.values(value).join(' ')

      return value || ''
    }).join(' ').toLowerCase()
    return values.includes(search.value.toLowerCase())
  })
})
</script>

<template>
  <n-card>
    <template #header>
      <slot name="header" />
      <div />
    </template>
    <template #header-extra>
      <n-space size="small" class="">
        <n-input v-model:value="search" round placeholder="Type to search..." clearable>
          <template #prefix>
            <n-icon :component="SearchOutline" />
          </template>
        </n-input>
        <NButton v-if="pdf && filteredData.length" round @click="pdf(filteredData)">
          <template #icon>
            <i-download-outline />
          </template>
          Download PDF
        </NButton>
        <slot name="actions" />
      </n-space>
    </template>

    <n-scrollbar x-scrollable>
      <n-data-table :data="filteredData" v-bind="{ columns, loading, pagination }" class="min-w-max pb-6" :row-key="(row) => row.id" />
    </n-scrollbar>
  </n-card>
</template>

<style>
.n-data-table > * {
  @apply !break-words;
}

.n-data-table .n-data-table-td {
  max-width: 240px;
  margin-top: 60px;
}
</style>
