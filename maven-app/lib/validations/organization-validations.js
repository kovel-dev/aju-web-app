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
