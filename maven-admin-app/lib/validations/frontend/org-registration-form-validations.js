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
import OrganizationForm from '../../models/frontend/organization-form'

const OrganizationFormSchema = async () => {
  let organizationForm = new OrganizationForm({})

  // get the list of organization keys or their refId
  let listOforganizations = await organizationForm.getOrganizationForSelect(
    1,
    100000
  )
  let formattedOrganizationList = listOforganizations.map((entry) => {
    return entry.key
  })

  return Yup.object().shape({
    // organization info
    org_name: Yup.string()
      .min(2, { key: 'org_name', values: 'The field is too short' })
      .max(255, { key: 'org_name', values: 'The field is too long' })
      .required({ key: 'org_name', values: 'Organization Name is required' }),
    street_address: Yup.string()
      .min(2, { key: 'street_address', values: 'The field is too short' })
      .required({
        key: 'street_address',
        values: 'Street Address is required',
      }),
    state: Yup.string()
      .min(2, { key: 'state', values: 'The field is too short' })
      .max(255, { key: 'state', values: 'The field is too long' })
      .required({ key: 'state', values: 'State is required' }),
    city: Yup.string()
      .min(2, { key: 'state', values: 'The field is too short' })
      .max(255, { key: 'state', values: 'The field is too long' })
      .required({ key: 'state', values: 'State is required' }),
    zip_code: Yup.string()
      .min(5, { key: 'zip_code', values: 'The field is too short' })
      .max(8, { key: 'zip_code', values: 'The field is too long' })
      .required({ key: 'zip_code', values: 'Zip Code is required' }),
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
    office_number: Yup.string()
      .typeError({ key: 'office_number', values: 'Mobile Number is required' })
      .required({ key: 'office_number', values: 'Mobile Number is required' })
      .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, {
        message: { key: 'office_number', values: 'Office Number is not valid' },
      }),
    office_email: Yup.string()
      .email({ key: 'office_email', values: 'Office Email is invalid' })
      .required({ key: 'office_email', values: 'Office Email is required' }),
    org_type: Yup.mixed()
      .required({ key: 'org_type', values: 'Organization Type is required' })
      .oneOf(Object.keys(getOrganizationTypes()), {
        key: 'org_type',
        values: 'Select Organization Type',
      }),
    // org_affiliation: Yup.mixed()
    //   .required({
    //     key: 'org_affiliation',
    //     values: 'Affiliated Organization is required',
    //   })
    //   .oneOf(formattedOrganizationList, {
    //     key: 'org_affiliation',
    //     values: 'Select Organization Affiliation',
    //   }),
    method_of_communication: Yup.mixed()
      .required({
        key: 'method_of_communication',
        values: 'Method of Communication is required',
      })
      .oneOf(Object.keys(getMethodOfCommunications()), {
        key: 'method_of_communication',
        values: 'Select Method of Communication',
      }),
    language_of_communication: Yup.mixed()
      .required({
        key: 'language_of_communication',
        values: 'Language of Communication is required',
      })
      .oneOf(Object.keys(getLanguagesOfCommunication()), {
        key: 'language_of_communication',
        values: 'Select Language of Communication',
      }),

    // partner
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
    org_position: Yup.string()
      .min(2, { key: 'org_position', values: 'The field is too short' })
      .max(255, { key: 'org_position', values: 'The field is too long' })
      .required({ key: 'org_position', values: 'Position is required' }),
    mobile_number: Yup.string()
      .typeError({ key: 'mobile_number', values: 'Mobile Number is required' })
      .required({ key: 'mobile_number', values: 'Mobile Number is required' })
      .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, {
        message: { key: 'mobile_number', values: 'Mobile Number is not valid' },
      }),
    email: Yup.string()
      .email({ key: 'email', values: 'Email is invalid' })
      .required({ key: 'email', values: 'Email is required' }),
    password: Yup.string()
      .required({
        key: 'password',
        values: 'Password is required',
      })
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: {
          key: 'password',
          values: 'Must Contain 8 Characters and at least One Number',
        },
      }),
    confirm_password: Yup.string()
      .required({
        key: 'confirm_password',
        values: 'Confirm Password is required',
      })
      .oneOf([Yup.ref('password'), null], {
        key: 'password',
        values: 'Password must match',
      }),
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
}

export const validateOrganizationForm = async (enteredData) => {
  return await OrganizationFormSchema().then((response) => {
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
