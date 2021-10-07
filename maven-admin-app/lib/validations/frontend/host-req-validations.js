import * as Yup from 'yup'

const HostReqFormSchema = () => {
  return Yup.object().shape({
    name: Yup.string()
      .min(2, { key: 'name', values: 'The field is too short' })
      .max(255, { key: 'name', values: 'The field is too long' })
      .required({ key: 'name', values: 'Name is required' }),
    title: Yup.string()
      .min(2, { key: 'title', values: 'The field is too short' })
      .required({ key: 'title', values: 'Title is required' }),
    organization: Yup.string()
      .min(2, { key: 'organization', values: 'The field is too short' })
      .required({ key: 'organization', values: 'organization is required' }),
    contact_email: Yup.string()
      .email({ key: 'contact_email', values: 'Email is invalid' })
      .required({ key: 'contact_email', values: 'Email is required' }),
    date: Yup.string()
      .min(2, { key: 'date', values: 'The field is too short' })
      .required({ key: 'date', values: 'Date is required' }),
    type: Yup.string()
      .min(2, { key: 'type', values: 'The field is too short' })
      .required({ key: 'type', values: 'Type is required' }),
    location: Yup.string()
      .min(2, { key: 'location', values: 'The field is too short' })
      .required({ key: 'location', values: 'Location is required' }),
    speaker_meta: Yup.mixed().required({
      key: 'speaker_meta',
      values: 'Selected speaker(s) is required',
    }),
  })
}

export const validateHostReqForm = async (enteredData) => {
  return await HostReqFormSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
