/* eslint-disable */
import { hasError, getErrorMessage } from '../../lib/validations/validations'
import TextArea from './textArea'
import Heading from './heading'
import TextInput from './textInput'
import SelectInput from './selectInput'
import RadioGroup from './radioGroup'
import CheckboxGroup from './checkboxGroup'
import Button from './button'
import PhoneInput from './phoneInput'

const FormTemplate = ({
  editIndividual,
  individual,
  formSchema,
  formSubmit,
  formSubmitLabel,
  formIsLoading,
  fieldValues,
  fieldValuesHandler,
  errors,
  isEditPage = false,
  isEditMode = false,
  isEditHandler = null,
}) => {
  return (
    <form className="lg:mt-14" onSubmit={formSubmit}>
      {/* button for edit page */}
      {isEditPage && isEditMode && (
        <div className="flex justify-end pb-7">
          <Button
            type="button"
            action={isEditHandler}
            buttonContent={formIsLoading ? '...' : formSubmitLabel}
            style="blue"
            width="30"
          />
        </div>
      )}
      <div className="flex">
        <div
          className={`flex-col lg:flex hidden pr-10 pt-11 justify-between ${
            editIndividual && !isEditMode
              ? 'pb-60'
              : !individual && isEditPage && isEditMode
              ? 'pb-8'
              : !individual && !isEditMode && isEditPage
              ? 'pb-24'
              : 'pb-44'
          } w-5/12`}
        >
          {formSchema.map((oneInput, index) => {
            if (oneInput.type === 'heading' && oneInput.heading) {
              return (
                <div
                  key={oneInput.heading}
                  className={`
                  ${oneInput.heading.includes('Affiliated') ? '-mt-20' : ''} 
                  ${
                    oneInput.heading.includes('Account Details') && individual
                      ? 'relative bottom-8'
                      : ''
                  }
                  ${
                    oneInput.heading.includes('Account Details') && !individual
                      ? 'relative bottom-12'
                      : ''
                  }
                  ${
                    oneInput.heading.includes('Main Point') && !individual && !isEditPage
                      ? 'relative bottom-6'
                      : ''
                  }
                  ${
                    oneInput.heading.includes('Main Point') && !individual && isEditPage
                      ? 'relative bottom-4'
                      : ''
                  }
                  ${
                    index > 18 && index < 24 && individual && !editIndividual
                      ? 'relative top-1'
                      : ''
                  }
                  ${
                    index > 23 && individual && !editIndividual
                      ? 'relative top-12'
                      : ''
                  }
                  ${index > 28 && index !== 29 ? 'relative top-10' : ''}
                  ${index === 29 && !individual ? 'relative top-2' : ''}
                  ${
                    index > 13 && index < 22 && !individual
                      ? 'relative bottom-12'
                      : ''
                  }
                  ${
                    individual &&
                    editIndividual &&
                    index > 5 &&
                    index < 20 &&
                    index !== 16
                      ? 'relative top-16'
                      : ''
                  }
                  ${
                    individual && editIndividual && index === 20
                      ? 'relative top-36 -mt-4'
                      : ''
                  }
                  ${
                    individual && editIndividual && index === 16
                      ? 'relative top-11'
                      : ''
                  }
                  ${
                    !individual && isEditPage && index === 24
                      ? 'relative bottom-7'
                      : ''
                  }
                  ${
                    !individual && isEditPage && index === 22
                      ? 'relative bottom-10'
                      : ''
                  }
                  ${!individual && isEditPage && oneInput.heading.includes("Subscribe")
                    ? 'relative bottom-7'
                    : ''
                  }
              `}
                >
                  <Heading
                    heading={oneInput.heading}
                    description={oneInput.description}
                    key={index}
                    register={true}
                  />
                </div>
              )
            } else {
              return (
                <div
                  className="block w-full h-6"
                  key={oneInput.type + index}
                ></div>
              )
            }
          })}
        </div>
        <div className="mb-12 w-full form max-w-form mx-auto">
          <div className="lg:pt-0.5 pt-5 space-y-5 lg:space-y-8 mx-auto max-w-wrapper pb-12 sm:px-5 lg:pl-8 lg:pr-2 rounded-md bg-white callout-shadow form lg:flex flex-wrap">
            {/* fields */}
            {formSchema.map((oneInput, index) => {
              if (oneInput.type === 'heading') {
                return (
                  <div
                    className={`${index !== 0 ? 'pt-3 sm:pt-6 w-full' : ''} ${
                      index !== 0 && individual ? 'lg:h-16' : 'lg:h-12'
                    }`}
                  >
                    <div className="lg:hidden -mb-2 sm:mb-0">
                      <Heading
                        heading={oneInput.heading}
                        description={oneInput.description}
                        key={index}
                        register={true}
                      />
                    </div>
                  </div>
                )
              }
              if (
                oneInput.type === 'email' ||
                oneInput.type === 'password' ||
                oneInput.type === 'text'
              ) {
                if (oneInput.type === 'password' && isEditMode) {
                  return (
                    <p id={oneInput.id} key={index}>
                      ********
                    </p>
                  )
                } else {
                  return (
                    <div
                      className={`${
                        oneInput.type === 'password' ||
                        index === 1 ||
                        oneInput.placeholder === 'Title' ||
                        oneInput.placeholder === 'Street Address' ||
                        oneInput.placeholder === 'Zip Code' ||
                        oneInput.placeholder ===
                          'Position or Role in Organization'
                          ? 'w-full'
                          : (oneInput.type === 'email' && index === 16) ||
                            index === 23 ||
                            index === 22
                          ? 'w-full'
                          : 'lg:w-1/2'
                      } lg:pr-6`}
                    >
                      <TextInput
                        key={index}
                        halfFull={oneInput.halfFull ? true : false}
                        label={oneInput.label}
                        type={oneInput.type}
                        id={oneInput.id}
                        name={oneInput.name}
                        autoComplete={oneInput.autoComplete}
                        placeholder={oneInput.placeholder}
                        disabled={
                          formIsLoading || isEditMode ? true : oneInput.disabled
                        }
                        required={oneInput.required}
                        value={fieldValues[oneInput.id]}
                        error={
                          hasError(errors, oneInput.id)
                            ? getErrorMessage(errors, oneInput.id)
                            : ''
                        }
                        onChange={
                          oneInput.onChange
                            ? oneInput.onChange
                            : (e) => {
                                const newUserInput = { ...fieldValues }
                                newUserInput[oneInput.id] = e.target.value
                                fieldValuesHandler(newUserInput)
                              }
                        }
                        width={oneInput.width}
                      />
                    </div>
                  )
                }
              }
              if (oneInput.type === 'phone') {
                return (
                  <div className="lg:w-1/2 lg:pr-6">
                    <PhoneInput
                      id={oneInput.id}
                      name={oneInput.name}
                      value={fieldValues[oneInput.id]}
                      error={
                        hasError(errors, oneInput.id)
                          ? getErrorMessage(errors, oneInput.id)
                          : ''
                      }
                      onChange={
                        oneInput.onChange
                          ? oneInput.onChange
                          : (e) => {
                              const newUserInput = { ...fieldValues }
                              newUserInput[oneInput.id] = e.target.value
                              fieldValuesHandler(newUserInput)
                            }
                      }
                      placeholder={oneInput.placeholder}
                      disabled={
                        formIsLoading || isEditMode ? true : oneInput.disabled
                      }
                      required={oneInput.required}
                      autoComplete={oneInput.autoComplete}
                      width={oneInput.width}
                      key={index}
                    />
                  </div>
                )
              }
              if (oneInput.type === 'select') {
                if (oneInput.otherOptions) {
                  // select has other as options
                  return (
                    <div className="w-full lg:pr-6">
                      <SelectInput
                        halfFull={oneInput.halfFull ? true : false}
                        key={index}
                        label={oneInput.label}
                        id={oneInput.id}
                        name={oneInput.name}
                        placeholder={oneInput.placeholder}
                        options={oneInput.options}
                        disabled={
                          formIsLoading || isEditMode ? true : oneInput.disabled
                        }
                        value={fieldValues[oneInput.id]}
                        error={
                          hasError(errors, oneInput.id)
                            ? getErrorMessage(errors, oneInput.id)
                            : ''
                        }
                        width={oneInput.width}
                        onChange={
                          oneInput.onChange
                            ? oneInput.onChange
                            : (e) => {
                                const newUserInput = { ...fieldValues }

                                let index = e.nativeEvent.target.selectedIndex
                                let selected_label =
                                  e.nativeEvent.target[index].text

                                if (oneInput.id === 'affiliation_id') {
                                  newUserInput['affiliation_name'] =
                                    selected_label
                                }

                                newUserInput[oneInput.id] = e.target.value
                                fieldValuesHandler(newUserInput)
                              }
                        }
                        otherOptions={
                          oneInput.otherOptions ? oneInput.otherOptions : null
                        }
                        otherOnChange={(e) => {
                          const newUserInput = { ...fieldValues }
                          newUserInput[oneInput.otherOptions.id] =
                            e.target.value
                          fieldValuesHandler(newUserInput)
                        }}
                      />
                    </div>
                  )
                } else {
                  return (
                    <div
                      className={`lg:pr-6 ${
                        index > 11 ||
                        index < 4 ||
                        oneInput.placeholder.includes('Preferred') ||
                        oneInput.placeholder.includes('Pronoun')
                          ? 'w-full'
                          : 'lg:w-1/2'
                      }`}
                    >
                      <SelectInput
                        key={index}
                        halfFull={oneInput.halfFull ? true : false}
                        label={oneInput.label}
                        id={oneInput.id}
                        name={oneInput.name}
                        placeholder={oneInput.placeholder}
                        options={oneInput.options}
                        disabled={
                          formIsLoading || isEditMode ? true : oneInput.disabled
                        }
                        value={fieldValues[oneInput.id]}
                        error={
                          hasError(errors, oneInput.id)
                            ? getErrorMessage(errors, oneInput.id)
                            : ''
                        }
                        width={oneInput.width}
                        onChange={
                          oneInput.onChange
                            ? oneInput.onChange
                            : (e) => {
                                const newUserInput = { ...fieldValues }

                                let index = e.nativeEvent.target.selectedIndex
                                let selected_label =
                                  e.nativeEvent.target[index].text

                                if (oneInput.id === 'affiliation_id') {
                                  newUserInput['affiliation_name'] =
                                    selected_label
                                }

                                newUserInput[oneInput.id] = e.target.value
                                fieldValuesHandler(newUserInput)
                              }
                        }
                        otherOptions={
                          oneInput.otherOptions ? oneInput.otherOptions : null
                        }
                      />
                    </div>
                  )
                }
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
                      const newUserInput = { ...fieldValues }
                      newUserInput[oneInput.name] = newValue
                      fieldValuesHandler(newUserInput)
                    }}
                  />
                )
              }
              if (oneInput.type === 'checkbox') {
                if (isEditMode) {
                  return (
                    <p id={oneInput.id} key={index}>
                      {oneInput.label}
                    </p>
                  )
                } else {
                  return (
                    <div className="lg:pr-6">
                      <CheckboxGroup
                        hideLabel={true}
                        key={index}
                        id={oneInput.id}
                        label={oneInput.label}
                        options={oneInput.options}
                        disabled={
                          formIsLoading || isEditMode ? true : oneInput.disabled
                        }
                        error={
                          hasError(errors, oneInput.id)
                            ? getErrorMessage(errors, oneInput.id)
                            : ''
                        }
                        valueProp={(newValue) => {
                          const newUserInput = { ...fieldValues }
                          newUserInput[oneInput.id] = newValue[oneInput.id]
                            ? 'yes'
                            : 'no'
                          fieldValuesHandler(newUserInput)
                        }}
                      />
                    </div>
                  )
                }
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
                    disabled={
                      formIsLoading || isEditMode ? true : oneInput.disabled
                    }
                    required={oneInput.required}
                    value={fieldValues[oneInput.id]}
                    rows={oneInput.rows}
                    instructions={oneInput.instructions}
                    error={
                      hasError(errors, oneInput.id)
                        ? getErrorMessage(errors, oneInput.id)
                        : ''
                    }
                    onChange={
                      oneInput.onChange
                        ? oneInput.onChange
                        : (e) => {
                            const newUserInput = { ...fieldValues }
                            newUserInput[oneInput.id] = e.target.value
                            fieldValuesHandler(newUserInput)
                          }
                    }
                  />
                )
              }
              if (oneInput.type === 'break') {
                return (
                  <div className="lg:pt-3 pt-2">
                    <p className="lg:text-lg -mb-4">{oneInput.text}</p>
                  </div>
                )
              }
            })}
          </div>
          {/* button for registration page  */}
          {!isEditPage && (
            <div className="flex items-center justify-center lg:pt-16">
              <Button
                type="submit"
                disabled={formIsLoading}
                buttonContent={formIsLoading ? '...' : formSubmitLabel}
                style="blue"
                suggestion={true}
              />
            </div>
          )}
        </div>
      </div>
      {isEditPage && !isEditMode && (
        <div className="flex justify-end pb-7">
          <Button
            type="submit"
            disabled={formIsLoading}
            buttonContent={formIsLoading ? '...' : formSubmitLabel}
            style="blue"
            width="30"
          />
        </div>
      )}
    </form>
  )
}

export default FormTemplate
