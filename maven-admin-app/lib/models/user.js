import axios from 'axios'
import { query as q } from 'faunadb'
import { faunaClient } from '../../lib/config/fauna'
import { server } from '../config/server'
import { validateIndividualForm } from '../validations//frontend/individual-form-validations'
import {
  getPronouns,
  getCountries,
  getTimezones,
  getMethodOfCommunications,
  getLanguagesOfCommunication,
  getHeardAboutUsOptions,
} from '../handlers/dropdown-helpers'
import { formatOptions } from '../handlers/helper-handlers'
import { validatePartnerForm } from '../validations/frontend/partner-form-validations'
import { validateUserForm } from '../../lib/validations/user-validations'

class User {
  title
  pronoun
  first_name
  last_name
  email
  mobile_number
  #password
  #confirm_password
  #old_password
  status
  role
  state
  city
  zipcode
  country
  timezone
  org_position
  communication_method
  communication_language
  heard_about
  is_subscribe = false
  accepted_term_and_conditions = false
  is_verified = false
  is_deleted = false
  verification_date = ''
  verificaiton_token = ''
  affiliation_id = ''
  affiliation_other
  last_login_dt = ''
  reset_password_token = ''
  cart_meta = {}
  card_meta = {}
  waitlist_meta = []

  created_by = ''
  created_at = ''
  updated_by = ''
  updated_at = ''
  deleted_by = ''
  deleted_at = ''

  constructor(data) {
    this.title = data.title
    this.pronoun = data.pronoun
    this.first_name = data.first_name
    this.last_name = data.last_name
    this.email = data.email
    this.mobile_number = data.mobile_number
    this.status = data.status || 'inactive'
    this.role = data.role
    this.state = data.state
    this.city = data.city
    this.zipcode = data.zipcode
    this.country = data.country
    this.timezone = data.timezone ? data.timezone : ''
    this.org_position = data.org_position
    this.communication_method = data.communication_method
    this.communication_language = data.communication_language
    this.affiliation_other = data.affiliation_other
    this.heard_about = data.heard_about
    this.is_subscribe = data.is_subscribe === 'yes' ? 'yes' : 'no'
    this.accepted_term_and_conditions =
      data.accepted_term_and_conditions === 'yes' ? 'yes' : 'no'
    this.is_verified = data.is_verified || ''
    this.is_deleted = data.is_deleted || false
    this.verification_date = data.verification_date
      ? data.verification_date
      : ''
    this.verification_token = data.verification_token
      ? data.verification_token
      : ''
    this.affiliation_id = data.affiliation_id ? data.affiliation_id : ''
    this.affiliation_name = data.affiliation_name || ''
    this.verification_email_status = data.verification_email_status || 'pending'

    this.last_login_dt = data.last_login_dt ? data.last_login_dt : ''
    this.reset_password_token = data.reset_password_token || ''
    this.cart_meta = data.cart_meta || []
    this.card_meta = data.card_meta || []
    this.waitlist_meta = data.waitlist_meta || []

    this.created_by = data.created_by ? data.created_by : ''
    this.created_at = data.created_at ? data.created_at : ''
    this.updated_by = data.updated_by ? data.updated_by : ''
    this.updated_at = data.updated_at ? data.updated_at : ''
    this.deleted_by = data.deleted_by ? data.deleted_by : ''
    this.deleted_at = data.deleted_at ? data.deleted_at : ''
  }

  getValues = () => {
    return {
      title: this.title,
      pronoun: this.pronoun,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      mobile_number: this.mobile_number,
      status: this.status,
      role: this.role,
      state: this.state,
      city: this.city,
      zipcode: this.zipcode,
      country: this.country,
      communication_method: this.communication_method,
      communication_language: this.communication_language,
      affiliation_other: this.affiliation_other,
      heard_about: this.heard_about,
      is_subscribe: this.is_subscribe,
      accepted_term_and_conditions: this.accepted_term_and_conditions,
      timezone: this.timezone,
      org_position: this.org_position,
      is_verified: this.is_verified,
      is_deleted: this.is_deleted,
      verification_date: this.verification_date,
      verification_token: this.verification_token,
      affiliation_id: this.affiliation_id,
      affiliation_name: this.affiliation_name,
      verification_email_status: this.verification_email_status,
      last_login_dt: this.last_login_dt,
      reset_password_token: this.reset_password_token,
      card_meta: this.card_meta,
      cart_meta: this.cart_meta,
      waitlist_meta: this.waitlist_meta,

      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
      deleted_by: this.deleted_by,
      deleted_at: this.deleted_at,
    }
  }

