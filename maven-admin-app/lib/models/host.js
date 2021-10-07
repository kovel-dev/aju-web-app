import axios from 'axios'
import { server } from '../config/server'
import { validateHostForm } from '../validations/host-validations'

class Host {
  constructor(data) {
    this.name = data.name || ''
    this.description = data.description || ''
    this.category = data.category || ''
    this.role = data.role || ''
    this.profile_image_url = data.profile_image_url || ''
    this.meta_data = data.meta_data || ''
    this.status = data.status || 'active'
    this.job = data.job || ''
    this.is_featured = data.is_featured || false
    this.deleted_at = data.deleted_at || ''
    this.created_at = data.created_at || ''
    this.created_by = data.created_by || ''
    this.updated_at = data.updated_at || ''
    this.updated_by = data.updated_by || ''
  }

  getValues = () => {
    return {
      name: this.name || '',
      description: this.description || '',
      category: this.category || '',
      role: this.role || '',
      profile_image_url: this.profile_image_url || '',
      meta_data: this.meta_data || '',
      status: this.status || '',
      job: this.job || '',
      is_featured: this.is_featured || '',
      deleted_at: this.deleted_at || '',
      created_at: this.created_at || '',
      created_by: this.created_by || '',
      updated_at: this.updated_at || '',
      updated_by: this.updated_by || '',
    }
  }

  getStatuses = () => {
    return {
      active: 'Active',
      inactive: 'Inactive',
    }
  }

  validate = async () => {
    return await validateHostForm(this.getValues())
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
      .post(`${server}/api/hosts/create`, this.getValues())
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
      .post(`${server}/api/hosts/${refNumber}/update`, this.getValues())
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  activate = async (refNumber) => {
    return await axios
      .post(`${server}/api/hosts/${refNumber}/activate`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  deactivate = async (refNumber) => {
    return await axios
      .post(`${server}/api/hosts/${refNumber}/deactivate`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  getList = async (pageNumber, limit) => {
    return await axios
      .get(`${server}/api/hosts/list?page=${pageNumber}&limit=${limit}`)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const questions = []

        for (const key in data) {
          const question = {
            id: key,
            name: data[key][0],
            status: data[key][1].toUpperCase(),
            ref: data[key][2]['@ref']['id'],
          }

          questions.push(question)
        }

        return {
          data: questions,
          count: count,
        }
      })
      .catch(function (error) {
        throw error
      })
  }

  getHostByRef = async (refNumber) => {
    return await axios
      .post(`${server}/api/hosts/get-host-by-ref`, { ref: refNumber })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  static getHostsForSelect = async () => {
    return await axios
      .get(`${server}/api/hosts/get-all-hosts`)
      .then((response) => {
        const data = response.data
        const questions = []

        for (const key in data) {
          if (data[key][6] == 'active') {
            const question = {
              label: data[key][0],
              value: data[key][8]['@ref']['id'],
            }

            questions.push(question)
          }
        }

        return {
          data: questions,
        }
      })
      .catch(function (error) {
        throw error
      })
  }

  static checkNameUniqueness = async (name) => {
    return await axios
      .post(`${server}/api/hosts/check-name`, { name: name })
      .then((response) => {
        return response.data
      })
      .catch(function (error) {
        throw error
      })
  }

  static getSchema(isEdit) {
    return [
      {
        type: 'heading',
        title: 'Host Information',
        subHeading: 'This information will be used to create host.',
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
        type: 'richtexteditor',
        label: 'Description',
        id: 'description',
        name: 'description',
        isRequired: true,
        width: 1,
      },
      {
        type: 'textbox',
        label: 'Job',
        id: 'job',
        name: 'job',
        isRequired: true,
        width: 1,
      },
      {
        type: 'select',
        label: 'Category',
        id: 'category',
        name: 'category',
        isRequired: false,
        options: [
          { key: 'hebrew', value: 'Hebrew' },
          { key: 'current-affairs', value: 'Current Affairs' },
          { key: 'jewish-thought', value: 'Jewish Thought' },
          { key: 'literature', value: 'Literature' },
          { key: 'art-and-art-history', value: 'Art and Art history' },
          { key: 'culture-and-media', value: 'Culture and Media' },
        ],
      },
      // {
      //   type: 'select',
      //   label: 'Role',
      //   id: 'role',
      //   name: 'role',
      //   isRequired: false,
      //   options: [
      //     { key: 'host', value: 'Host' },
      //     { key: 'guest', value: 'Guest' },
      //     { key: 'instructor', value: 'Instructor' },
      //     { key: 'speakers bureau', value: 'Speakers Bureau' },
      //   ],
      // },
      {
        type: 'file',
        label: 'Profile Image',
        id: 'profile_image_url',
        name: 'profile_image_url',
        isRequired: false,
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
        type: 'form-action-buttons',
        submitLabel: isEdit ? 'Edit Host' : 'Create Host',
      },
    ]
  }
}

export default Host
