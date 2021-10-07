import React from 'react'
import Heading from './section/heading'
import TextBox from './section/textbox'
import Select from './section/select'
import File from './section/file'
import MultiSelect from './section/multi-select'
import DatePicker from './section/datetimepicker'
import Number from './section/number'
import TextArea from './section/textarea'
import Hidden from './section/hidden'
import HiddenStatic from './section/hiddenStatic'
import RichTextEditor from './section/richTextEditor'
import FormActionButtons from './section/form-action-buttons'
import { hasError, getErrorMessage } from '../../lib/validations/validations'

function FormBuilder(props) {
  const schema = props.formSchema
  const fieldValues = props.fieldValues
  const isEdit = props.isEdit
  return (
    <>
      <form
        className="space-y-8 divide-y divide-gray-200"
        onSubmit={props.formSubmit}
      >
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="form-section-holder">
            {schema.map((component, key) => {
              if (component.type == 'heading') {
                return (
                  <Heading
                    title={component.title}
                    subHeading={component.subHeading}
                    key={key}
                  />
                )
              }
              if (component.type == 'textbox') {
                return (
                  <TextBox
                    slugEditFlag={isEdit}
                    label={component.label}
                    id={component.id}
                    name={component.name}
                    width={component.width}
                    isRequired={component.isRequired}
                    value={fieldValues[component.name]}
                    fieldValues={fieldValues}
                    fieldValuesHandler={props.fieldValuesHandler}
                    invalid={
                      hasError(props.errors, component.name) ? true : false
                    }
                    errMsg={
                      hasError(props.errors, component.name)
                        ? getErrorMessage(props.errors, component.name)
                        : ''
                    }
                    disabled={component.disabled ? component.disabled : false}
                    key={key}
                  />
                )
              }
              if (component.type == 'select') {
                return (
                  <Select
                    label={component.label}
                    id={component.id}
                    name={component.name}
                    options={component.options}
                    isRequired={component.isRequired}
                    value={fieldValues[component.name]}
                    fieldValues={fieldValues}
                    fieldValuesHandler={props.fieldValuesHandler}
                    invalid={
                      hasError(props.errors, component.name) ? true : false
                    }
                    errMsg={
                      hasError(props.errors, component.name)
                        ? getErrorMessage(props.errors, component.name)
                        : ''
                    }
                    conditionField={
                      component.conditionField ? component.conditionField : ''
                    }
                    conditionFalseValue={
                      component.conditionFalseValue
                        ? component.conditionFalseValue
                        : ''
                    }
                    key={key}
                  />
                )
              }
              if (component.type == 'file') {
                return (
                  <File
                    label={component.label}
                    id={component.id}
                    name={component.name}
                    isRequired={component.isRequired}
                    value={fieldValues[component.name]}
                    fieldValues={fieldValues}
                    fieldValuesHandler={props.fieldValuesHandler}
                    invalid={
                      hasError(props.errors, component.name) ? true : false
                    }
                    errMsg={
                      hasError(props.errors, component.name)
                        ? getErrorMessage(props.errors, component.name)
                        : ''
                    }
                    showPDF={component.showPDF ? true : false}
                    key={key}
                  />
                )
              }
              if (component.type == 'hidden') {
                return (
                  <Hidden
                    subType={component.subType}
                    fieldValues={fieldValues}
                    fieldValuesHandler={props.fieldValuesHandler}
                    showPDF={component.showPDF ? true : false}
                  />
                )
              }
              if (component.type == 'hiddenStatic') {
                return (
                  <HiddenStatic
                    subType={component.subType}
                    fieldValues={fieldValues}
                    fieldValuesHandler={props.fieldValuesHandler}
                  />
                )
              }
              if (component.type == 'multi-select') {
                return (
                  <MultiSelect
                    subType={component.subType}
                    label={component.label}
                    instanceId={component.id}
                    id={component.id}
                    name={component.name}
                    options={component.options}
                    isRequired={component.isRequired}
                    value={fieldValues[component.name]}
                    fieldValues={fieldValues}
                    fieldValuesHandler={props.fieldValuesHandler}
                    invalid={
                      hasError(props.errors, component.name) ? true : false
                    }
                    errMsg={
                      hasError(props.errors, component.name)
                        ? getErrorMessage(props.errors, component.name)
                        : ''
                    }
                    key={key}
                  />
                )
              }
              if (component.type == 'datetime') {
                return (
                  <DatePicker
                    label={component.label}
                    // instanceId={component.id}
                    id={component.id}
                    name={component.name}
                    options={component.options}
                    isRequired={component.isRequired}
                    value={fieldValues[component.name]}
                    fieldValues={fieldValues}
                    fieldValuesHandler={props.fieldValuesHandler}
                    invalid={
                      hasError(props.errors, component.name) ? true : false
                    }
                    errMsg={
                      hasError(props.errors, component.name)
                        ? getErrorMessage(props.errors, component.name)
                        : ''
                    }
                    conditionField={
                      component.conditionField ? component.conditionField : ''
                    }
                    conditionFalseValue={
                      component.conditionFalseValue
                        ? component.conditionFalseValue
                        : ''
                    }
                    key={key}
                  />
                )
              }
              if (component.type == 'number') {
                return (
                  <Number
                    label={component.label}
                    id={component.id}
                    name={component.name}
                    width={component.width}
                    isRequired={component.isRequired}
                    value={fieldValues[component.name]}
                    fieldValues={fieldValues}
                    fieldValuesHandler={props.fieldValuesHandler}
                    invalid={
                      hasError(props.errors, component.name) ? true : false
                    }
                    errMsg={
                      hasError(props.errors, component.name)
                        ? getErrorMessage(props.errors, component.name)
                        : ''
                    }
                    conditionField={
                      component.conditionField ? component.conditionField : ''
                    }
                    conditionFalseValue={
                      component.conditionFalseValue
                        ? component.conditionFalseValue
                        : ''
                    }
                    key={key}
                  />
                )
              }
              if (component.type == 'textarea') {
                return (
                  <TextArea
                    label={component.label}
                    id={component.id}
                    name={component.name}
                    width={component.width}
                    isRequired={component.isRequired}
                    value={fieldValues[component.name]}
                    fieldValues={fieldValues}
                    fieldValuesHandler={props.fieldValuesHandler}
                    invalid={
                      hasError(props.errors, component.name) ? true : false
                    }
                    errMsg={
                      hasError(props.errors, component.name)
                        ? getErrorMessage(props.errors, component.name)
                        : ''
                    }
                    key={key}
                  />
                )
              }
              if (component.type == 'richtexteditor') {
                return (
                  <RichTextEditor
                    label={component.label}
                    id={component.id}
                    name={component.name}
                    width={component.width}
                    isRequired={component.isRequired}
                    value={fieldValues[component.name]}
                    fieldValues={fieldValues}
                    fieldValuesHandler={props.fieldValuesHandler}
                    invalid={
                      hasError(props.errors, component.name) ? true : false
                    }
                    errMsg={
                      hasError(props.errors, component.name)
                        ? getErrorMessage(props.errors, component.name)
                        : ''
                    }
                    key={key}
                  />
                )
              }
              if (component.type == 'form-action-buttons') {
                return (
                  <FormActionButtons
                    submitLabel={component.submitLabel}
                    key={key}
                  />
                )
              }
            })}
          </div>
        </div>
      </form>
    </>
  )
}

export default FormBuilder
