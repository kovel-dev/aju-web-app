import { validateSuggestionForm } from '../validations/frontend/suggestion-form-validation'

class Suggestion {
  constructor(data) {
    this.name = data.name || ''
    this.contact_email = data.contact_email || ''
    this.phone = data.phone || ''
    this.prefer_phone = data.prefer_phone || ''
    this.type = data.type || ''
    this.details = data.details || ''
    this.status = data.status || 'open' // (open, in-progress, completed)
    this.deleted_at = data.deleted_at || ''
    this.created_at = data.created_at || ''
    this.created_by = data.created_by || ''
    this.updated_at = data.updated_at || ''
    this.updated_by = data.updated_by || ''
  }

  getValues = () => {
    return {
      name: this.name,
      contact_email: this.contact_email,
      phone: this.phone,
      prefer_phone: this.prefer_phone,
      type: this.type,
      details: this.details,
      status: this.status,
      deleted_at: this.deleted_at,
      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
    }
  }

  getStatus = () => {
    return {
      open: 'Open',
      'in-progress': 'In Progress',
      completed: 'Completed',
    }
  }

  getTypes = () => {
    return {
      topic: 'Suggest topic for a program',
      speaker: 'Suggest speaker for a program',
      'topic-speaker': 'Suggest a topic and speaker for a program',
    }
  }

  validateFESuggestionForm = async () => {
    return await validateSuggestionForm(this.getValues())
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }
}

export default Suggestion
