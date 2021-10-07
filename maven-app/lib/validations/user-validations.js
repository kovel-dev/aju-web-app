import {
  getCountries,
  getHeardAboutUsOptions,
  getLanguagesOfCommunication,
  getMethodOfCommunications,
  getPronouns,
  getTimezones,
} from 'lib/handlers/dropdown-handlers'
import Organization from 'lib/models/organization'
import * as Yup from 'yup'

const UserFormSchema = async (enteredData, isUpdatePage) => {
  let organization = new Organization({})

  // get the list of organization keys or their refId
  let listOforganizations = await organization.getOrganizationForSelect(
    1,
    100000,
    true
  )
  let formattedOrganizationList = listOforganizations.map((entry) => {
    return entry.key
  })

  let validationSchema = {
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
      .required({ key: 'last_name', values: 'Last Name is required' }),
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

  if (isUpdatePage) {
    if (
      enteredData.password.length > 0 ||
      enteredData.confirm_password.length > 0 ||
      enteredData.old_password.length > 0
    ) {
      validationSchema['password'] = Yup.string().required({
        key: 'password',
        values: 'Password is required',
      })
      validationSchema['confirm_password'] = Yup.string()
        .required({
          key: 'confirm_password',
          values: 'Confirm Password is required',
        })
        .oneOf([Yup.ref('password'), null], {
          key: 'password',
          values: 'Password must match',
        })
      validationSchema['old_password'] = Yup.string()
        .required({ key: 'old_password', values: 'Old Password is required' })
        .notOneOf([Yup.ref('password'), null], {
          key: 'password',
          values: 'Old Password must not match with the new password',
        })
    }
  } else {
    validationSchema['password'] = Yup.string().required({
      key: 'password',
      values: 'Password is required',
    })
    validationSchema['confirm_password'] = Yup.string()
      .required({
        key: 'confirm_password',
        values: 'Confirm Password is required',
      })
      .oneOf([Yup.ref('password'), null], {
        key: 'password',
        values: 'Password must match',
      })
  }

  return Yup.object().shape(validationSchema)
}

export const validateUserForm = async (enteredData, isUpdatePage = false) => {
  return await UserFormSchema(enteredData, isUpdatePage).then(
    async (response) => {
      return response
        .validate(enteredData, { abortEarly: false })
        .then(function (value) {
          return value
        })
        .catch(function (err) {
          throw err.errors
        })
    }
  )
}
