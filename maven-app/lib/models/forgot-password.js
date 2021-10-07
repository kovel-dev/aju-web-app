import axios from 'axios'
import { validateForgotPasswordForm } from 'lib/validations/forgot-password-validations'

class ForgotPassword {
  constructor(data) {
    this.email = data.email || ''
  }

  getValues = () => {
    return {
      email: this.email,
    }
  }

  validate = async () => {
    return await validateForgotPasswordForm(this.getValues())
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }

  save = async () => {
    await this.validate()

    return await axios
      .post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/forgot-password/create`,
        this.getValues()
      )
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }
}

export default ForgotPassword
