import axios from 'axios'
import { server } from 'lib/config/server'

class Suggestion {
  constructor(data) {
    this.name = data.name || ''
    this.contact_email = data.contact_email || ''
    this.phone = data.phone || ''
    this.prefer_phone = data.prefer_phone || ''
    this.type = data.type || ''
    this.details = data.details || ''
  }

  getValues = () => {
    return {
      name: this.name,
      contact_email: this.contact_email,
      phone: this.phone,
      prefer_phone: this.prefer_phone,
      type: this.type,
      details: this.details,
    }
  }

  save = async () => {
    return await axios
      .post(`${server}/api/suggestion/create`, this.getValues())
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  }
}

export default Suggestion
