import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import TextArea from './textArea'
import Heading from './heading'
import TextInput from './textInput'
import FormEnd from './formEnd'
import SelectInput from './selectInput'
import RadioGroup from './radioGroup'
import CheckboxGroup from './checkboxGroup'

const FormTemplate = ({ schema }) => {
  const [error, setError] = useState('')
  const router = useRouter()
  const [userInput, setUserInput] = useState({})

  return (
    <div className="bg-gray-50 py-12">
      <form className="space-y-8 divide-y divide-gray-200 mx-auto max-w-wrapper pt-2 pb-12 px-4 sm:px-6 lg:px-8 rounded-md bg-white shadow-sm">
        {schema.map((oneInput, index) => {
          if (oneInput.type === 'heading') {
            return (
              <Heading
                heading={oneInput.heading}
                description={oneInput.description}
                key={index}
              />
            )
          }
          if (
            oneInput.type === 'email' ||
            oneInput.type === 'password' ||
            oneInput.type === 'text'
          ) {
            return (
              <TextInput
                key={index}
                label={oneInput.label}
                type={oneInput.type}
                id={oneInput.id}
                name={oneInput.name}
                autoComplete={oneInput.autoComplete}
                placeholder={oneInput.placeholder}
                disabled={oneInput.disabled}
                required={oneInput.required}
                value={userInput[oneInput.id]}
                onChange={(e) => {
                  const newUserInput = { ...userInput }
                  newUserInput[oneInput.id] = e.target.value
                  setUserInput(newUserInput)
                }}
                width={oneInput.width}
              />
            )
          }
          if (oneInput.type === 'select') {
            return (
              <SelectInput
                key={index}
                label={oneInput.label}
                id={oneInput.id}
                name={oneInput.name}
                placeholder={oneInput.placeholder}
                options={oneInput.options}
                value={userInput[oneInput.id]}
                onChange={(e) => {
                  const newUserInput = { ...userInput }
                  newUserInput[oneInput.id] = e.target.value
                  setUserInput(newUserInput)
                }}
              />
            )
          }
          if (oneInput.type === 'radio') {
            return (
              <RadioGroup
                key={index}
                label={oneInput.label}
                description={oneInput.description}
                name={oneInput.name}
                options={oneInput.options}
                valueProp={(newValue) => {
                  const newUserInput = { ...userInput }
                  newUserInput[oneInput.name] = newValue
                  setUserInput(newUserInput)
                }}
              />
            )
          }
          if (oneInput.type === 'checkbox') {
            return (
              <CheckboxGroup
                key={index}
                label={oneInput.label}
                options={oneInput.options}
                valueProp={(newValue) => {
                  const newUserInput = { ...userInput }
                  newUserInput[
                    oneInput.label.toLowerCase().split(' ').join('-')
                  ] = newValue
                  setUserInput(newUserInput)
                }}
              />
            )
          }
          if (oneInput.type === 'textarea') {
            return (
              <TextArea
                key={index}
                label={oneInput.label}
                type={oneInput.type}
                id={oneInput.id}
                name={oneInput.name}
                autoComplete={oneInput.autoComplete}
                placeholder={oneInput.placeholder}
                disabled={oneInput.disabled}
                required={oneInput.required}
                value={userInput[oneInput.id]}
                rows={oneInput.rows}
                instructions={oneInput.instructions}
                onChange={(e) => {
                  const newUserInput = { ...userInput }
                  newUserInput[oneInput.id] = e.target.value
                  setUserInput(newUserInput)
                }}
              />
            )
          }
        })}
        <FormEnd />
      </form>
    </div>
  )
}

export default FormTemplate
