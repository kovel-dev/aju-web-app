import { validatePartnerReqForm } from '../validations/frontend/partner-req-validation'

class PartnerRequest {
  constructor(data) {
    this.add_on = data.add_on || ''
    this.name = data.name || ''
    this.seats_reserved = data.seats_reserved || ''
    this.details = data.details || ''
    this.organization = data.organization || ''
    this.phone = data.phone || ''
    this.contact_email = data.contact_email || ''
    this.prefer_phone = data.prefer_phone || false
    this.status = data.status || 'open' // (open, in-progress, completed)
    this.link = data.link || ''
    this.event_name = data.event_name || ''
    this.deleted_at = data.deleted_at || ''
    this.created_at = data.created_at || ''
    this.created_by = data.created_by || ''
    this.updated_at = data.updated_at || ''
    this.updated_by = data.updated_by || ''
  }

  getValues = () => {
    return {
      add_on: this.add_on,
      name: this.name,
      seats_reserved: this.seats_reserved,
      details: this.details,
      organization: this.organization,
      phone: this.phone,
      contact_email: this.contact_email,
      prefer_phone: this.prefer_phone,
      status: this.status,
      link: this.link,
      event_name: this.event_name,
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

  getAddOnTypes = () => {
    return {
      'buy-class-event': 'Buy entire class or event',
      'reserve-seats': 'Buy entire class or event',
      'customize-program': 'Work with our team to design customized program',
    }
  }

  validateFEPartnerRequestForm = async () => {
    return await validatePartnerReqForm(this.getValues())
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }
}

export default PartnerRequest
