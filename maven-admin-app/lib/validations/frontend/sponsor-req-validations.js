import * as Yup from 'yup'

const SponsorReqFormSchema = () => {
  return Yup.object().shape({
    name: Yup.string()
      .min(2, { key: 'name', values: 'The field is too short' })
      .max(255, { key: 'name', values: 'The field is too long' })
      .required({ key: 'name', values: 'Name is required' }),
    email: Yup.string()
      .email({ key: 'email', values: 'Email is invalid' })
      .required({ key: 'email', values: 'Email is required' }),
    tier: Yup.string()
      .min(2, { key: 'tier', values: 'The field is too short' })
      .required({ key: 'tier', values: 'Tier is required' }),
    details: Yup.string()
      .min(25, { key: 'details', values: 'The field is too short' })
      .required({ key: 'details', values: 'Details is required' }),
  })
}

export const validateSponsorReqForm = async (enteredData) => {
  return await SponsorReqFormSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
