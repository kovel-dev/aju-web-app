import * as Yup from 'yup'
import PromoCode from '../models/promo-code'

// @ref: https://stackoverflow.com/questions/2227370/currency-validation
const priceRegex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/

const PromoCodeSchema = () => {
  let promoCode = new PromoCode({})

  let yupObj = {
    name: Yup.string()
      .min(2, { key: 'name', values: 'The field is too short' })
      .max(255, { key: 'name', values: 'The field is too long' })
      .required({ key: 'name', values: 'Name is required' }),
    code: Yup.string()
      .min(5, { key: 'code', values: 'The field is too short' })
      .max(255, { key: 'code', values: 'The field is too long' })
      .required({ key: 'code', values: 'Code is required' }),
    description: Yup.string()
      .min(2, { key: 'description', values: 'The field is too short' })
      .required({ key: 'description', values: 'Description is required' }),
    status: Yup.mixed()
      .required({ key: 'status', values: 'Status is required' })
      .oneOf(Object.keys(promoCode.getStatuses()), {
        key: 'status',
        values: 'Select status',
      }),
    percentage: Yup.string()
      .typeError({ key: 'percentage', values: 'Percentage is required' })
      .required({ key: 'percentage', values: 'Percentage is required' })
      .matches(priceRegex, {
        message: { key: 'percentage', values: 'Percentage is not valid' },
      }),
    use_limit: Yup.number()
      .typeError({ key: 'use_limit', values: 'Use Limit is not valid' })
      .required({ key: 'use_limit', values: 'Use Limit is required' })
      .positive({
        key: 'use_limit',
        values: 'Use Limit should be positive number',
      })
      .integer({ key: 'use_limit', values: 'Use Limit should be number' }),
  }

  return Yup.object().shape(yupObj)
}

export const validatePromoCodeForm = async (enteredData) => {
  return await PromoCodeSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
