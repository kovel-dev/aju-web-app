import React from 'react'
import { Field, FieldArray, useFormikContext } from 'formik'
import TextField from './textfield'
import FileField from './filefield'

function TestimonialsFieldArray(props) {
  const name = props.name
  const formikProps = useFormikContext()
  const fieldValues = formikProps.values[name]
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
                  <TextField
                    attr={{ label: 'First Name' }}
                    name={name + `[.${index}].firstName`}
                  />
                  <TextField
                    attr={{ label: 'Last Name' }}
                    name={name + `[.${index}].lastName`}
                  />
                  <FileField
                    attr={{ label: 'Thumbnail Image' }}
                    name={name + `[.${index}].image`}
                  />
                  <TextField
                    attr={{ label: 'Quote' }}
                    name={name + `[.${index}].quote`}
                  />
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => arrayHelpers.remove(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            <div className="text-left">
              <button
                type="button"
                className="text-white bg-indigo-600 p-2 px-4 rounded-md my-3"
                onClick={() =>
                  arrayHelpers.push({
                    firstName: '',
                    lastName: '',
                    image: '',
                    quote: '',
                  })
                }
              >
                Add Testimonials
              </button>
            </div>
          </div>
        )}
      />
    </>
  )
}

export default TestimonialsFieldArray
