import {
  getHeardAboutUsOptions,
  getLanguagesOfCommunication,
  getMethodOfCommunications,
  getPronouns,
} from '../../handlers/dropdown-helpers'
import * as Yup from 'yup'
import OrganizationForm from '../../models/frontend/organization-form'

const UserFormSchema = async (hasPassword) => {
  let organizationForm = new OrganizationForm({})

  // get the list of organization keys or their refId
  let listOforganizations = await organizationForm.getOrganizationForSelect(
    1,
    100000
  )
  let formattedOrganizationList = listOforganizations.map((entry) => {
    return entry.key
  })

  let validateSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, { key: 'title', values: 'The field is too short' })
      .max(255, { key: 'title', values: 'The field is too long' })
      .required({ key: 'title', values: 'Title is required' }),
    first_name: Yup.string()
      .min(2, { key: 'first_name', values: 'The field is too short' })
      .max(255, { key: 'first_name', values: 'The field is too long' })
      .required({ key: 'first_name', values: 'First Name is required' }),
    last_name: Yup.string()
      .min(2, { key: 'last_name', values: 'The field is too short' })
      .max(255, { key: 'last_name', values: 'The field is too long' })
      .required({ key: 'last_name', values: 'First Name is required' }),
    pronoun: Yup.mixed()
      .required({ key: 'pronoun', values: 'Pronoun is required' })
      .oneOf(Object.keys(getPronouns()), {
        key: 'pronoun',
        values: 'Select Pronoun',
      }),
    mobile_number: Yup.string()
      .typeError({ key: 'mobile_number', values: 'Mobile Number is required' })
      .required({ key: 'mobile_number', values: 'Mobile Number is required' })
      .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, {
        message: { key: 'mobile_number', values: 'Mobile Number is not valid' },
      }),
    email: Yup.string()
      .email({ key: 'email', values: 'Email is invalid' })
      .required({ key: 'email', values: 'Email is required' }),
    heard_about: Yup.mixed()
      .required({
        key: 'heard_about',
        values: 'How did you hear about Maven? is required',
      })
      .oneOf(Object.keys(getHeardAboutUsOptions()), {
        key: 'heard_about',
        values: 'Select How did you hear about Maven?',
      }),
    accepted_term_and_conditions: Yup.string().oneOf(['yes'], {
      key: 'accepted_term_and_conditions',
      values: 'Terms of Service and Privacy Policy is required',
    }),
  })

  if (hasPassword) {
    validateSchema['password'] = Yup.string().required({
      key: 'password',
      values: 'Password is required',
    })
    validateSchema['confirm_password'] = Yup.string()
      .required({
        key: 'confirm_password',
        values: 'Confirm Password is required',
      })
      .oneOf([Yup.ref('password'), null], {
        key: 'password',
        values: 'Password must match',
      })
  }

  return validateSchema
}

export const validatePartnerForm = async (enteredData, hasPassword) => {
  return await UserFormSchema(hasPassword).then(async (response) => {
    return response
      .validate(enteredData, { abortEarly: false })
      .then(function (value) {
        return value
      })
      .catch(function (err) {
        throw err.errors
      })
  })
}
