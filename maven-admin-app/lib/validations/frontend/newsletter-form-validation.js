import * as Yup from 'yup'

const NewsletterFormSchema = () => {
  return Yup.object().shape({
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
    consent: Yup.boolean().oneOf([true], {
      key: 'consent',
      values:
        'You should agree to be added to the mailing list and understand that you may opt out at any time.',
    }),
    url: Yup.string().required({ key: 'url', values: 'Url is required' }),
  })
}

export const validateNewsletterForm = async (enteredData) => {
  return await NewsletterFormSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
