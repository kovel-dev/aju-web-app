import axios from 'axios'
import { server } from 'lib/config/server'

class PartnerRequest {
  constructor(data) {
    this.add_on = data.add_on || ''
    this.name = data.name || ''
    this.seats_reserved = data.seats_reserved || ''
    this.details = data.details || ''
    this.organization = data.organization || ''
    this.phone = data.phone || ''
    this.contact_email = data.contact_email || ''
    this.prefer_phone = data.prefer_phone || ''
    this.link = data.link || ''
    this.event_name = data.event_name || ''
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
      link: this.link,
      event_name: this.event_name,
    }
  }

  save = async () => {
    return await axios
      .post(`${server}/api/partner/create-request`, this.getValues())
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  }
}

export default PartnerRequest
