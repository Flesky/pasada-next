<script setup lang="tsx">
import type { FormInst, FormRules } from 'naive-ui'
import type { FormFields } from '@/types'
import formState from '@/utils/formState'

import { validateMessages } from '@/utils/config'

const personalFields: FormFields = {
  marital_status: {
    type: 'dropdown',
    label: 'Marital status',
    options: [
      {
        label: 'Single',
        value: 'Single',
      },
      {
        label: 'Married',
        value: 'Married',
      },
      {
        label: 'Widowed',
        value: 'Widowed',
      },
      {
        label: 'Separated',
        value: 'Separated',
      },
      {
        label: 'Divorced',
        value: 'Divorced',
      },
    ],
    span: 8,
  },
  educational_attainment: {
    type: 'dropdown',
    label: 'Educational attainment',
    options: [
      {
        label: 'Elementary Undergraduate',
        value: 'Elementary Undergraduate',
      },
      {
        label: 'Elementary Graduate',
        value: 'Elementary Graduate',
      },
      {
        label: 'High School Undergraduate',
        value: 'High School Undergraduate',
      },
      {
        label: 'High School Graduate',
        value: 'High School Graduate',
      },
      {
        label: 'College Undergraduate',
        value: 'College Undergraduate',
      },
      {
        label: 'College Graduate',
        value: 'College Graduate',
      },
      {
        label: 'Vocational Education Graduate',
        value: 'Vocational Education Graduate',
      },
    ],
    span: 8,
  },
}

const addressFields: FormFields = {
  home_address_streetnumber_street: {
    type: 'input',
    label: 'House number',
    span: 8,
  },
  home_address_street: {
    type: 'input',
    label: 'Street',
    span: 8,
  },
  home_address_brgy: {
    type: 'input',
    label: 'Barangay',
    span: 8,
  },
  home_address_city: {
    type: 'input',
    label: 'City',
    span: 8,
  },
  state_region: {
    type: 'input',
    label: 'State/region',
    span: 8,
  },
  zip_code: {
    type: 'input',
    label: 'ZIP code',
    span: 8,
  },
}

const jobDescriptionFields: FormFields = {
  salary_level: {
    type: 'dropdown',
    label: 'Salary',
    options: [
      {
        label: 'Below P12,000',
        value: 'Below P12,000',
      },
      {
        label: 'P12,000 to P20,000',
        value: 'P12,000 to P20,000',
      },
      {
        label: 'Above P20,000',
        value: 'Above P20,000',
      },
    ],
    span: 8,
  },
  earnings_range: {
    type: 'number',
    label: 'Earnings range',
    span: 8,
  },
  work_hours_range: {
    type: 'number',
    label: 'Work hours',
    span: 8,
  },
  sleep_hours_range: {
    type: 'input',
    label: 'Sleep hours',
    span: 8,
  },
  start_year_of_exp_in_driving: {
    type: 'input',
    label: 'Year started driving',
    span: 8,
  },
}

