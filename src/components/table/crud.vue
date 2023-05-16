<script setup lang="tsx">
import type { DataTableColumns, FormInst, FormRules, UploadFileInfo } from 'naive-ui'
import { NButton, NPopconfirm } from 'naive-ui'
import formState from '@/utils/formState'
import { useAuth } from '@/utils/auth'
import type { FormFields, Queries } from '@/types'
import { validateMessages } from '@/utils/config'

interface Props {
  columns: DataTableColumns
  rules: FormRules
  fields: FormFields
  name: string
  queries: Queries
  pdf?: Function

  // mode?: 'Add' | 'Edit'
  foreignKey?: string
  foreignKeyValue?: number
}
const props = defineProps<Props>()

const emit = defineEmits(['update:mode'])

const formRef = ref<FormInst | null>(null)
const auth = useAuth()
const message = useMessage()
const modal = reactive({
  show: false,
  mode: '',
})

// GET method
const { data, error, loading, run: refresh } = useRequest(
  async () => {
    let query
    const { queries } = props
    if (queries.get)
      query = queries.get
    else if (!auth.isSuperadmin && queries.organization)
      query = queries.organization
    else query = queries.all
    if (props.foreignKey)
      query += `/${props.foreignKeyValue}`

    if (queries.all === 'userManagement' && queries.organization && !auth.isSuperadmin)
      query = 'getAllUsersOrganization'

    const res = await axios.get(`/${query}`)
    return res.data.results
  }, { initialData: [] },
)

// POST method
const { loading: postLoading, run: postRun } = useRequest(
  () => {
    const { id } = formState.value
    const data = { ...formState.value }
    data.created_by ??= auth.credentials!.id
    if (id) {
      data._method = 'PUT'
      data.updated_by = auth.credentials!.id
      delete data.id
    }

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      value ??= ''
      if (props.fields[key]?.type === 'file') {
        const file = (value as UploadFileInfo[])[0].file!
        formData.append(key, file)
      }
      else { formData.append(key, value as string) }
    })

    let url
    if (id)
      url = `/${props.queries.all}/${id}`
    else url = `/${props.queries.all}`
    return axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  }, {
    manual: true,
    onSuccess: () => {
      message.success(`Saved ${props.name}`)
      refresh()
      modal.show = false
    },
  },
)
function handlePost() {
  formRef.value?.validate().then(() => {
    postRun()
  })
}

// DELETE method
const { run: deleteRun } = useRequest(
  (id) => {
    return axios.delete(`/${props.queries.all}/${id}`)
  }, {
    manual: true,
    onSuccess: () => {
      message.success(`Deleted ${props.name}`)
      refresh()
    },
  },
)

const columns: DataTableColumns = [
  ...props.columns,
  {
    title: 'Actions',
    key: 'actions',
    render(row) {
      if (row.role_id as number <= auth.credentials!.access_level)
        return 'No permissions'
      return <n-space size={6}>
        { props.queries?.edit !== false
            && <n-button round onClick={() => {
              emit('update:mode', 'Edit')
              Object.entries(row).forEach(([key, value]) => {
                if (value == null || props.fields[key]?.type === 'file')
                  delete row[key]
              })
              formState.value = row
              modal.mode = 'Edit'
              modal.show = true
            }}>
              Edit
            </n-button>
        }
        { props.queries?.delete !== false
          && <NPopconfirm positiveButtonProps={{ type: 'warning' }} onPositiveClick={() => deleteRun(row.id)}>{{
            trigger: () => <n-button round secondary type="error">{props.queries?.delete || 'Delete'}</n-button>,
            default: () => `Are you sure to delete this ${props.name}?`,
          }}</NPopconfirm>
        }
      </n-space>
    },
  },
]
if (auth.isSuperadmin && props.queries.organization && props.queries.hasOrganizationField !== false) {
  columns.unshift(
    {
      title: 'Org.',
      key: 'org',
      sorter: (a: any, b: any) => {
        return a?.org_title?.localeCompare(b?.org_title)
            || a?.organization?.org_title?.localeCompare(b?.organization?.org_title)
            || a?.organization_id - b?.organization_id || 0
      },
      render(row: any) {
        return row?.org_title
            || row?.organization?.org_title
            || row?.organization_id
            || ''
      },
    })
}

function handleNew() {
  emit('update:mode', 'Add')
  modal.mode = 'Add'
  formState.value = {}
  modal.show = true
  formState.value.organization_id = auth.isSuperadmin ? 1 : auth.user!.organization_id
  if (props.foreignKey)
    formState.value[props.foreignKey] = props.foreignKeyValue
}

const rules: FormRules = Object.entries(props.rules).reduce((acc, [key, value]) => {
  return { ...acc, [key]: { ...value, trigger: ['input', 'blur'] } }
}, {})
</script>

<template>
  <div>
    <table-base v-if="!error" :loading="loading" v-bind="{ columns, data, pdf }">
      <template #actions>
        <NButton v-if="queries.create !== false" round type="primary" @click="handleNew()">
          <template #icon>
            <i-plus />
          </template>
          Add {{ name }}
        </NButton>
      </template>
    </table-base>
    <app-error v-else v-bind="{ loading }" @refresh="refresh()" />

    <app-modal
      v-model:show="modal.show" :title="`${modal.mode} ${name}`"
    >
      <n-form ref="formRef" :model="formState" v-bind="{ rules, validateMessages }" class="grid gap-x-3" style="grid-template-columns: repeat(24, minmax(0, 1fr))">
        <form-master
          v-if="auth.isSuperadmin && queries.hasOrganizationField" :fields="
            {
              organization_id: {
                type: 'select',
                label: 'Organization',
                queries: { all: 'organization' },
                format: org => org.org_title,
              },
            }"
        />
        <slot name="fields" :mode="modal.mode">
          <form-master v-bind="{ fields }" />
        </slot>
      </n-form>

      <template #footer>
        <NSpace justify="end">
          <NButton round @click="modal.show = false">
            Cancel
          </NButton>
          <NButton round type="primary" :loading="postLoading" @click="handlePost()">
            Save
          </NButton>
        </NSpace>
      </template>
    </app-modal>
  </div>
</template>
