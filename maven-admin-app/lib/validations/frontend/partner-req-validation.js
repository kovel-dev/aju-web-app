import * as Yup from 'yup'
import PartnerRequest from '../../models/partner-request'

const PartnerReqFormSchema = () => {
  let partnerReq = new PartnerRequest({})
  return Yup.object().shape({
    add_on: Yup.mixed()
      .required({ key: 'add_on', values: 'Add On is required' })
      .oneOf(Object.keys(partnerReq.getAddOnTypes()), {
        key: 'add_on',
        values: 'Select Add On',
      }),
    name: Yup.string()
      .min(2, { key: 'name', values: 'The field is too short' })
      .max(255, { key: 'name', values: 'The field is too long' })
      .required({ key: 'name', values: 'Name is required' }),
    seats_reserved: Yup.mixed().required({
      key: 'seats_reserved',
      values: 'Details is required',
    }),
    details: Yup.string()
      .min(2, { key: 'details', values: 'The field is too short' })
      .required({ key: 'details', values: 'Details is required' }),
    organization: Yup.string()
      .min(2, { key: 'organization', values: 'The field is too short' })
      .required({ key: 'organization', values: 'organization is required' }),
    contact_email: Yup.string()
      .email({ key: 'contact_email', values: 'Email is invalid' })
      .required({ key: 'contact_email', values: 'Email is required' }),
    link: Yup.string().required({ key: 'general', values: 'Link is required' }),
    event_name: Yup.string().required({
      key: 'general',
      values: 'Event Name is required',
    }),
  })
}

export const validatePartnerReqForm = async (enteredData) => {
  return await PartnerReqFormSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