  getPronouns = () => {
    return {
      male: 'He/Him',
      female: 'She/Her',
      they: 'They/Them',
    }
  }

  getPronounsSelect = () => {
    return [
      { key: 'male', value: 'He/Him' },
      { key: 'female', value: 'She/Her' },
      { key: 'they', value: 'They/Them' },
    ]
  }

  getCommunicationMethods = () => {
    return {
      mobile: 'Mobile',
      email: 'Email',
    }
  }

  getCommunicationMethodsSelect = () => {
    return [
      { key: 'mobile', value: 'Mobile' },
      { key: 'email', value: 'Email' },
    ]
  }

  getHeardAboutMavenMethods = () => {
    return {
      friends: 'friends',
      email: 'Email',
    }
  }

  getHeardAboutMavenMethodsSelect = () => {
    return [
      { key: 'friends', value: 'Friends' },
      { key: 'email', value: 'Email' },
    ]
  }

  // temporary array, this will have their own model
  getCountries = () => {
    return {
      cad: 'Canada',
      usa: 'United State of America',
      ind: 'India',
      ph: 'Philippines',
    }
  }

  getCountriesSelect = () => {
    return [
      { key: 'cad', value: 'Canada' },
      { key: 'usa', value: 'United State of America' },
      { key: 'ind', value: 'India' },
      { key: 'ph', value: 'Philippines' },
    ]
  }

  getTimezones = () => {
    return {
      est: 'Eastern Standard Time',
      cst: 'Central Standard Time',
      clt: 'Chile Standard Time',
      gmt: 'Greenwich Mean Time',
    }
  }

  getTimezonesSelect = () => {
    return [
      { key: 'est', value: 'Eastern Standard Time' },
      { key: 'cst', value: 'Central Standard Time' },
      { key: 'clt', value: 'Chile Standard Time' },
      { key: 'gmt', value: 'Greenwich Mean Time' },
    ]
  }

  getLanguages = () => {
    return {
      english: 'English',
      hindi: 'Hindi',
      filipino: 'Filipino',
      other: 'Other',
    }
  }

  getLanguagesSelect = () => {
    return [
      { key: 'english', value: 'English' },
      { key: 'hindi', value: 'Hindi' },
      { key: 'filipino', value: 'Filipino' },
      { key: 'other', value: 'Other' },
    ]
  }

  getPasswordHash() {
    return this.#password
  }

  setPasswordHash(hash) {
    this.#password = hash
  }

  getConfirmPasswordHash() {
    return this.#confirm_password
  }

  setConfirmPasswordHash(hash) {
    this.#confirm_password = hash
  }

  getOldPasswordHash() {
    return this.#old_password
  }

  setOldPasswordHash(hash) {
    this.#old_password = hash
  }

  static getUserByEmail = async (email) => {
    try {
      return await faunaClient
        .query(q.Get(q.Match(q.Index('users_by_email'), email)))
        .then((result) => {
          return result
        })
    } catch (error) {
      throw { key: 'general', values: error.description }
    }
  }

  static changePassword = async (newPassword, userRefId) => {
    return await axios
      .post(`${server}/api/users/changepassword`, { newPassword, userRefId })
      .then((response) => {
        return { success: true, message: response.data.message }
      })
      .catch(function () {
        return {
          success: false,
          message: 'Something went Wrong! Please try again later',
        }
      })
  }

  validateIndividualForm = async (password, confirmPassword) => {
    let updatedFormData = this.getValues()
    let hasPassword =
      password.length > 0 || confirmPassword.length > 0 ? true : false

    updatedFormData['password'] = password
    updatedFormData['confirm_password'] = confirmPassword

    return await validateIndividualForm(updatedFormData, hasPassword)
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }

  validatePartnerForm = async (password, confirmPassword) => {
    let updatedFormData = this.getValues()
    let hasPassword =
      password.length > 0 || confirmPassword.length > 0 ? true : false

    updatedFormData['password'] = password
    updatedFormData['confirm_password'] = confirmPassword

    return await validatePartnerForm(updatedFormData, hasPassword)
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }

  validate = async () => {
    let updatedFormData = this.getValues()

    return await validateUserForm(updatedFormData)
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }

  static getAdminUsersForSelect = async () => {
    return await axios
      .get(`${server}/api/users/get-admin-users`)
      .then((response) => {
        const data = response.data
        const users = []

        for (const key in data) {
          if (data[key][4] == 'active') {
            const user = {
              label: data[key][0] + ' ' + data[key][1],
              value: data[key][6]['@ref']['id'],
            }

            users.push(user)
          }
        }

        return {
          data: users,
        }
      })
      .catch((error) => {
        throw error
      })
  }