const healthFields: FormFields = {
  health_status: {
    type: 'dropdown',
    label: 'Health status',
    options: [
      {
        label: 'Healthy',
        value: 'Healthy',
      },
      {
        label: 'With disability',
        value: 'With disability',
      },
      {
        label: 'With illness',
        value: 'With illness',
      },
    ],
    span: 12,
  },
  medication_maintenance: {
    type: 'dropdown',
    label: 'Medication maintenance',
    options: [
      { label: 'Allergies', value: 'Allergies' },
      { label: 'Alzheimer\'s Disease', value: 'Alzheimer\'s Disease' },
      { label: 'Antiphyschotics', value: 'Antiphyschotics' },
      {
        label: 'Attention Deficit/Hyperactivity Disorder (ADHD)',
        value: 'Attention Deficit/Hyperactivity Disorder (ADHD)',
      },
      { label: 'Blood Modifiers', value: 'Blood Modifiers' },
      { label: 'Cancer', value: 'Cancer' },
      { label: 'Contraceptives', value: 'Contraceptives' },
      { label: 'Hormone Replacement', value: 'Hormone Replacement' },
      { label: 'Depression', value: 'Depression' },
      { label: 'Diabetes', value: 'Diabetes' },
      { label: 'Digestive Enzymes', value: 'Digestive Enzymes' },
      { label: 'Diuretics', value: 'Diuretics' },
      { label: 'Enlarged Prostate', value: 'Enlarged Prostate' },
      { label: 'Glaucoma', value: 'Glaucoma' },
      { label: 'Gout', value: 'Gout' },
      {
        label: 'Heart Disease and High Blood Pressure',
        value: 'Heart Disease and High Blood Pressure',
      },
      { label: 'High Cholesterol', value: 'High Cholesterol' },
      { label: 'Immune Disorders', value: 'Immune Disorders' },
      { label: 'Inflammatory Bowel Diseas', value: 'Inflammatory Bowel Diseas' },
      { label: 'Gastroinestinal Agents', value: 'Gastroinestinal Agents' },
      { label: 'Kidney Disease', value: 'Kidney Disease' },
      { label: 'Miscellaneous', value: 'Miscellaneous' },
      { label: 'Osteoporosis', value: 'Osteoporosis' },
      { label: 'Parkinson\'s Disease', value: 'Parkinson\'s Disease' },
      { label: 'Respiratory Agents', value: 'Respiratory Agents' },
      { label: 'Rheumatoid Arthritis', value: 'Rheumatoid Arthritis' },
      { label: 'Seizure Disorder', value: 'Seizure Disorder' },
      { label: 'Thyroid', value: 'Thyroid' },
      {
        label: 'Ulcer/Gastroesophageal Reflux Disease (GERD)',
        value: 'Ulcer/Gastroesophageal Reflux Disease (GERD)',
      },
    ],
    span: 12,
  },
  drug_test: {
    type: 'radio',
    label: 'Drug test',
    options: [
      {
        label: 'Negative',
        value: 'Negative',
      },
      {
        label: 'Positive',
        value: 'Positive',
      },
    ],
    span: 8,
  },
  alcohol_test: {
    type: 'radio',
    label: 'Alcohol test',
    options: [
      {
        label: 'Negative',
        value: 'Negative',
      },
      {
        label: 'Positive',
        value: 'Positive',
      },
    ],
    span: 8,
  },
  smoker: {
    type: 'radio',
    label: 'Smoker',
    options: [
      {
        label: 'Negative',
        value: 'Non-Smoker',
      },
      {
        label: 'Positive',
        value: 'Smoker',
      },
    ],
    span: 8,
  },
  driver_weight: {
    type: 'number',
    label: 'Weight',
    span: 8,
    suffix: 'kg',
  },
  driver_height: {
    type: 'number',
    label: 'Height',
    span: 8,
    suffix: 'cm',
  },
}

const licenseFields: FormFields = {
  license_registration: {
    type: 'date',
    label: 'Registration date',
    span: 8,
  },
  license_expiration: {
    type: 'date',
    label: 'Expiration date',
    span: 8,
  },
  license_ID_number: {
    type: 'input',
    label: 'Driver\'s license number',
    span: 8,
  },
  license_restriction: {
    type: 'dropdown',
    label: 'Restriction',
    options: [
      {
        label: 'Restriction 1 - Motorbikes or motorized tricycles',
        value: 'Restriction 1 - Motorbikes or motorized tricycles',
      },
      {
        label: 'Restriction 2 - Motor vehicle up to 4500 kg GVW',
        value: 'Restriction 2 - Motor vehicle up to 4500 kg GVW',
      },
      {
        label: 'Restriction 3 - Motor vehicle above 4500 kg GVW',
        value: 'Restriction 3 - Motor vehicle above 4500 kg GVW',
      },
      {
        label: 'Restriction 4 - Automatic transmission up to 4500 kg GVW',
        value: 'Restriction 4 - Automatic transmission up to 4500 kg GVW',
      },
      {
        label: 'Restriction 5 - Automatic transmission above 4500 kg GVW',
        value: 'Restriction 5 - Automatic transmission above 4500 kg GVW',
      },
      {
        label: 'Restriction 6 - Articulated Vehicle 1600 kg GVW & below',
        value: 'Restriction 6 - Articulated Vehicle 1600 kg GVW & below',
      },
      {
        label: 'Restriction 7 - Articulated Vehicle 1601 kg up to 4500 kg GVW',
        value: 'Restriction 7 - Articulated Vehicle 1601 kg up to 4500 kg GVW',
      },
      {
        label: 'Restriction 8 - Articulated Vehicle 4501 kg & above GVW',
        value: 'Restriction 8 - Articulated Vehicle 4501 kg & above GVW',
      },
    ],
  },
  license_condition: {
    type: 'dropdown',
    label: 'Condition',
    options: [
      {
        label: 'Condition A - Wear Eyeglasses',
        value: 'Condition A - Wear Eyeglasses',
      },
      {
        label:
          'Condition B - Drive with special equipment for upper limbs',
        value:
          'Condition B - Drive with special equipment for upper limbs',
      },
      {
        label:
          'Condition C - Drive with special equipment for lower limbs',
        value:
          'Condition C - Drive with special equipment for lower limbs',
      },
      {
        label: 'Condition D - Daylight driving only',
        value: 'Condition D - Daylight driving only',
      },
      {
        label:
          'Condition E - Should always be accompanied by a person without hearing impairment',
        value:
          'Condition E - Should always be accompanied by a person without hearing impairment',
      },
    ],
  },
  training: {
    type: 'number',
    label: 'Months of training',
    span: 8,
  },
}

