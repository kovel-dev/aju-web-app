import axios from 'axios'
import { server } from '../config/server'
import { validateTagForm } from '../validations/tag-validations'

class Tag {
  constructor(data) {
    this.name = data.name || ''
    this.slug = data.slug || ''
    this.sub_title = data.sub_title || ''
    this.description = data.description || ''
    this.short_description = data.short_description || ''
    this.desktop_image = data.desktop_image || ''
    this.mobile_image = data.mobile_image || ''
    this.desktop_image_url = data.desktop_image_url || ''
    this.mobile_image_url = data.mobile_image_url || ''
    this.is_featured = data.is_featured || false
    this.similar_tags = data.similar_tags || ''
    this.status = data.status || 'active'
    this.type = data.type || ''

    //SEO Meta
    this.seoTitle = data.seoTitle || ''
    this.seoDesc = data.seoDesc || ''
    this.seoKeywords = data.seoKeywords || ''

    this.deleted_at = data.deleted_at || ''
    this.created_at = data.created_at || ''
    this.created_by = data.created_by || ''
    this.updated_at = data.updated_at || ''
    this.updated_by = data.updated_by || ''
  }

  getValues = () => {
    return {
      name: this.name,
      slug: this.slug,
      sub_title: this.sub_title,
      description: this.description,
      short_description: this.short_description,
      desktop_image: this.desktop_image,
      mobile_image: this.mobile_image,
      desktop_image_url: this.desktop_image_url,
      mobile_image_url: this.mobile_image_url,
      is_featured: this.is_featured,
      similar_tags: this.similar_tags,
      status: this.status,
      type: this.type,
      seoTitle: this.seoTitle || '',
      seoDesc: this.seoDesc || '',
      seoKeywords: this.seoKeywords || '',
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

  getIsFeaturedStatus = () => {
    return [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ]
  }

  validate = async () => {
    return await validateTagForm(this.getValues())
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
      .post(`${server}/api/tags/create`, this.getValues())
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
      .post(`${server}/api/tags/${refNumber}/update`, this.getValues())
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  activate = async (refNumber) => {
    return await axios
      .post(`${server}/api/tags/${refNumber}/activate`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  deactivate = async (refNumber) => {
    return await axios
      .post(`${server}/api/tags/${refNumber}/deactivate`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  getList = async (pageNumber, limit) => {
    return await axios
      .get(`${server}/api/tags/list?page=${pageNumber}&limit=${limit}`)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const tags = []

        for (const key in data) {
          const tag = {
            id: key,
            name: data[key][0],
            description: data[key][1],
            desktop_image: data[key][2],
            mobile_image: data[key][3],
            is_featured: data[key][4] ? 'YES' : 'NO',
            similar_tags: data[key][5],
            status: data[key][6].toUpperCase(),
            ref: data[key][7]['@ref']['id'],
          }

          tags.push(tag)
        }

        return {
          data: tags,
          count: count,
        }
      })
      .catch(function (error) {
        console.log(error)
        throw error
      })
  }

  getTagByRef = async (refNumber) => {
    return await axios
      .post(`${server}/api/tags/get-tag-by-ref`, { ref: refNumber })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  static getTagsForSelect = async (currentTagRef = null) => {
    return await axios
      .get(`${server}/api/tags/get-all-tags`)
      .then((response) => {
        const data = response.data
        const tags = []

        for (const key in data) {
          if (
            data[key][6] == 'active' &&
            currentTagRef !== data[key][7]['@ref']['id']
          ) {
            const tag = {
              label: data[key][0],
              value: data[key][7]['@ref']['id'],
            }

            tags.push(tag)
          }
        }

        return {
          data: tags,
        }
      })
      .catch(function (error) {
        throw error
      })
  }

  static getTagsTypeForSelect = async (currentTagRef = null, type) => {
    return await axios
      .get(`${server}/api/tags/get-all-tags`)
      .then((response) => {
        const data = response.data
        const tags = []
        for (const key in data) {
          if (
            data[key][6] == 'active' &&
            currentTagRef !== data[key][7]['@ref']['id'] &&
            data[key][8] == type
          ) {
            const tag = {
              label: data[key][0],
              value: data[key][7]['@ref']['id'],
            }

            tags.push(tag)
          }
        }

        return {
          data: tags,
        }
      })
      .catch(function (error) {
        console.log(`error`, error)
        throw error
      })
  }

  static getSchema(isEdit) {
    return [
      {
        type: 'heading',
        title: 'Tag Information',
        subHeading: 'This information will be used to create tag.',
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
        type: 'textbox',
        label: 'Slug',
        id: 'slug',
        name: 'slug',
        isRequired: true,
        width: 1,
      },
      {
        type: 'textbox',
        label: 'Sub Title',
        id: 'sub_title',
        name: 'sub_title',
        isRequired: false,
        width: 1,
      },
      {
        type: 'textbox',
        label: 'Short Description',
        id: 'short_description',
        name: 'short_description',
        isRequired: false,
        width: 1,
      },
      {
        type: 'richtexteditor',
        label: 'Description',
        id: 'description',
        name: 'description',
        isRequired: false,
        width: 1,
      },
      {
        type: 'file',
        label: 'Featured Image',
        id: 'desktop_image_url',
        name: 'desktop_image_url',
        isRequired: false,
        width: 1,
      },
      // {
      //   type: 'file',
      //   label: 'Mobile Image',
      //   id: 'mobile_image_url',
      //   name: 'mobile_image_url',
      //   isRequired: false,
      //   width: 1,
      // },
      {
        type: 'select',
        label: 'Type',
        id: 'type',
        name: 'type',
        isRequired: false,
        options: [
          { key: 'maincategory', value: 'Main Category' },
          { key: 'subcategory', value: 'Subcategory' },
        ],
      },
      {
        type: 'select',
        label: 'Featured',
        id: 'is_featured',
        name: 'is_featured',
        isRequired: true,
        options: [
          { key: 'yes', value: 'Yes' },
          { key: 'no', value: 'No' },
        ],
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
        type: 'multi-select',
        subType: 'tags',
        label: 'Similar Tags',
        id: 'similar_tags',
        name: 'similar_tags',
        isRequired: false,
        options: [],
      },
      {
        type: 'heading',
        title: 'SEO Meta',
        subHeading: 'Add SEO Data',
      },
      {
        type: 'textbox',
        label: 'SEO Title',
        id: 'seoTitle',
        name: 'seoTitle',
        isRequired: false,
        width: 1,
      },
      {
        type: 'textarea',
        label: 'SEO Description',
        id: 'seoDesc',
        name: 'seoDesc',
        isRequired: false,
        width: 1,
      },
      {
        type: 'textbox',
        label: 'SEO Keywords (comma seperated)',
        id: 'seoKeywords',
        name: 'seoKeywords',
        isRequired: false,
        width: 1,
      },
      {
        type: 'form-action-buttons',
        submitLabel: isEdit ? 'Update Tag' : 'Create Tag',
      },
    ]
  }
}

export default Tag
