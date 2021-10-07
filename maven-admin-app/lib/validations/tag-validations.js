import * as Yup from 'yup'
import Tag from '../models/tag'

const TagSchema = () => {
  let tag = new Tag({})

  let yupObj = {
    name: Yup.string()
      .min(2, { key: 'name', values: 'The field is too short' })
      .max(255, { key: 'name', values: 'The field is too long' })
      .required({ key: 'name', values: 'Name is required' }),
    is_featured: Yup.mixed().required({
      key: 'is_featured',
      values: 'Is Featured is required',
    }),
  }

  return Yup.object().shape(yupObj)
}

export const validateTagForm = async (enteredData) => {
  return await TagSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
