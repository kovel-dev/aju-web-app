import axios from 'axios'
import { server } from '../config/server'
import { validateSponsorReqForm } from '../validations/frontend/sponsor-req-validations'

class SponsorRequest {
  constructor(data) {
    this.name = data.name || ''
    this.email = data.email || ''
    ;(this.mobile_number = data.mobile_number || ''),
      (this.method_of_contact_phone = data.method_of_contact_phone || ''),
      (this.tier = data.tier || ''),
      (this.details = data.details || ''),
      (this.deleted_at = data.deleted_at || '')
    this.created_at = data.created_at || ''
    this.created_by = data.created_by || ''
    this.updated_at = data.updated_at || ''
    this.updated_by = data.updated_by || ''
  }

  getValues = () => {
    return {
      name: this.name,
      email: this.email,
      mobile_number: this.mobile_number,
      method_of_contact_phone: this.method_of_contact_phone,
      tier: this.tier,
      details: this.details,
      deleted_at: this.deleted_at,
      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
    }
  }

  validateFESponsorReqForm = async () => {
    return await validateSponsorReqForm(this.getValues())
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }

  getContactUsByRef = async (refNumber) => {
    return await axios
      .post(`${server}/api/contact-us/get-contact-us-by-ref`, {
        ref: refNumber,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }
}

export default SponsorRequest
