import * as Yup from 'yup'

const ContactUsFormSchema = () => {
  return Yup.object().shape({
    name: Yup.string()
      .min(2, { key: 'name', values: 'The field is too short' })
      .max(255, { key: 'name', values: 'The field is too long' })
      .required({ key: 'name', values: 'Name is required' }),
    email: Yup.string()
      .email({ key: 'email', values: 'Email is invalid' })
      .required({ key: 'email', values: 'Email is required' }),
    message: Yup.string()
      .min(20, { key: 'name', values: 'The field is too short' })
      .required({ key: 'url', values: 'Url is required' }),
  })
}

export const validateConctactUsForm = async (enteredData) => {
  return await ContactUsFormSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
