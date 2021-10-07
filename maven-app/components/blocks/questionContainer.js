import SelectInput from '@components/form/selectInput'
import TextArea from '@components/form/textArea'
import TextInput from '@components/form/textInput'
import { Heading3, Text } from '@components/partials'
import { getErrorMessage, hasError } from 'lib/validations/validations'
import { useEffect, useReducer, useState } from 'react'

const QuestionContainer = (props) => {
  const [userInput, setUserInput] = useState({})

  useEffect(() => {
    const newAnswers = { ...props.answers }
    newAnswers[props.programId.toString()] = userInput
    props.answerHandler(newAnswers)
  }, [userInput])

  return (
    <>
      {props.questions.length > 0 && (
        <div className="px-5 mx-auto max-w-wrapper mb-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-5 lg:gap-10">
            <div className="lg:col-span-3 lg:mt-0">
              <div className="payment-form">
                {props.questions.map((item, index) => {
                  let options = []
                  if (item.type == 'select') {
                    let formattedOptions = item.options
                      .split(',')
                      .map((item, index) => {
                        return { key: item, value: item }
                      })
                    formattedOptions.unshift({
                      key: '',
                      value: 'Select An Option',
                    })

                    options = formattedOptions
                  }

                  return (
                    <div key={index}>
                      <Text
                        text={`${item.label} ${item.isRequired ? '*' : ''}`}
                        className="mb-2 mt-5"
                      />
                      {item.type == 'textarea' && (
                        <TextArea
                          id={'textarea_' + item.id}
                          name={'textarea_' + item.id}
                          placeholder={item.label}
                          required={item.isRequired}
                          onChange={(e) => {
                            const newUserInput = { ...userInput }
                            newUserInput[item.id.toString()] = e.target.value
                            setUserInput(newUserInput)
                          }}
                          disabled={props.isLoading}
                          rows={3}
                          error={
                            hasError(props.errors, item.id + props.programId)
                              ? getErrorMessage(
                                  props.errors,
                                  item.id + props.programId
                                )
                              : null
                          }
                        />
                      )}
                      {item.type == 'text' && (
                        <TextInput
                          width="full"
                          type={'text'}
                          name={'text_' + item.id}
                          id={'text_' + item.id}
                          placeholder={item.label}
                          required={item.isRequired}
                          disabled={props.isLoading}
                          onChange={(e) => {
                            const newUserInput = { ...userInput }
                            newUserInput[item.id.toString()] = e.target.value
                            setUserInput(newUserInput)
                          }}
                          error={
                            hasError(props.errors, item.id + props.programId)
                              ? getErrorMessage(
                                  props.errors,
                                  item.id + props.programId
                                )
                              : null
                          }
                        />
                      )}
                      {item.type == 'select' && (
                        <SelectInput
                          name={'select_' + item.id}
                          id={'select_' + item.id}
                          options={options}
                          placeholder={'Select an option'}
                          disabled={props.isLoading}
                          onChange={(e) => {
                            const newUserInput = { ...userInput }
                            newUserInput[item.id.toString()] = e.target.value
                            setUserInput(newUserInput)
                          }}
                          error={
                            hasError(props.errors, item.id + props.programId)
                              ? getErrorMessage(
                                  props.errors,
                                  item.id + props.programId
                                )
                              : null
                          }
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default QuestionContainer
