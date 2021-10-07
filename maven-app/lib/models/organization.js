import axios from 'axios'
import { server } from '../config/server'
import { validateOrganizationForm } from '../validations/organization-validations'

class Organization {
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

  constructor(data) {
    this.org_name = data.org_name
    this.street_address = data.street_address
    this.state = data.state
    this.city = data.city
    this.zip_code = data.zip_code
    this.country = data.country
    this.timezone = data.timezone
    this.office_number = data.office_number
    this.office_email = data.office_email
    this.org_type = data.org_type
    this.org_affiliation = data.org_affiliation
    this.method_of_communication = data.method_of_communication
    this.language_of_communication = data.language_of_communication
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
    }
  }

  getStatuses = () => {
    return {
      active: 'Active',
      inactive: 'Inactive',
    }
  }

  getIsFeaturedStatus = () => {
    return [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ]
  }

  validate = async () => {
    return await validateOrganizationForm(this.getValues())
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
      .post(`${server}/api/organizations/create`, this.getValues())
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  update = async (refNumber) => {
    await this.validate()

    return await axios
      .post(`${server}/api/organizations/${refNumber}/update`, this.getValues())
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  activate = async (refNumber) => {
    return await axios
      .post(`${server}/api/organizations/${refNumber}/activate`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  deactivate = async (refNumber) => {
    return await axios
      .post(`${server}/api/organizations/${refNumber}/deactivate`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  getList = async (pageNumber, limit) => {
    return await axios
      .get(`${server}/api/organizations/list?page=${pageNumber}&limit=${limit}`)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const organizations = []

        for (const key in data) {
          const org = {
            id: key,
            name: data[key][0],
            is_featured: data[key][1] ? 'Yes' : 'No',
            status: data[key][2].toUpperCase(),
            ref: data[key][3]['@ref']['id'],
          }

          organizations.push(org)
        }

        return {
          data: organizations,
          count: count,
        }
      })
      .catch(function (error) {
        throw error
      })
  }

  getOrganizationByRef = async (refNumber) => {
    return await axios
      .post(`${server}/api/organizations/get-organization-by-ref`, {
        ref: refNumber,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  getOrganizationForSelect = async (pageNumber, limit, hasOther = true) => {
    return await axios
      .get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/organizations/list?page=${pageNumber}&limit=${limit}`
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

        if (organizations.length > 0) {
          organizations.sort((a, b) => a.value.localeCompare(b.value))
        }

        return organizations
      })
      .catch(function (error) {
        throw error
      })
  }
}

export default Organization
