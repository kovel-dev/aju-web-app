import * as Yup from 'yup'

const zipcodeRegex =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i

const UserFormSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, { key: 'first_name', values: 'The field is too short' })
    .max(255, { key: 'first_name', values: 'The field is too long' })
    .required({ key: 'first_name', values: 'First Name is required' }),
  last_name: Yup.string()
    .min(2, { key: 'last_name', values: 'The field is too short' })
    .max(255, { key: 'last_name', values: 'The field is too long' })
    .required({ key: 'last_name', values: 'First Name is required' }),
  email: Yup.string()
    .email({ key: 'email', values: 'Email is invalid' })
    .required({ key: 'email', values: 'Email is required' }),
  role: Yup.string().required({ key: 'role', values: 'Role is required' }),
  state: Yup.string().required({ key: 'state', values: 'State is required' }),
  city: Yup.string().required({ key: 'city', values: 'City is required' }),
  country: Yup.string().required({
    key: 'country',
    values: 'Country is required',
  }),
  timezone: Yup.string().required({
    key: 'timezone',
    values: 'Timezone is required',
  }),
  zipcode: Yup.string()
    .required({ key: 'zipcode', values: 'zipcode is required' })
    .matches(zipcodeRegex, {
      message: { key: 'zipcode', values: 'Zipcode is not valid' },
    }),
  mobile_number: Yup.string()
    .matches(/^\d+$/, {
      message: {
        key: 'mobile_number',
        values: 'The field should have digits only',
      },
    })
    .min(10, { key: 'mobile_number', values: 'The field is too short' })
    .max(10, { key: 'mobile_number', values: 'kkk The field is too long' })
    .required({ key: 'mobile_number', values: 'Mobile is required' }),
  affiliation_id: Yup.string(),
  affiliation_other: Yup.string(),
  communication_method: Yup.string().required({
    key: 'communication_method',
    values: 'Communication Method is required',
  }),
  communication_language: Yup.string().required({
    key: 'communication_language',
    values: 'Communication Language is required',
  }),
})

const passwordSchema = Yup.object().shape({
  password: Yup.string().required({
    key: 'password',
    values: 'Password is required',
  }),
  confirm_password: Yup.string()
    .required({
      key: 'confirm_password',
      values: 'Confirm Password is required',
    })
    .oneOf([Yup.ref('password'), null], {
      key: 'password',
      values: 'Password must match',
    }),
})

export const validatePassword = async (enteredData) => {
  return await passwordSchema
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}

// @Note: Miscellaneous functions
export const hasError = (errors, field) => {
  for (let i = 0; i < errors.length; i++) {
    if (errors[i].key == field) {
      return true
    }
  }
}

export const getErrorMessage = (errors, field) => {
  let errorMsg = ''
  for (let i = 0; i < errors.length; i++) {
    if (errors[i].key == field) {
      errorMsg = errors[i].values
    }
  }

  if (errorMsg.length > 0) {
    return errorMsg
  }
}
