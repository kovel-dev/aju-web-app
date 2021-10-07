import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'

function UseForm(stateSchema, validationSchema, callback) {
  const [formData, setFormData] = useState(stateSchema)
  const [disable, setDisable] = useState(true)
  const [isDirty, setIsDirty] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const router = useRouter()

  // Disable button in initial render.
  useEffect(() => {
    setDisable(true)
  }, [])

  // For every changed in our state this will be fired
  // To be able to disable the button
  useEffect(() => {
    if (isDirty && !isReset) {
      setDisable(validateState())
    }
  }, [formData, isDirty])

  // Used to disable submit button if there's an error in state
  // or the required field in state has no value.
  // Wrapped in useCallback to cached the function to avoid intensive memory leaked
  // in every re-render in component
  const validateState = useCallback(() => {
    if (isReset) {
      return false
    }
    const hasErrorInState = Object.keys(validationSchema).some((key) => {
      const isInputFieldRequired = validationSchema[key].required
      const stateValue = formData[key].value // state value
      const stateError = formData[key].error // state error
      return (isInputFieldRequired && !stateValue) || stateError
    })

    return hasErrorInState
  }, [formData, validationSchema])

  // Used to handle every changes in every input
  const handleOnChange = useCallback(
    (event) => {
      setIsDirty(true)
      setIsReset(false)

      const name = event.target.name
      let value = event.target.value

      let error = ''
      if (
        validationSchema[name].required &&
        (!value || value.length === 0 || !value.trim().length)
      ) {
        if (event.target.placeholder) {
          if (event.target.placeholder.includes('*')) {
            error =
              event.target.placeholder.split('*')[0] + ' field is required.'
          } else {
            error = event.target.placeholder + ' field is required.'
          }
        } else {
          error = 'This field is required.'
        }
      }

      if (
        validationSchema[name].validator !== null &&
        typeof validationSchema[name].validator === 'object'
      ) {
        if (value && !validationSchema[name].validator.regEx.test(value)) {
          error = validationSchema[name].validator.error
        }
      }

      if (
        validationSchema[name].minLength &&
        value.length < validationSchema[name].minLength &&
        value.length > 0
      ) {
        error = `A minimum of ${validationSchema[name].minLength} characters required.`
      }

      if (
        validationSchema[name].maxLength &&
        value.length > validationSchema[name].maxLength
      ) {
        value = value.substring(0, validationSchema[name].maxLength)
        error = `A maximum of ${validationSchema[name].maxLength} characters required`
      }

      setFormData((prevState) => ({
        ...prevState,
        [name]: { value, error },
      }))
    },
    [validationSchema]
  )

  const handleOnSubmit = useCallback(
    (event) => {
      event.preventDefault()
      setIsReset(false)

      // Make sure that validateState returns false
      // Before calling the submit callback function
      if (!validateState()) {
        callback(formData)
      }
    },
    [formData]
  )

  const handleReset = useCallback(() => {
    setIsReset(true)
    setFormData(stateSchema)
  })

  const handleBEerror = useCallback((errorArr) => {
    for (let index = 0; index < errorArr.length; index++) {
      const item = errorArr[index]

      let key = item.key
      let value = item.value.value
      let error = item.value.error

      setFormData((prevState) => ({
        ...prevState,
        [key]: { value, error },
      }))
    }
  })

  const updateSingleInput = useCallback((data) => {
    let key = data.key
    let value = data.value
    let error = ''

    setFormData((prevState) => ({
      ...prevState,
      [key]: { value, error },
    }))
  })

  return {
    formData,
    handleOnChange,
    handleOnSubmit,
    disable,
    handleReset,
    handleBEerror,
    updateSingleInput,
  }
}

export default UseForm
