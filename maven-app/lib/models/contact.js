import axios from 'axios'

class Contact {
  constructor(data) {
    this.name = data.name || ''
    this.email = data.email || ''
    this.mobile_number = data.mobile_number || ''
    this.method_of_contact_phone =
      data.method_of_contact_phone == 'yes' ? 'yes' : 'no'
    this.message = data.message || ''
  }

  getValues = () => {
    return {
      name: this.name,
      email: this.email,
      mobile_number: this.mobile_number,
      method_of_contact_phone: this.method_of_contact_phone,
      message: this.message,
    }
  }

  save = async () => {
    return await axios
      .post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/contact-us/create`,
        this.getValues()
      )
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  // needed schema for alissa's form process
  static getSchema = () => {
    return {
      name: { value: '', error: 'Name field is required.' },
      phone: { value: '', error: '' },
      contact_email: { value: '', error: 'Email field is required.' },
      prefer_phone: { value: false, error: '' },
      message: { value: '', error: 'Message field is required.' },
    }
  }
}

export default Contact
