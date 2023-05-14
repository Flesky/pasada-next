<script setup lang="tsx">
import type {
  SelectRenderLabel,
  SelectRenderTag,
} from 'naive-ui'
import {
  NAvatar,
  NText,
} from 'naive-ui'
import { useAuth } from '@/utils/auth'
import formState from '@/utils/formState'

const props = defineProps<{
  query: string
  value?: number
}>()
const emit = defineEmits(['update:value'])
const model = useVModel(props, 'value', emit)

const { data, loading } = useRequest(async () => {
  const results = await axios.get(`/${props.query}`)
  return results.data.results.map(item => ({
    label: (item.fname ? `${item.fname} ${item.lname}` : `${item.fname} ${item.lname}`) + item.email,
    organization_id: item.organization_id,
    value: item.id,
    name: item.fname ? `${item.fname} ${item.lname}` : `${item.fname} ${item.lname}`,
    email: item.email,
    image: `${import.meta.env.VITE_BACKEND_URL}/api/fileUserImage/${item.user_image}`,
  }))
})

const auth = useAuth()
const filteredData = computed(() => {
  if (auth.isSuperadmin) {
    const filtered = data.value?.filter((item: {
      organization_id: number
    }) => item.organization_id === formState.value.organization_id)
    return filtered || []
  }
  else {
    return data.value
  }
})

watch(filteredData, () => {
  if (auth.isSuperadmin)
    model.value = null
})

const renderSingleSelectTag: SelectRenderTag = ({ option }) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    [
      h(NAvatar, {
        fallbackSrc: '/images/default.svg',
        src: option.image as string,
        round: true,
        size: 24,
        style: {
          marginRight: '12px',
        },
      },
      {
        default: () => option.image ? undefined : (option.name as string || '').slice(0, 1).toUpperCase(),
      },
      ),
      option.name as string,
    ],
  )
}
const renderLabel: SelectRenderLabel = (option) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    [
      h(NAvatar, {
        fallbackSrc: '/images/default.svg',
        src: option.image as string,
        round: true,
      }, {
        default: () => option.image ? undefined : (option.name as string).slice(0, 1).toUpperCase(),
      }),
      h(
        'div',
        {
          style: {
            marginLeft: '12px',
            padding: '4px 0',
          },
        },
        [
          h('div', null, [option.name as string]),
          h(
            NText,
            { depth: 3, tag: 'div' },
            {
              default: () => option.email,
            },
          ),
        ],
      ),
    ],
  )
}
</script>

<template>
  <n-select v-model:value="model" clearable filterable :options="filteredData" :disabled="loading" :render-label="renderLabel" :render-tag="renderSingleSelectTag" />
</template>
