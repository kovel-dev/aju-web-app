import axios from 'axios'
import { validateNewsletterForm } from '../validations/newsletter-validations'

class Newsletter {
  first_name
  last_name
  email
  consent
  url

  constructor(data) {
    this.first_name = data.first_name || ''
    this.last_name = data.last_name || ''
    this.email = data.email || ''
    this.consent = data.consent || ''
    this.url = data.url || ''
  }

  getValues = () => {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      consent: this.consent,
      url: this.url,
    }
  }

  hasValues = () => {
    let hasValues = false
    const modelData = this.getValues()
    for (var key in modelData) {
      if (modelData[key].length > 0) {
        hasValues = true
      }
    }

    return hasValues
  }

  getDirtyFields = (dirtyFieldsState) => {
    const modelData = this.getValues()

    for (let key in modelData) {
      let value = modelData[key]
      if (value.length > 0 && dirtyFieldsState.indexOf(key) == -1) {
        dirtyFieldsState.push(key)
      }
    }

    return dirtyFieldsState
  }

  validate = async () => {
    return await validateNewsletterForm(this.getValues())
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
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/newsletter/create`,
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

export default Newsletter
