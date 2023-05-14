<script setup lang="ts">
import { useAuth } from '@/utils/auth'
import formState from '@/utils/formState'

const props = defineProps<{
  queries: {
    all: string
    organization?: string
  }
  value?: number | null
  format: Function
}>()
const emit = defineEmits(['update:value'])
const model = useVModel(props, 'value', emit)

const auth = useAuth()

const { data, loading } = useRequest(async () => {
  const query = props.queries.organization ? (auth.isSuperadmin ? props.queries.all : props.queries.organization) : props.queries.all
  const res = await axios.get(`/${query}`)
  const data = res.data.results
  return data.map((item: { id: number; organization_id: number }) => ({ label: props.format!(item), value: item.id, organization_id: item.organization_id }))
})

const filteredData = computed(() => {
  if (props.queries.organization && auth.isSuperadmin && formState.value.organization_id !== 1) {
    const filtered = data.value?.filter((item: {
      organization_id: number
    }) => item.organization_id === formState.value.organization_id)
    return filtered || []
  }
  else { return data.value }
})

watch(() => formState.value.organization_id, () => {
  if (props.queries.organization && auth.isSuperadmin)
    model.value = null
})
</script>

<template>
  <n-select v-model:value="model" filterable :options="filteredData" :disabled="loading" />
</template>