  static getPartnerUsersForSelect = async () => {
    return await axios
      .get(`${server}/api/users/get-partner-users`)
      .then((response) => {
        const data = response.data
        const users = []

        for (const key in data) {
          if (data[key][4] == 'active') {
            const user = {
              label: data[key][0] + ' ' + data[key][1],
              value: data[key][6]['@ref']['id'],
            }

            users.push(user)
          }
        }

        return {
          data: users,
        }
      })
      .catch((error) => {
        throw error
      })
  }

  static getPendingPartnerUsers = async () => {
    return await axios
      .get(`${server}/api/users/get-pending-partner-users`)
      .then((response) => {
        const data = response.data
        const users = []
        for (const key in data) {
          if (data[key][4] == 'inactive') {
            const user = {
              first_name: data[key][0],
              last_name: data[key][1],
              email: data[key][2],
              affiliation_name: data[key][6],
              ref: data[key][7]['@ref']['id'],
            }

            users.push(user)
          }
        }

        return {
          data: users,
        }
      })
      .catch((error) => {
        throw error
      })
  }

  static approvePendingPartner = async (refNumber) => {
    return await axios
      .post(`${server}/api/users/${refNumber}/update-pending-partner-users`, {
        ref: refNumber,
        type: 'approve',
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  static rejectPendingPartner = async (refNumber) => {
    return await axios
      .post(`${server}/api/users/${refNumber}/update-pending-partner-users`, {
        ref: refNumber,
        type: 'reject',
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  static getSchema(isEdit, role = 'admin', is_verified = false) {
    let roleTypes = [
      { key: 'admin', value: 'Admin' },
      { key: 'staff', value: 'Staff' },
    ]

    if (isEdit) {
      roleTypes = [
        { key: 'admin', value: 'Admin' },
        { key: 'staff', value: 'Staff' },
        { key: 'student', value: 'Student' },
        { key: 'partner', value: 'Partner' },
      ]
    }

    let schema = [
      {
        type: 'heading',
        title: 'Account Information',
        subHeading:
          'Note: Changing role from partner to admin/staff/student will remove ownership from linked organization',
      },
    ]

    if (role == 'student') {
      schema.push(
        {
          type: 'select',
          label: 'Role',
          id: 'role',
          name: 'role',
          isRequired: true,
          options: roleTypes,
        },
        {
          type: 'textbox',
          label: 'Title',
          id: 'title',
          name: 'title',
          isRequired: false,
          width: 2,
        },
        {
          type: 'select',
          label: 'Pronoun',
          id: 'pronoun',
          name: 'pronoun',
          isRequired: false,
          options: formatOptions(getPronouns()),
        },
        {
          type: 'textbox',
          label: 'Email',
          id: 'email',
          name: 'email',
          isRequired: true,
          width: 2,
        },
        {
          type: 'textbox',
          label: 'First Name',
          id: 'first_name',
          name: 'first_name',
          isRequired: true,
          width: 1,
        },
        {
          type: 'textbox',
          label: 'Last Name',
          id: 'last_name',
          name: 'last_name',
          isRequired: true,
          width: 1,
        },
        {
          type: 'textbox',
          label: 'Mobile Number',
          id: 'mobile_number',
          name: 'mobile_number',
          isRequired: false,
          width: 1,
        },
        {
          type: 'textbox',
          label: 'State',
          id: 'state',
          name: 'state',
          isRequired: false,
          width: 1,
        },
        {
          type: 'textbox',
          label: 'City',
          id: 'city',
          name: 'city',
          isRequired: false,
          width: 1,
        },
        {
          type: 'textbox',
          label: 'Zip Code',
          id: 'zipcode',
          name: 'zipcode',
          isRequired: false,
          width: 1,
        },
        {
          type: 'select',
          label: 'Country',
          id: 'country',
          name: 'country',
          isRequired: true,
          options: formatOptions(getCountries()),
        },
        {
          type: 'select',
          label: 'Time Zone',
          id: 'timezone',
          name: 'timezone',
          isRequired: true,
          options: formatOptions(getTimezones()),
        },
        {
          type: 'select',
          label: 'Method of Communication Method',
          id: 'communication_method',
          name: 'communication_method',
          isRequired: false,
          options: formatOptions(getMethodOfCommunications()),
        },
        {
          type: 'select',
          label: 'Method of Communication Language',
          id: 'communication_language',
          name: 'communication_language',
          isRequired: false,
          options: formatOptions(getLanguagesOfCommunication()),
        },
        {
          type: 'select',
          label: 'Organization',
          id: 'affiliation_id',
          name: 'affiliation_id',
          isRequired: false,
          options: [],
        },
        {
          type: 'textbox',
          label: 'Other Organization',
          id: 'affiliation_other',
          name: 'affiliation_other',
          isRequired: false,
          width: 1,
        },
        {
          type: 'select',
          label: 'How did you hear about us?',
          id: 'heard_about',
          name: 'heard_about',
          isRequired: false,
          options: formatOptions(getHeardAboutUsOptions()),
        },
        {
          type: 'select',
          label: 'Status',
          id: 'status',
          name: 'status',
          isRequired: true,
          options: [
            { key: 'active', value: 'Active' },
            { key: 'inactive', value: 'Inactive' },
          ],
        },
        {
          type: 'select',
          label: 'Subscribe',
          id: 'is_subscribe',
          name: 'is_subscribe',
          isRequired: false,
          options: [
            { key: 'yes', value: 'Yes' },
            { key: 'no', value: 'No' },
          ],
        }
      )
    } else if (role == 'partner') {
      schema.push(
        {
          type: 'select',
          label: 'Role',
          id: 'role',
          name: 'role',
          isRequired: true,
          options: roleTypes,
        },
        {
          type: 'textbox',
          label: 'Title',
          id: 'title',
          name: 'title',
          isRequired: false,
          width: 2,
        },
        {
          type: 'select',
          label: 'Pronoun',
          id: 'pronoun',
          name: 'pronoun',
          isRequired: false,
          options: formatOptions(getPronouns()),
        },
        {
          type: 'textbox',
          label: 'Email',
          id: 'email',
          name: 'email',
          isRequired: true,
          width: 2,
        },
        {
          type: 'textbox',
          label: 'First Name',
          id: 'first_name',
          name: 'first_name',
          isRequired: true,
          width: 1,
        },
        {
          type: 'textbox',
          label: 'Last Name',
          id: 'last_name',
          name: 'last_name',
          isRequired: true,
          width: 1,
        },
        {
          type: 'textbox',
          label: 'Mobile Number',
          id: 'mobile_number',
          name: 'mobile_number',
          isRequired: false,
          width: 1,
        },
        {
          type: 'select',
          label: 'Time Zone',
          id: 'timezone',
          name: 'timezone',
          isRequired: true,
          options: formatOptions(getTimezones()),
        },
        {
          type: 'textbox',
          label: 'Organization Position',
          id: 'org_position',
          name: 'org_position',
          isRequired: false,
          width: 2,
        },
        {
          type: 'select',
          label: 'How did you hear about us?',
          id: 'heard_about',
          name: 'heard_about',
          isRequired: false,
          options: formatOptions(getHeardAboutUsOptions()),
        },
        {
          type: 'select',
          label: 'Status',
          id: 'status',
          name: 'status',
          isRequired: true,
          options: [
            { key: 'active', value: 'Active' },
            { key: 'inactive', value: 'Inactive' },
          ],
        },
        {
          type: 'select',
          label: 'Subscribe',
          id: 'is_subscribe',
          name: 'is_subscribe',
          isRequired: false,
          options: [
            { key: 'yes', value: 'Yes' },
            { key: 'no', value: 'No' },
          ],
        }
      )

      if (is_verified) {
        schema.push(
          {
            type: 'heading',
            title: 'Change Linked Organization',
            subHeading:
              'Note: Changing this will removed your ownership to your existing linked organization',
          },
          {
            type: 'textbox',
            label: 'Owned Organization',
            id: 'linked_org_name',
            name: 'linked_org_name',
            isRequired: false,
            width: 2,
            disabled: true,
          },
          {
            type: 'select',
            label: 'Change Linked Organization',
            id: 'linked_org',
            name: 'linked_org',
            isRequired: false,
            options: [],
          }
        )
      }
    } else if (['staff', 'admin'].indexOf(role) > -1) {
      schema.push(
        {
          type: 'select',
          label: 'Role',
          id: 'role',
          name: 'role',
          isRequired: true,
          options: roleTypes,
        },
        {
          type: 'textbox',
          label: 'First Name',
          id: 'first_name',
          name: 'first_name',
          isRequired: true,
          width: 1,
        },
        {
          type: 'textbox',
          label: 'Last Name',
          id: 'last_name',
          name: 'last_name',
          isRequired: true,
          width: 1,
        },
        {
          type: 'textbox',
          label: 'Email',
          id: 'email',
          name: 'email',
          isRequired: true,
          width: 2,
        }
      )
    }

    schema.push({
      type: 'form-action-buttons',
      submitLabel: isEdit ? 'Edit User' : 'Create User',
    })

    return schema
  }
}

export default User