const emergencyFields: FormFields = {
  emergency_contact_name: {
    type: 'input',
    label: 'Contact name',
    span: 8,
  },
  emergency_contact_number: {
    type: 'input',
    label: 'Contact number',
    span: 8,
  },
  emergency_contact_relationship: {
    type: 'input',
    label: 'Relationship',
    span: 8,
  },
}

const rules: FormRules = Object.entries({
  marital_status: {
    required: true,
  },
  educational_attainment: {
    required: true,
  },
  home_address_streetnumber_street: {
    required: true,
  },
  home_address_street: {
    required: true,
  },
  home_address_brgy: {
    required: true,
  },
  home_address_city: {
    required: true,
  },
  state_region: {
    required: true,
  },
  zip_code: {
    required: true,
  },
  work_hours_range: {
    validator: (_, value) => value < 25 || new Error('Please enter a valid number'),
  },
  sleep_hours_range: {
    validator: (_, value) => value < 25 || new Error('Please enter a valid number'),
  },
  health_status: {
    required: true,
  },
  drug_test: {
    required: true,
  },
  alcohol_test: {
    required: true,
  },
  smoker: {
    required: true,
  },
  license_registration: {
    required: true,
    validator: (_, value) => {
      const input = dayjs(value)
      const now = dayjs()
      return input.isBefore(now) || input.isSame(now) || new Error('Please enter a valid date')
    },
  },
  license_expiration: {
    required: true,
    validator: (_, value) => {
      const input = dayjs(value)
      const now = dayjs()
      return input.isAfter(now) || new Error('Your license is expired')
    },
  },
  license_ID_number: {
    required: true,
    validator: (_, value) => /^[A-Z]\d{2}-\d{2}-\d{6}$/.test(value) || new Error('Invalid format'),
  },
  training: {
    required: true,
    validator: (_, value) => value > 0 || new Error('Please enter a valid number'),
  },
  emergency_contact_name: {
    required: true,
  },
  emergency_contact_number: {
    required: true,
    validator: (_, value) => /^639\d{9}$/.test(value) || new Error('Invalid format'),
  },
}).reduce((acc, [key, value]) => {
  return { ...acc, [key]: { ...value, trigger: ['input', 'blur'] } }
}, {})

const route = useRoute()
const message = useMessage()

const { loading, run } = useRequest(async () => {
  const formData = new FormData()
  const data = { ...formState.value }
  data._method = 'PUT'
  Object.entries(data).forEach(([key, value]) => {
    value ??= ''
    formData.append(key, value as string)
  })
  const res = await axios.post(`/updateDriversInformationUserID/${route.params.id}`, formData)
  return res.data
}, {
  manual: true,
  onSuccess() {
    message.success('Driver information saved')
  },
})

const formRef = ref<FormInst | null>(null)
function handlePost() {
  formRef.value?.validate().then(() => {
    run()
  }).catch(() => {
    message.warning('There are errors in the form')
  })
}
</script>

<template>
  <n-form ref="formRef" :model="formState" :rules="rules" :validate-messages="validateMessages">
    <n-space vertical>
      <n-card title="Personal">
        <div class="grid gap-x-3" style="grid-template-columns: repeat(24, minmax(0, 1fr))">
          <form-master :fields="personalFields" />
        </div>
      </n-card>
      <n-card title="Address">
        <div class="grid gap-x-3" style="grid-template-columns: repeat(24, minmax(0, 1fr))">
          <form-master :fields="addressFields" />
        </div>
      </n-card>
      <n-card title="Job description">
        <div class="grid gap-x-3" style="grid-template-columns: repeat(24, minmax(0, 1fr))">
          <form-master :fields="jobDescriptionFields" />
        </div>
      </n-card>
      <n-card title="Health">
        <div class="grid gap-x-3" style="grid-template-columns: repeat(24, minmax(0, 1fr))">
          <form-master :fields="healthFields" />
        </div>
      </n-card>
      <n-card title="License">
        <div class="grid gap-x-3" style="grid-template-columns: repeat(24, minmax(0, 1fr))">
          <form-master :fields="licenseFields" />
        </div>
      </n-card>
      <n-card title="Emergency contact">
        <div class="grid gap-x-3" style="grid-template-columns: repeat(24, minmax(0, 1fr))">
          <form-master :fields="emergencyFields" />
        </div>
      </n-card>
      <n-button round type="primary" class="!mt-4" :loading="loading" @click="handlePost()">
        Save
      </n-button>
    </n-space>
  </n-form>
</template>
