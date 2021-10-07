import axios from 'axios'
import { validateResetPasswordForm } from 'lib/validations/forgot-password-validations'

class ResetPassword {
  constructor(data) {
    this.confirm_password = data.confirm_password || ''
    this.password = data.password || ''
    this.token = data.token || ''
  }

  getValues = () => {
    return {
      confirm_password: this.confirm_password,
      password: this.password,
      token: this.token,
    }
  }

  validate = async () => {
    return await validateResetPasswordForm(this.getValues())
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }

  reset = async () => {
    await this.validate()

    return await axios
      .post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/reset-password/reset`,
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

export default ResetPassword
