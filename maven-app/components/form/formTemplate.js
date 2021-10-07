/* eslint-disable */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import TextArea from './textArea'
import Heading from './heading'
import TextInput from './textInput'
import SelectInput from './selectInput'
import RadioGroup from './radioGroup'
import CheckboxGroup from './checkboxGroup'
import Button from './button'
import PhoneInput from './phoneInput'

const FormTemplate = ({
  schema,
  submitContent,
  updateUserInputProp,
  onSubmitProp,
  popup,
  suggestion,
  addOn,
}) => {
  const [error, setError] = useState('')
  const router = useRouter()
  const [userInput, setUserInput] = useState({})

  useEffect(() => {
    updateUserInputProp(userInput)
  }, [userInput])

  return (
    <div
      className={`w-full form ${
        !popup ? 'mb-12 pt-12 callout-shadow' : 'pt-2 lg:pt-0'
      }`}
    >
      <form
        className={`space-y-8 mx-auto max-w-wrapper rounded-md bg-white px-5 ${
          suggestion ? 'pb-16 lg:px-32' : 'pb-12 lg:px-8'
        }`}
      >
        {schema.map((oneInput, index) => {
          if (oneInput.type === 'heading') {
            return (
              <Heading
                heading={oneInput.heading}
                description={oneInput.description}
                key={index}
                suggestion={suggestion}
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
                error={oneInput.error ? oneInput.error : ''}
                label={oneInput.label}
                type={oneInput.type}
                id={oneInput.id}
                name={oneInput.name}
                autoComplete={oneInput.autoComplete}
                placeholder={oneInput.placeholder}
                disabled={oneInput.disabled}
                required={oneInput.required}
                value={userInput[oneInput.id]}
                onChange={
                  oneInput.onChange
                    ? oneInput.onChange
                    : (e) => {
                        const newUserInput = { ...userInput }
                        newUserInput[oneInput.id] = e.target.value
                        setUserInput(newUserInput)
                      }
                }
                width={oneInput.width}
              />
            )
          }
          if (oneInput.type === 'phone') {
            return (
              <PhoneInput
                id={oneInput.id}
                name={oneInput.name}
                value={userInput[oneInput.id]}
                onChange={
                  oneInput.onChange
                    ? oneInput.onChange
                    : (e) => {
                        const newUserInput = { ...userInput }
                        newUserInput[oneInput.id] = e.target.value
                        setUserInput(newUserInput)
                      }
                }
                placeholder={oneInput.placeholder}
                disabled={oneInput.disabled}
                required={oneInput.required}
                autoComplete={oneInput.autoComplete}
                width={oneInput.width}
                error={oneInput.error ? oneInput.error : ''}
                key={index}
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
                error={oneInput.error ? oneInput.error : ''}
                width={oneInput.width}
                onChange={
                  oneInput.onChange
                    ? oneInput.onChange
                    : (e) => {
                        const newUserInput = { ...userInput }
                        newUserInput[oneInput.id] = e.target.value
                        setUserInput(newUserInput)
                      }
                }
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
                hideLabel={true}
                key={index}
                label={oneInput.label}
                options={oneInput.options}
                valueProp={(newValue) => {
                  const newUserInput = { ...userInput }

                  const fieldName = oneInput.id
                    .toLowerCase()
                    .split('-')
                    .join('_')
                  newUserInput[fieldName] =
                    newValue[oneInput.id.toLowerCase()] || false
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
                error={oneInput.error ? oneInput.error : ''}
                onChange={
                  oneInput.onChange
                    ? oneInput.onChange
                    : (e) => {
                        const newUserInput = { ...userInput }
                        newUserInput[oneInput.id] = e.target.value
                        setUserInput(newUserInput)
                      }
                }
              />
            )
          }
          if (oneInput.type === 'break') {
            return (
              <div className="pt-8">
                <p className="text-lg -mb-4">{oneInput.text}</p>
              </div>
            )
          }
        })}
        {/* <FormEnd /> */}
        <div
          className={`${
            suggestion ? 'lg:pt-7 flex items-center justify-center w-full' : ''
          }`}
        >
          <Button
            type="submit"
            buttonContent={submitContent}
            style="blue"
            action={onSubmitProp}
            suggestion={suggestion}
          />
        </div>
        {addOn && (
          <p className="font-bold lg:text-lg text-center">
            Do you have questions about add-ons?{' '}
            <a
              className="underline whitespace-nowrap"
              href="mailto:mavensupport@aju.edu"
            >
              Contact our Maven Support now
            </a>
            .
          </p>
        )}
      </form>
    </div>
  )
}

export default FormTemplate
