import axios from 'axios'
import { server } from 'lib/config/server'
import { validateUserForm } from '../validations/user-validations'

class User {
  constructor(data) {
    this.first_name = data.first_name || ''
    this.last_name = data.last_name || ''
    this.email = data.email || ''
    this.password = data.password || ''
    this.status = data.status || ''
    this.role = data.role || ''
    this.timezone = data.timezone || ''
    this.is_verified = data.is_verified || false
    this.verification_date = data.verification_date || ''
    this.verification_token = data.verification_token || ''
    this.verification_email_status = data.verification_email_status || 'pending'
    this.affiliation_id = data.affiliation_id || ''
    this.affiliation_name = data.affiliation_name || ''
    this.last_login_dt = data.last_login_dt || ''
    this.cart_meta = data.cart_meta || ''
    this.card_meta = data.card_meta || ''
    // registration form fields
    this.title = data.title || ''
    this.pronoun = data.pronoun || ''
    ;(this.confirm_password = data.confirm_password || ''),
      (this.affiliation_other = data.affiliation_other || '')
    this.state = data.state || ''
    this.city = data.city || ''
    this.zipcode = data.zipcode || ''
    this.country = data.country || ''
    this.mobile_number = data.mobile_number || ''
    this.communication_method = data.communication_method || ''
    this.communication_language = data.communication_language || ''
    this.heard_about = data.heard_about || ''
    this.is_subscribe = data.is_subscribe || false
    this.accepted_term_and_conditions =
      data.accepted_term_and_conditions || false
    // edit form fields
    this.old_password = data.old_password || ''
    this.organization = data.organization || ''

    this.deleted_at = data.deleted_at || ''
    this.created_by = data.created_by || ''
    this.created_at = data.created_at || ''
    this.updated_by = data.updated_by || ''
    this.updated_at = data.updated_at || ''
  }

  getValues = (isUpdatePage = false) => {
    let userData = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password,
      confirm_password: this.confirm_password,
      status: this.status,
      role: this.role,
      timezone: this.timezone,
      is_verified: this.is_verified,
      verification_date: this.verification_date,
      verification_token: this.verification_token,
      verification_email_status: this.verification_email_status,
      affiliation_id: this.affiliation_id,
      affiliation_name: this.affiliation_name,
      last_login_dt: this.last_login_dt,
      cart_meta: this.cart_meta,
      card_meta: this.card_meta,
      // registration form fields
      title: this.title,
      pronoun: this.pronoun,
      affiliation_other: this.affiliation_other,
      state: this.state,
      city: this.city,
      zipcode: this.zipcode,
      country: this.country,
      mobile_number: this.mobile_number,
      communication_method: this.communication_method,
      communication_language: this.communication_language,
      heard_about: this.heard_about,
      is_subscribe: this.is_subscribe,
      accepted_term_and_conditions: this.accepted_term_and_conditions,
      organization: this.organization,

      deleted_at: this.deleted_at,
      created_by: this.created_by,
      created_at: this.created_at,
      updated_by: this.updated_by,
      updated_at: this.updated_at,
    }

    if (isUpdatePage) {
      userData['old_password'] = this.old_password
    }

    return userData
  }

  getStatuses = () => {
    return {
      active: 'Active',
      inactive: 'Inactive',
    }
  }

  getAdminRoleTypes = () => {
    return {
      developer: 'Developer',
      admin: 'Admin',
      staff: 'Staff',
    }
  }

  validate = async (isUpdatePage = false) => {
    return await validateUserForm(this.getValues(isUpdatePage), isUpdatePage)
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }

  save = async () => {
    await this.validate()

    let formValues = this.getValues()
    formValues['role'] = 'student'

    return await axios
      .post(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/users/create`, formValues)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  update = async (refId, apiToken) => {
    await this.validate(true)

    let formValues = this.getValues(true)
    formValues['role'] = 'student'

    return await axios
      .post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/users/${refId}/update`,
        formValues,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      )
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  getProfile = async () => {
    return await axios
      .get(`${server}/api/user/get-profile`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error.response.data
      })
  }
}

export default User
