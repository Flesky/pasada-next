<script setup lang="tsx">
import type { DataTableColumns } from 'naive-ui'
import { NTag } from 'naive-ui'
import { Bar } from 'vue-chartjs'
import { BarElement, CategoryScale, Chart as ChartJS, Colors, Legend, LinearScale, Title, Tooltip } from 'chart.js'

const props = defineProps<{
  foreignKeyValue: number
}>()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Colors)

const columns: DataTableColumns = [
  {
    title: 'Quiz',
    key: 'quiz_information.quiz_title',
    sorter: 'default',
  },
  {
    title: 'Score',
    key: 'score',
    sorter: 'default',
    render(row: any) {
      return <div>{row.number_of_correct_answers}/{row.quiz_information.total_points}</div>
    },
  },
  {
    title: 'Grade',
    key: 'grade',
    sorter: 'default',
    render(row: any) {
      const percent = Math.round(
        (row.number_of_correct_answers
              / row.quiz_information.total_points)
          * 100,
      )
      return <div class="flex"><div class="w-12">{percent}%</div> <NTag type={percent >= 50 ? 'success' : 'error'}>
        {
          percent >= 50 ? 'Passed' : 'Failed'
        }
      </NTag></div>
    },
  },
  {
    title: 'Date',
    key: 'created_at',
    sorter: 'default',
    render: row => dayjs(row.created_at).format('MM/DD/YYYY h:mm A'),
  },
]

const { data, loading, error, refresh } = useRequest(async () => {
  const res = await axios.get(`getScoreByUserID/${props.foreignKeyValue}`)

  const attempts = res.data.results
  const statistics = {
    attempts: attempts.length,
    average: Math.round(attempts.reduce((acc: number, cur: { number_of_correct_answers: number; quiz_information: { total_points: number } }) => acc + cur.number_of_correct_answers / cur.quiz_information.total_points, 0) / attempts.length * 100),
  }
  return {
    attempts,
    statistics,
  }
})
</script>

<template>
  <div v-if="loading">
    Loading...
  </div>
  <div v-else-if="data?.statistics.attempts">
    <n-space vertical>
      <n-row gutter="8">
        <n-col :span="12">
          <n-card>
            <n-statistic label="Total attempts" :value="data.attempts.length" />
          </n-card>
        </n-col>
        <n-col :span="12">
          <n-card>
            <n-statistic label="Average score" :value="`${data.statistics.average}%`" />
          </n-card>
        </n-col>
      </n-row>
      <n-card>
        <Bar
          id="my-chart-id"
          class="max-h-64"
          :options="{ responsive: true, scales: { y: { max: 100 } } }"
          :data="{
            labels: data.attempts.map((attempt: any) => attempt.quiz_information.quiz_title),
            datasets: [
              {
                label: 'Score',
                data: data.attempts.map((attempt: any) => Math.round(attempt.number_of_correct_answers / attempt.quiz_information.total_points * 100)),
              }],
          }"
        />
      </n-card>
      <table-base v-bind="{ columns, data: data.attempts }" />
    </n-space>
  </div>
  <app-error v-else-if="error" :loading="loading" @refresh="refresh()" />
  <div v-else>
    This user has not taken any quizzes yet.
  </div>
</template>
