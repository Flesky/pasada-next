interface FieldItem {
  label: string
  placeholder?: string
  span?: number
}

interface FieldAutocomplete extends FieldItem {
  type: 'autocomplete'
  options: string[]
}

interface FieldCheckbox extends FieldItem {
  type: 'checkbox'
  checkboxLabel: string
  checkedValue: string | number
  uncheckedValue: string | number
}

interface FieldDate extends FieldItem {
  type: 'date'
}

interface FieldDropdown extends FieldItem {
  type: 'dropdown'
  options: { label: string; value: string }[]
}

interface FieldFile extends FieldItem {
  type: 'file'
  accept: string
}

interface FieldInput extends FieldItem {
  type: 'input'
}

interface FieldNumber extends FieldItem {
  type: 'number'
  suffix?: string
}

interface FieldPassword extends FieldItem {
  type: 'password'
}

interface FieldQuill extends FieldItem {
  type: 'quill'
}

interface FieldRadio extends Omit<FieldItem, 'placeholder'> {
  type: 'radio'
  options: { label: string; value: string | number }[]
}

interface FieldSelect extends FieldItem {
  type: 'select'
  queries: {
    all: string
    organization?: string
  }
  format: (object: Record<string, string>) => string
  organization_id?: number
}

interface FieldSelectUser extends FieldItem {
  type: 'select-user'
  queries: {
    all: string
    organization?: string
  }
  organization_id?: number
}

interface FieldTextarea extends FieldItem {
  type: 'textarea'
}

interface FieldTime extends FieldItem {
  type: 'time'
}

type Path = string
type FormFieldTypes = (FieldAutocomplete | FieldCheckbox | FieldDate | FieldDropdown | FieldFile | FieldInput | FieldNumber | FieldPassword | FieldSelect | FieldRadio | FieldQuill | FieldSelectUser | FieldTextarea | FieldTime)

export interface FormFields {
  [path: Path]: FormFieldTypes
}
