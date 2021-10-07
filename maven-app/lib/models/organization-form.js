import axios from 'axios'
import { server } from '../config/server'
import { validateOrganizationForm } from '../validations/organization-form-validations'

class OrganizationForm {
  // organization info
  org_name
  street_address
  state
  city
  zip_code
  country
  timezone
  office_number
  office_email
  org_type
  org_affiliation
  org_affiliation_name
  method_of_communication
  language_of_communication

  // partner
  title
  first_name
  last_name
  pronoun
  org_position
  mobile_number
  email
  password
  confirm_password
  old_password
  status
  role
  heard_about
  is_subscribe
  accepted_term_and_conditions

  constructor(data) {
    this.org_name = data.org_name || ''
    this.street_address = data.street_address || ''
    this.state = data.state || ''
    this.city = data.city || ''
    this.zip_code = data.zip_code || ''
    this.country = data.country || ''
    this.timezone = data.timezone || ''
    this.office_number = data.office_number || ''
    this.office_email = data.office_email || ''
    this.org_type = data.org_type || ''
    this.org_affiliation = data.org_affiliation || ''
    this.org_affiliation_name = data.org_affiliation_name || ''
    this.method_of_communication = data.method_of_communication || ''
    this.language_of_communication = data.language_of_communication || ''

    this.title = data.title || ''
    this.first_name = data.first_name || ''
    this.last_name = data.last_name || ''
    this.pronoun = data.pronoun || ''
    this.org_position = data.org_position || ''
    this.mobile_number = data.mobile_number || ''
    this.email = data.email || ''
    this.password = data.password || ''
    this.confirm_password = data.confirm_password || ''
    this.status = data.status || ''
    this.role = data.role || ''
    this.heard_about = data.heard_about || ''
    this.is_subscribe = data.is_subscribe || ''
    this.accepted_term_and_conditions = data.accepted_term_and_conditions || ''

    // edit form fields
    this.old_password = data.old_password || ''
  }

  getValues = (isUpdatePage = false) => {
    let formData = {
      org_name: this.org_name,
      street_address: this.street_address,
      state: this.state,
      city: this.city,
      zip_code: this.zip_code,
      country: this.country,
      timezone: this.timezone,
      office_number: this.office_number,
      office_email: this.office_email,
      org_type: this.org_type,
      org_affiliation: this.org_affiliation,
      org_affiliation_name: this.org_affiliation_name,
      method_of_communication: this.method_of_communication,
      language_of_communication: this.language_of_communication,

      title: this.title,
      first_name: this.first_name,
      last_name: this.last_name,
      pronoun: this.pronoun,
      org_position: this.org_position,
      mobile_number: this.mobile_number,
      email: this.email,
      password: this.password,
      confirm_password: this.confirm_password,
      status: this.status,
      role: this.role,
      heard_about: this.heard_about,
      is_subscribe: this.is_subscribe,
      accepted_term_and_conditions: this.accepted_term_and_conditions,
    }

    if (isUpdatePage) {
      formData['old_password'] = this.old_password
    }

    return formData
  }

  validate = async (isUpdatePage = false) => {
    return await validateOrganizationForm(
      this.getValues(isUpdatePage),
      isUpdatePage
    )
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        console.log(error)
        throw error
      })
  }

  save = async () => {
    await this.validate()

    return await axios
      .post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/organizations/create`,
        this.getValues()
      )
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  update = async (refId, apiToken) => {
    await this.validate()

    console.log(this.getValues(true))

    return await axios
      .post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/organizations/${refId}/update`,
        this.getValues(true),
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      )
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  getPartnerProfile = async (refId, apiToken) => {
    return await axios
      .post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/organizations/get-user-by-ref`,
        { ref: refId },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      )
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.log(error)
        throw error.response.data
      })
  }
}

export default OrganizationForm
