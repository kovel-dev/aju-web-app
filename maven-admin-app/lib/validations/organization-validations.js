import * as Yup from 'yup'

const OrganizationSchema = () => {
  let yupObj = {
    name: Yup.string()
      .min(2, { key: 'name', values: 'The field is too short' })
      .max(255, { key: 'name', values: 'The field is too long' })
      .required({ key: 'name', values: 'Name is required' }),
    // owner_id: Yup.string()
    // .min(2, { key: "owner_id", values: "The field is too short" })
    // .max(255, { key: "owner_id", values: "The field is too long" })
    // .required({ key: "owner_id", values: "Owner Id is required" }),
    street_address: Yup.string().required({
      key: 'street_address',
      values: 'Street address is required',
    }),
    office_number: Yup.string()
      .typeError({ key: 'office_number', values: 'Mobile Number is required' })
      .required({ key: 'office_number', values: 'Mobile Number is required' })
      .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, {
        message: { key: 'office_number', values: 'Office Number is not valid' },
      }),
    office_email: Yup.string()
      .email({ key: 'office_email', values: 'Email is invalid' })
      .required({ key: 'office_email', values: 'Office Email is required' }),
    is_featured: Yup.mixed().required({
      key: 'is_featured',
      values: 'Is Featured is required',
    }),
  }

  return Yup.object().shape(yupObj)
}

export const validateOrganizationForm = async (enteredData) => {
  return await OrganizationSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
