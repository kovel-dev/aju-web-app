import axios from 'axios'
import { server } from '../../config/server'
import { validateOrganizationForm } from '../../validations/frontend/org-registration-form-validations'

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
  }

  getValues = () => {
    return {
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
  }

  validateFEOrganizationForm = async () => {
    return await validateOrganizationForm(this.getValues())
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }

  getOrganizationForSelect = async (pageNumber, limit, hasOther = true) => {
    return await axios
      .get(
        `${server}/api/frontend/organizations/list?page=${pageNumber}&limit=${limit}`
      )
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const organizations = []

        for (const key in data) {
          if (data[key][2] == 'active') {
            const org = {
              key: data[key][3]['@ref']['id'],
              value: data[key][0],
            }

            organizations.push(org)
          }
        }

        if (hasOther) {
          organizations.push({
            key: 'other',
            value: 'Other',
          })
        }

        return organizations
      })
      .catch(function (error) {
        throw error
      })
  }
}

export default OrganizationForm
