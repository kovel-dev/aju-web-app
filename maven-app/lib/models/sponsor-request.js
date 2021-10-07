import axios from 'axios'

class SponsorRequest {
  constructor(data) {
    this.name = data.name || ''
    this.email = data.email || ''
    this.mobile_number = data.mobile_number || ''
    this.method_of_contact_phone = data.method_of_contact_phone || ''
    this.tier = data.tier || ''
    this.details = data.details || ''
  }

  getValues = () => {
    return {
      name: this.name,
      email: this.email,
      mobile_number: this.mobile_number,
      method_of_contact_phone: this.method_of_contact_phone,
      tier: this.tier,
      details: this.details,
    }
  }

  save = async () => {
    return await axios
      .post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/sponsor-request/create`,
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

export default SponsorRequest
