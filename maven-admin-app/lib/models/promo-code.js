import axios from 'axios'
import { server } from '../config/server'
import { validatePromoCodeForm } from '../validations/promo-code-validations'

class PromoCode {
  constructor(data) {
    this.name = data.name || ''
    this.description = data.description || ''
    this.code = data.code || ''
    this.status = data.status || 'active'
    this.percentage = data.percentage || ''
    this.use_limit = data.use_limit || 0
    this.use_counter = data.use_counter || 0
    this.products_meta = data.products_meta || ''
    this.organization_meta = data.organization_meta || ''
    this.is_from_checkout = data.is_from_checkout || 'no'
    this.deleted_at = data.deleted_at || ''
    this.created_at = data.created_at || ''
    this.created_by = data.created_by || ''
    this.updated_at = data.updated_at || ''
    this.updated_by = data.updated_by || ''
  }

  getValues = () => {
    return {
      name: this.name,
      description: this.description,
      code: this.code,
      status: this.status,
      percentage: this.percentage,
      use_limit: this.use_limit,
      use_counter: this.use_counter,
      products_meta: this.products_meta,
      organization_meta: this.organization_meta,
      is_from_checkout: this.is_from_checkout,
      deleted_at: this.deleted_at,
      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
    }
  }

  getStatuses = () => {
    return {
      active: 'Active',
      inactive: 'Inactive',
    }
  }

  validate = async () => {
    return await validatePromoCodeForm(this.getValues())
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }

  save = async () => {
    await this.validate()

    return await axios
      .post(`${server}/api/promo-codes/create`, this.getValues())
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  update = async (refNumber) => {
    await this.validate()

    return await axios
      .post(`${server}/api/promo-codes/${refNumber}/update`, this.getValues())
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  activate = async (refNumber) => {
    return await axios
      .post(`${server}/api/promo-codes/${refNumber}/activate`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  deactivate = async (refNumber) => {
    return await axios
      .post(`${server}/api/promo-codes/${refNumber}/deactivate`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  getList = async (pageNumber, limit) => {
    return await axios
      .get(`${server}/api/promo-codes/list?page=${pageNumber}&limit=${limit}`)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const promoCodes = []

        for (const key in data) {
          const promoCode = {
            id: key,
            name: data[key][0],
            code: data[key][1],
            status: data[key][2].toUpperCase(),
            percentage: data[key][3],
            use_limit: data[key][4],
            use_counter: data[key][5],
            products_meta: data[key][6],
            organization_meta: data[key][7],
            ref: data[key][8]['@ref']['id'],
          }

          promoCodes.push(promoCode)
        }

        return {
          data: promoCodes,
          count: count,
        }
      })
      .catch(function (error) {
        throw error
      })
  }

  getPromoCodeByRef = async (refNumber) => {
    return await axios
      .post(`${server}/api/promo-codes/get-promo-code-by-ref`, {
        ref: refNumber,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  static getSchema(isEdit) {
    return [
      {
        type: 'heading',
        title: 'Promo code Information',
        subHeading: 'This information will be used to create promo code.',
      },
      {
        type: 'textbox',
        label: 'Name',
        id: 'name',
        name: 'name',
        isRequired: true,
        width: 1,
      },
      {
        type: 'textarea',
        label: 'Description',
        id: 'description',
        name: 'description',
        isRequired: true,
        width: 1,
      },
      {
        type: 'textbox',
        label: 'code',
        id: 'code',
        name: 'code',
        isRequired: false,
        width: 1,
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
        type: 'textbox',
        label: 'Percentage',
        id: 'percentage',
        name: 'percentage',
        isRequired: false,
        width: 1,
      },
      {
        type: 'textbox',
        label: 'Use Limit',
        id: 'use_limit',
        name: 'use_limit',
        isRequired: false,
        width: 1,
      },
      {
        type: 'textbox',
        label: 'Use Counter',
        id: 'use_counter',
        name: 'use_counter',
        isRequired: false,
        width: 1,
      },
      {
        type: 'multi-select',
        subType: 'products',
        label: 'Products',
        id: 'products_meta',
        name: 'products_meta',
        isRequired: false,
        options: [],
      },
      {
        type: 'select',
        label: 'Organization',
        id: 'organization_meta',
        name: 'organization_meta',
        isRequired: false,
        options: [],
      },
      {
        type: 'form-action-buttons',
        submitLabel: isEdit ? 'Edit Promo Code' : 'Create Promo Code',
      },
    ]
  }
}

export default PromoCode
