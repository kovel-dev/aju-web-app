import axios from 'axios'
import { server } from '../config/server'
import { validateQuestionForm } from '../validations/question-validations'

class Question {
  constructor(data) {
    this.label = data.label || ''
    this.type = data.type || ''
    this.options = data.options || ''
    this.status = data.status || 'active'
    this.isRequired = data.isRequired || 'no'
    this.deleted_at = data.deleted_at || ''
    this.created_at = data.created_at || ''
    this.created_by = data.created_by || ''
    this.updated_at = data.updated_at || ''
    this.updated_by = data.updated_by || ''
  }

  getValues = () => {
    return {
      label: this.label,
      type: this.type,
      options: this.options,
      status: this.status,
      isRequired: this.isRequired,
      deleted_at: this.deleted_at,
      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
    }
  }

  getTypes = () => {
    return {
      text: 'Text',
      textarea: 'Textarea',
      select: 'Select',
    }
  }

  getStatuses = () => {
    return {
      active: 'Active',
      inactive: 'Inactive',
    }
  }

  validate = async () => {
    return await validateQuestionForm(this.getValues())
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
      .post(`${server}/api/questions/create`, this.getValues())
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
      .post(`${server}/api/questions/${refNumber}/update`, this.getValues())
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  activate = async (refNumber) => {
    return await axios
      .post(`${server}/api/questions/${refNumber}/activate`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  deactivate = async (refNumber) => {
    return await axios
      .post(`${server}/api/questions/${refNumber}/deactivate`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  getList = async (pageNumber, limit) => {
    return await axios
      .get(`${server}/api/questions/list?page=${pageNumber}&limit=${limit}`)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const questions = []

        for (const key in data) {
          const question = {
            id: key,
            label: data[key][0],
            type: data[key][1].toUpperCase(),
            options: data[key][2].toUpperCase(),
            status: data[key][3].toUpperCase(),
            ref: data[key][4]['@ref']['id'],
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

  getQuestionByRef = async (refNumber) => {
    return await axios
      .post(`${server}/api/questions/get-question-by-ref`, { ref: refNumber })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  static getQuestionsForSelect = async () => {
    return await axios
      .get(`${server}/api/questions/get-all-questions`)
      .then((response) => {
        const data = response.data
        const questions = []

        for (const key in data) {
          if (data[key][3] == 'active') {
            const question = {
              label: data[key][0],
              value: data[key][4]['@ref']['id'],
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

  static getSchema(isEdit) {
    return [
      {
        type: 'heading',
        title: 'Question Information',
        subHeading: 'This information will be used to create question.',
      },
      {
        type: 'textbox',
        label: 'Label',
        id: 'label',
        name: 'label',
        isRequired: true,
        width: 1,
      },
      {
        type: 'select',
        label: 'type',
        id: 'type',
        name: 'type',
        isRequired: true,
        options: [
          { key: 'text', value: 'Text' },
          { key: 'textarea', value: 'Textarea' },
          { key: 'select', value: 'Select' },
        ],
      },
      {
        type: 'textbox',
        label: 'options',
        id: 'options',
        name: 'options',
        isRequired: false,
        width: 1,
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
        type: 'select',
        label: 'Is Required',
        id: 'isRequired',
        name: 'isRequired',
        isRequired: true,
        options: [
          { key: 'yes', value: 'Yes' },
          { key: 'no', value: 'No' },
        ],
      },
      {
        type: 'form-action-buttons',
        submitLabel: isEdit ? 'Edit Question' : 'Create Question',
      },
    ]
  }
}

export default Question
