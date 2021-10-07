import { validateNewsletterForm } from '../validations/frontend/newsletter-form-validation'

class Newsletter {
  first_name
  last_name
  email
  consent
  url

  created_by = ''
  created_at = ''
  updated_by = ''
  updated_at = ''
  deleted_by = ''
  deleted_at = ''

  constructor(data) {
    this.first_name = data.first_name || ''
    this.last_name = data.last_name || ''
    this.email = data.email || ''
    this.consent = data.consent || ''
    this.url = data.url || ''

    this.created_by = data.created_by ? data.created_by : ''
    this.created_at = data.created_at ? data.created_at : ''
    this.updated_by = data.updated_by ? data.updated_by : ''
    this.updated_at = data.updated_at ? data.updated_at : ''
    this.deleted_by = data.deleted_by ? data.deleted_by : ''
    this.deleted_at = data.deleted_at ? data.deleted_at : ''
  }

  getValues = () => {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      consent: this.consent,
      url: this.url,

      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
      deleted_by: this.deleted_by,
      deleted_at: this.deleted_at,
    }
  }

  validateFENewsletterForm = async () => {
    return await validateNewsletterForm(this.getValues())
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }
}

export default Newsletter
