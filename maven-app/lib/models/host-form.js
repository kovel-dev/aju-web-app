import axios from 'axios'

class HostForm {
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
    }
  }

  save = async () => {
    return await axios
      .post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/host-request/create`,
        this.getValues()
      )
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }
}

export default HostForm
