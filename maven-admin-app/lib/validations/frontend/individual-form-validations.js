import {
  getCountries,
  getHeardAboutUsOptions,
  getLanguagesOfCommunication,
  getMethodOfCommunications,
  getOrganizationTypes,
  getPronouns,
  getTimezones,
} from '../../handlers/dropdown-helpers'
import * as Yup from 'yup'
import User from '../../models/user'
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

  let validateSchema = {
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
    state: Yup.string()
      .min(2, { key: 'state', values: 'The field is too short' })
      .max(255, { key: 'state', values: 'The field is too long' })
      .required({ key: 'state', values: 'State is required' }),
    city: Yup.string()
      .min(2, { key: 'state', values: 'The field is too short' })
      .max(255, { key: 'state', values: 'The field is too long' })
      .required({ key: 'state', values: 'State is required' }),
    zipcode: Yup.string()
      .min(5, { key: 'zipcode', values: 'The field is too short' })
      .max(8, { key: 'zipcode', values: 'The field is too long' })
      .required({ key: 'zipcode', values: 'Zip Code is required' }),
    country: Yup.mixed()
      .required({ key: 'country', values: 'Country is required' })
      .oneOf(Object.keys(getCountries()), {
        key: 'country',
        values: 'Select Country',
      }),
    timezone: Yup.mixed()
      .required({ key: 'timezone', values: 'Timezone is required' })
      .oneOf(Object.keys(getTimezones()), {
        key: 'timezone',
        values: 'Select Timezone',
      }),
    mobile_number: Yup.string()
      .typeError({ key: 'mobile_number', values: 'Mobile Number is required' })
      .required({ key: 'mobile_number', values: 'Mobile Number is required' })
      .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, {
        message: { key: 'mobile_number', values: 'Mobile Number is not valid' },
      }),
    communication_method: Yup.mixed()
      .required({
        key: 'communication_method',
        values: 'Method of Communication is required',
      })
      .oneOf(Object.keys(getMethodOfCommunications()), {
        key: 'communication_method',
        values: 'Select Method of Communication',
      }),
    communication_language: Yup.mixed()
      .required({
        key: 'communication_language',
        values: 'Language of Communication is required',
      })
      .oneOf(Object.keys(getLanguagesOfCommunication()), {
        key: 'communication_language',
        values: 'Select Language of Communication',
      }),
    affiliation_id: Yup.mixed()
      .required({
        key: 'affiliation_id',
        values: 'Affiliated Organization is required',
      })
      .oneOf(formattedOrganizationList, {
        key: 'affiliation_id',
        values: 'Select Affiliated Organization',
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
  }

  if (hasPassword) {
    // .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    //   message: {
    //     key: 'password',
    //     values:
    //       'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number',
    //   },
    // }),
    validateSchema['password'] = Yup.string()
      .required({
        key: 'password',
        values: 'Password is required',
      })
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: {
          key: 'password',
          values: 'Must Contain 8 Characters and at least One Number',
        },
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

  return Yup.object().shape(validateSchema)
}

export const validateIndividualForm = async (enteredData, hasPassword) => {
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
