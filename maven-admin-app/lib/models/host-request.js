import { validateHostReqForm } from '../validations/frontend/host-req-validations'

class HostRequest {
  constructor(data) {
    this.name = data.name || ''
    this.title = data.title || ''
    this.organization = data.organization || ''
    this.phone = data.phone || ''
    this.contact_email = data.contact_email || ''
    this.prefer_phone = data.prefer_phone || ''
    this.date = data.date || ''
    this.type = data.type || ''
    this.location = data.location || ''
    this.speaker_meta = data.speaker_meta || ''
    this.deleted_at = data.deleted_at || ''
    this.created_at = data.created_at || ''
    this.created_by = data.created_by || ''
    this.updated_at = data.updated_at || ''
    this.updated_by = data.updated_by || ''
  }

  getValues = () => {
    return {
      name: this.name,
      title: this.title,
      organization: this.organization,
      phone: this.phone,
      contact_email: this.contact_email,
      prefer_phone: this.prefer_phone,
      date: this.date,
      type: this.type,
      location: this.location,
      speaker_meta: this.speaker_meta,
      deleted_at: this.deleted_at,
      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
    }
  }

  validateFEHostRequestForm = async () => {
    return await validateHostReqForm(this.getValues())
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }
}

export default HostRequest
