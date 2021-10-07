import React, { useEffect, useState } from 'react'
import { FieldArray, useFormikContext } from 'formik'
import RichTextEditorField from './richTextEditor'

function TestimonialsFaqFieldArray(props) {
  const name = props.name
  const formikProps = useFormikContext()
  const fieldValues = formikProps.values[name]
  const [refreshKey, setRefreshKey] = useState(1)

  return (
    <>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <div>
            {fieldValues &&
              formikProps.values[name].map((inputs, index) => (
                <div
                  key={index}
                  className="border-gray-400 border-solid border-2 p-2 my-1"
                >
                  {/** both these conventions do the same */}
                  <RichTextEditorField
                    attr={{ label: 'Question' }}
                    name={name + `.[${index}].question`}
                    fieldValues={inputs}
                    fieldValuesHandler={(newValue) => {
                      arrayHelpers.replace(index, newValue)
                    }}
                    fieldKey={refreshKey}
                  />
                  <RichTextEditorField
                    attr={{ label: 'Answer' }}
                    name={name + `.[${index}].answer`}
                    fieldValues={inputs}
                    fieldValuesHandler={(newValue) => {
                      arrayHelpers.replace(index, newValue)
                    }}
                    fieldKey={refreshKey}
                  />
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-red-500"
                      data-xxx={index + '-butt'}
                      onClick={() => {
                        arrayHelpers.remove(index)
                        setRefreshKey(Math.floor(Math.random() * 100 + 1))
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            <div className="text-left">
              <button
                type="button"
                className="bg-primary ml-4 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary p-2 px-4 rounded-md my-3"
                onClick={() =>
                  arrayHelpers.push({
                    question: '',
                    answer: '',
                  })
                }
              >
                Add Details
              </button>
            </div>
          </div>
        )}
      />
    </>
  )
}

export default TestimonialsFaqFieldArray
