import * as Yup from 'yup'

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
  role: Yup.string().required({ key: 'email', values: 'Role is required' }),
})

export const validateUserForm = async (enteredData) => {
  return await UserFormSchema.validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      console.log(err)
      throw err.errors
    })
}
