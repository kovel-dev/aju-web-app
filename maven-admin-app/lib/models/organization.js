import axios from 'axios'
import { server } from '../config/server'
import { validateOrganizationForm } from '../validations/organization-validations'
import { getOrganizationTypes } from '../handlers/dropdown-helpers'
import { formatOptions } from '../handlers/helper-handlers'

class Organization {
  constructor(data) {
    this.owner_id = data.owner_id || ''
    this.name = data.name || data.org_name || ''
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
    this.is_featured = data.is_featured || { value: false, label: 'No' }
    this.status = data.status || 'active' // pending, active, inactive
    this.deleted_at = data.deleted_at || ''
    this.created_at = data.created_at || ''
    this.created_by = data.created_by || ''
    this.updated_at = data.updated_at || ''
    this.updated_by = data.updated_by || ''
  }

  getValues = () => {
    return {
      owner_id: this.owner_id,
      name: this.name,
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
      is_featured: this.is_featured,
      status: this.status,
      deleted_at: this.deleted_at,
      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
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

  static getOrganizationsForSelect = async (currentTagRef = null) => {
    return await axios
      .get(`${server}/api/organizations/get-all-organizations`)
      .then((response) => {
        const data = response.data
        const organizations = []

        for (const key in data) {
          if (
            data[key][2] == 'active' &&
            currentTagRef !== data[key][3]['@ref']['id']
          ) {
            const organization = {
              label: data[key][0],
              value: data[key][3]['@ref']['id'],
            }

            organizations.push(organization)
          }
        }

        organizations.push({
          label: 'Other',
          value: 'other',
        })

        return {
          data: organizations,
        }
      })
      .catch(function (error) {
        throw error
      })
  }

  static getOrganizationsWithNoOwnershipForSelect = async () => {
    return await axios
      .get(`${server}/api/organizations/get-non-owned-organizations`)
      .then((response) => {
        const data = response.data
        const organizations = []

        for (let index = 0; index < data.length; index++) {
          const organization = data[index]

          organizations.push({
            label: organization['name'],
            value: organization['ref'],
          })
        }

        return {
          data: organizations,
        }
      })
      .catch(function (error) {
        throw error
      })
  }

  static getOrganizationByOwnerId = async (refNumber) => {
    return await axios
      .post(`${server}/api/organizations/get-organizations-by-owner-id`, {
        ref: refNumber,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  static getSchema(isEdit) {
    return [
      {
        type: 'heading',
        title: 'Organization Information',
      },
      {
        type: 'textbox',
        label: 'Name',
        id: 'name',
        name: 'name',
        isRequired: true,
        width: 1,
      },
      {
        type: 'textbox',
        label: 'Street Address',
        id: 'street_address',
        name: 'street_address',
        isRequired: true,
        width: 1,
      },
      {
        type: 'textbox',
        label: 'Office Number',
        id: 'office_number',
        name: 'office_number',
        isRequired: true,
        width: 1,
      },
      {
        type: 'textbox',
        label: 'Office Email',
        id: 'office_email',
        name: 'office_email',
        isRequired: true,
        width: 1,
      },
      {
        type: 'select',
        label: 'Featured',
        id: 'is_featured',
        name: 'is_featured',
        isRequired: true,
        options: [
          { key: 'yes', value: 'Yes' },
          { key: 'no', value: 'No' },
        ],
      },
      {
        type: 'select',
        label: 'Type',
        id: 'org_type',
        name: 'org_type',
        isRequired: true,
        options: formatOptions(getOrganizationTypes()),
      },
      {
        type: 'select',
        label: 'Status',
        id: 'status',
        name: 'status',
        isRequired: true,
        options: [
          { key: 'active', value: 'Active' },
          { key: 'inactive', value: 'Inactive' },
        ],
      },
      {
        type: 'heading',
        title: 'Owner',
        subHeading:
          'Note: Changing the user will remove ownership from their existing linked organization',
      },
      {
        type: 'select',
        subType: 'owners',
        label: 'Owner',
        id: 'owner_id',
        name: 'owner_id',
        isRequired: false,
        options: [],
      },
      {
        type: 'form-action-buttons',
        submitLabel: isEdit ? 'Edit Organization' : 'Create Organization',
      },
    ]
  }
}

export default Organization
