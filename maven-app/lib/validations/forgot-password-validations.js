import * as Yup from 'yup'

const ForgotPasswordSchema = () => {
  let yupObj = {
    email: Yup.string()
      .email({ key: 'email', values: 'Email is invalid' })
      .required({ key: 'email', values: 'Email is required' }),
  }

  return Yup.object().shape(yupObj)
}

const ResetPasswordSchema = () => {
  let yupObj = {
    token: Yup.string().required({ key: 'token', values: 'Token is required' }),
    password: Yup.string().required({
      key: 'password',
      values: 'Password is required',
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
  }

  return Yup.object().shape(yupObj)
}

export const validateForgotPasswordForm = async (enteredData) => {
  return await ForgotPasswordSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}

export const validateResetPasswordForm = async (enteredData) => {
  return await ResetPasswordSchema()
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
