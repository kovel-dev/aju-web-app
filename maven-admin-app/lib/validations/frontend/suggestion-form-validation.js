import * as Yup from 'yup'
import Suggestion from '../../models/suggestion'

const SuggestionFormSchema = () => {
  let suggestion = new Suggestion({})
  return Yup.object().shape({
    type: Yup.mixed()
      .required({ key: 'type', values: 'Type is required' })
      .oneOf(Object.keys(suggestion.getTypes()), {
        key: 'type',
        values: 'Select Type',
      }),
    name: Yup.string()
      .min(2, { key: 'name', values: 'The field is too short' })
      .max(255, { key: 'name', values: 'The field is too long' })
      .required({ key: 'name', values: 'Name is required' }),
    details: Yup.string()
      .min(2, { key: 'details', values: 'The field is too short' })
      .required({ key: 'details', values: 'Details is required' }),
    contact_email: Yup.string()
      .email({ key: 'contact_email', values: 'Email is invalid' })
      .required({ key: 'contact_email', values: 'Email is required' }),
  })
}

export const validateSuggestionForm = async (enteredData) => {
  return await SuggestionFormSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
