import { server } from '../config/server'
import { validateProductForm } from '../validations/product-validations'
import { getLanguagesOfCommunication } from '../handlers/dropdown-helpers'
import {
  formatOptions,
  formatWithLabelAndValueOptions,
} from '../handlers/helper-handlers'
import axios from 'axios'
import User from './user'

class Product {
  constructor(data) {
    const curDate = new Date()
    curDate.setHours(0, 0, 0)

    this.name = data.name || ''
    this.slug = data.slug || ''
    this.description = data.description || ''
    this.shortDescription = data.shortDescription || ''
    this.category = data.category || ''
    this.type = data.type || ''
    this.deliveryType = data.deliveryType || ''
    this.startDt = data.startDt || curDate
    this.endDt = data.endDt || curDate
    this.registrationStartDt = data.registrationStartDt || curDate
    this.registrationEndDt = data.registrationEndDt || curDate
    this.millisecondStartDt = data.millisecondStartDt || curDate
    this.millisecondEndDt = data.millisecondEndDt || curDate
    this.millisecondRegistrationStartDt =
      data.millisecondRegistrationStartDt || curDate
    this.millisecondRegistrationEndDt =
      data.millisecondRegistrationEndDt || curDate
    this.status = data.status || ''
    this.isFeatured = data.isFeatured || ''
    this.price = data.price || ''
    this.capacity = data.capacity || ''
    this.originalCapacity = data.originalCapacity || ''
    this.language = data.language || ''
    this.link = data.link || ''
    this.address = data.address || ''
    this.duration = data.duration || ''
    this.level = data.level || ''
    this.desktopImage = data.desktopImage || ''
    this.mobileImage = data.mobileImage || ''
    this.desktopImageUrl = data.desktopImageUrl || ''
    this.mobileImageUrl = data.mobileImageUrl || ''
    this.imageUrl = data.imageUrl || ''
    this.isReserved = data.isReserved || 'no'
    this.reservedComment = data.reservedComment || ''
    this.reservedBy = data.reservedBy || ''
    this.reservedAt = data.reservedAt || ''

    // meta fields
    this.sponsorMeta = data.sponsorMeta || ''
    this.sponsorMaterialMeta = data.sponsorMaterialMeta || ''
    this.seriesMeta = data.seriesMeta || ''
    this.ondemandMeta = data.ondemandMeta || ''
    this.hostMeta = data.hostMeta || ''
    this.tagMeta = data.tagMeta || ''
    this.subtagMeta = data.subtagMeta || ''
    this.subtagMetaString = data.subtagMetaString || ''
    this.questionMeta = data.questionMeta || ''
    this.bannerMeta = data.bannerMeta || ''
    this.hostRoleMeta = data.hostRoleMeta || ''

    //SEO Meta
    this.seoTitle = data.seoTitle || ''
    this.seoDesc = data.seoDesc || ''
    this.seoKeywords = data.seoKeywords || ''

    // misc
    this.deletedAt = data.deletedAt || ''
    this.createdBy = data.createdBy || ''
    this.createdAt = data.createdAt || ''
    this.updatedBy = data.updatedBy || ''
    this.updatedAt = data.updatedAt || ''
  }

  getValues = () => {
    return {
      name: this.name, // required
      slug: this.slug, // required
      description: this.description, // required
      shortDescription: this.shortDescription,
      category: this.category,
      type: this.type, // required
      deliveryType: this.deliveryType, // required
      startDt: this.startDt, // required
      endDt: this.endDt, // required
      registrationStartDt: this.registrationStartDt, // required
      registrationEndDt: this.registrationEndDt, // required
      millisecondStartDt: this.millisecondStartDt, // required
      millisecondEndDt: this.millisecondEndDt, // required
      millisecondRegistrationStartDt: this.millisecondRegistrationStartDt, // required
      millisecondRegistrationEndDt: this.millisecondRegistrationEndDt, // required
      status: this.status, // required
      isFeatured: this.isFeatured, // required
      price: this.price, // required
      capacity: this.capacity, // required
      originalCapacity: this.originalCapacity,
      language: this.language,
      link: this.link,
      address: this.address,
      duration: this.duration,
      level: this.level, // required
      desktopImage: this.desktopImage,
      mobileImage: this.mobileImage,
      desktopImageUrl: this.desktopImageUrl,
      mobileImageUrl: this.mobileImageUrl,
      imageUrl: this.imageUrl,
      isReserved: this.isReserved,
      reservedBy: this.reservedBy,
      reservedAt: this.reservedAt,
      reservedComment: this.reservedComment,
      sponsorMeta: this.sponsorMeta,
      sponsorMaterialMeta: this.sponsorMaterialMeta,
      seriesMeta: this.seriesMeta,
      ondemandMeta: this.ondemandMeta,
      hostMeta: this.hostMeta,
      tagMeta: this.tagMeta,
      subtagMeta: this.subtagMeta,
      subtagMetaString: this.subtagMetaString,
      questionMeta: this.questionMeta,
      bannerMeta: this.bannerMeta,
      hostRoleMeta: this.hostRoleMeta,
      seoTitle: this.seoTitle || '',
      seoDesc: this.seoDesc || '',
      seoKeywords: this.seoKeywords || '',
      deletedAt: this.deletedAt,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedBy: this.updatedBy,
      updatedAt: this.updatedAt,
    }
  }

  getStatuses = () => {
    return {
      draft: 'Draft',
      published: 'Published',
      unpublished: 'Unpublished',
      archived: 'Archived',
    }
  }

  getTypes = () => {
    return {
      class: 'Class',
      event: 'Event',
      series: 'Series',
      'on-demand': 'On Demand',
    }
  }

  getDeliveryTypes = () => {
    return {
      'in-person': 'In Person',
      virtual: 'Virtual',
      'on-demand': 'On Demand',
    }
  }

  getLevels = () => {
    return {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    }
  }

  validate = async (type, id = '') => {
    let data = this.getValues()
    data['id'] = id

    return await validateProductForm(data, type)
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }

  save = async () => {
    await this.validate('save')

    return await axios
      .post(`${server}/api/products/create`, this.getValues())
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  }

  update = async (refNumber) => {
    await this.validate('update', refNumber)

    return await axios
      .post(`${server}/api/products/${refNumber}/edit`, this.getValues())
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error
      })
  }

  getList = async (pageNumber, limit) => {
    return await axios
      .get(`${server}/api/products/list?page=${pageNumber}&limit=${limit}`)
      .then((response) => {
        const data = response.data.result.data
        const count = response.data.count
        const products = []

        for (const key in data) {
          const product = {
            id: key,
            name: data[key][0],
            type: data[key][1].toUpperCase(),
            delivery_type: data[key][2].toUpperCase(),
            status: data[key][3].toUpperCase(),
            level: data[key][4].toUpperCase(),
            start_dt: data[key][5],
            end_dt: data[key][6],
            reg_start_dt: data[key][7],
            reg_end_dt: data[key][8],
            ref: data[key][9]['@ref']['id'],
          }

          products.push(product)
        }

        return {
          data: products,
          count: count,
        }
      })
      .catch(function (error) {
        throw error
      })
  }

  getProductByRef = async (refNumber) => {
    return await axios
      .post(`${server}/api/products/get-product-by-ref`, { ref: refNumber })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  static checkSlugUniqueness = async (slug) => {
    return await axios
      .post(`${server}/api/products/check-slug`, { slug: slug })
      .then((response) => {
        return response.data
      })
      .catch(function (error) {
        throw error
      })
  }

  static getProductsForSelect = async () => {
    return await axios
      .get(`${server}/api/products/get-all-products`)
      .then((response) => {
        const data = response.data
        const products = []

        for (const key in data) {
          if (data[key][3] == 'published') {
            const product = {
              label: data[key][0],
              value: data[key][9]['@ref']['id'],
            }

            products.push(product)
          }
        }

        return {
          data: products,
        }
      })
      .catch(function (error) {
        throw error
      })
  }

  static async getSchema(isEdit, isCopy = false) {
    return [
      {
        type: 'heading',
        title: 'Product Information',
        subHeading: 'This information will be used to create product.',
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
        type: 'textarea',
        label: 'Short Description',
        id: 'shortDescription',
        name: 'shortDescription',
        isRequired: true,
        width: 1,
      },
      {
        type: 'richtexteditor',
        label: 'Description',
        id: 'description',
        name: 'description',
        isRequired: true,
        width: 1,
      },

      // {
      //   type: "select",
      //   label: "Category",
      //   id: "category",
      //   name: "category",
      //   isRequired: true,
      //   options: [
      //     { "key": "hebrew", "value": "Hebrew" },
      //     { "key": "current-affairs", "value": "Current Affairs" },
      //     { "key": "jewish-thought", "value": "Jewish Thought" },
      //     { "key": "literature", "value": "Literature" },
      //     { "key": "art-and-art-history", "value": "Art and Art history" },
      //     { "key": "culture-and-media", "value": "Culture and Media" },
      //   ]
      // },
      {
        type: 'select',
        label: 'Status',
        id: 'status',
        name: 'status',
        isRequired: true,
        options: [
          { key: 'draft', value: 'Draft' },
          { key: 'published', value: 'Published' },
          // { "key": "Unpublished", "value": "Unpublished" },
          { key: 'archived', value: 'Archived' },
        ],
      },
      {
        type: 'select',
        label: 'Featured',
        id: 'isFeatured',
        name: 'isFeatured',
        isRequired: true,
        options: [
          { key: 'no', value: 'No' },
          { key: 'yes', value: 'Yes' },
        ],
      },
      {
        type: 'select',
        label: 'Delivery Type',
        id: 'deliveryType',
        name: 'deliveryType',
        isRequired: true,
        options: [
          { key: 'in-person', value: 'In Person' },
          { key: 'virtual', value: 'Virtual' },
          { key: 'on-demand', value: 'On Demand' },
        ],
      },
      // {
      //   type: "select",
      //   label: "Category",
      //   id: "category",
      //   name: "category",
      //   isRequired: true,
      //   options: [
      //     { "key": "hebrew", "value": "Hebrew" },
      //     { "key": "current-affairs", "value": "Current Affairs" },
      //     { "key": "jewish-thought", "value": "Jewish Thought" },
      //     { "key": "literature", "value": "Literature" },
      //     { "key": "art-and-art-history", "value": "Art and Art history" },
      //     { "key": "culture-and-media", "value": "Culture and Media" },
      //   ]
      // },
      {
        type: 'textbox',
        label: 'Class/Event/OnDemand Link (Zoom/cloudinary)',
        id: 'link',
        name: 'link',
        isRequired: false,
        width: 1,
      },
      {
        type: 'textbox',
        label: 'Physical Address',
        id: 'address',
        name: 'address',
        isRequired: false,
        width: 1,
      },
      {
        type: 'select',
        label: 'Program Type',
        id: 'type',
        name: 'type',
        isRequired: true,
        options: [
          { key: 'class', value: 'Class' },
          { key: 'event', value: 'Event' },
          { key: 'series', value: 'Series' },
          { key: 'on-demand', value: 'OnDemand' },
        ],
      },
      {
        type: 'heading',
        title: 'Program Dates',
        subHeading: 'This information will be used to manage program dates.',
      },
      {
        type: 'datetime',
        label: 'Program Start Date and Time (PT)',
        id: 'startDt',
        name: 'startDt',
        isRequired: false,
        width: 1,
        conditionField: 'type',
        conditionFalseValue: 'on-demand',
      },
      {
        type: 'datetime',
        label: 'Program End Date and Time (PT)',
        id: 'endDt',
        name: 'endDt',
        isRequired: false,
        width: 1,
        conditionField: 'type',
        conditionFalseValue: 'on-demand',
      },
      {
        type: 'datetime',
        label: 'Sales Start Date and Time (PT)',
        id: 'registrationStartDt',
        name: 'registrationStartDt',
        isRequired: false,
        width: 1,
      },
      {
        type: 'datetime',
        label: 'Sales End Date and Time (PT)',
        id: 'registrationEndDt',
        name: 'registrationEndDt',
        isRequired: false,
        width: 1,
      },
      {
        type: 'heading',
        title: 'Inventory and Pricing',
        subHeading:
          'This information will be used to manage capacity and pricing.',
      },
      {
        type: 'number',
        label: 'Price (USD)',
        id: 'price',
        name: 'price',
        isRequired: true,
        width: 1,
      },
      {
        type: 'number',
        label: 'Capacity',
        id: 'capacity',
        name: 'capacity',
        isRequired: false,
        width: 1,
        conditionField: 'type',
        conditionFalseValue: 'on-demand',
      },
      {
        type: 'number',
        label: 'Original Capacity',
        id: 'originalCapacity',
        name: 'originalCapacity',
        isRequired: false,
        width: 1,
        conditionField: 'type',
        conditionFalseValue: 'on-demand',
      },
      {
        type: 'heading',
        title: 'Additional Data',
        subHeading: '',
      },
      {
        type: 'select',
        label: 'Language',
        id: 'language',
        name: 'language',
        isRequired: false,
        options: formatOptions(getLanguagesOfCommunication()),
      },
      // {
      //   type: 'textbox',
      //   label: 'Duration',
      //   id: 'duration',
      //   name: 'duration',
      //   isRequired: false,
      //   width: 1,
      // },
      {
        type: 'select',
        label: 'Level',
        id: 'level',
        name: 'level',
        isRequired: false,
        options: [
          { key: 'beginner', value: 'Beginner' },
          { key: 'intermediate', value: 'Intermediate' },
          { key: 'advanced', value: 'Advanced' },
        ],
        conditionField: 'type',
        conditionFalseValue: 'on-demand',
      },
      // {
      //   type: "file",
      //   label: "Program Thumbnail/Hero Image",
      //   id: "desktopImageurl",
      //   name: "desktopimageurl",
      //   isRequired: false,
      //   width: 1,
      // },
      {
        type: 'file',
        label: 'Image',
        id: 'imageUrl',
        name: 'imageUrl',
        isRequired: false,
        width: 1,
      },
      {
        type: 'multi-select',
        subType: 'Main tags',
        label: 'Main Tag(s)',
        id: 'tagMeta',
        name: 'tagMeta',
        isRequired: false,
        options: [],
      },
      {
        type: 'multi-select',
        subType: 'Sub tags',
        label: 'Sub Tag(s)',
        id: 'subtagMeta',
        name: 'subtagMeta',
        isRequired: false,
        options: [],
      },
      {
        type: 'multi-select',
        subType: 'questions',
        label: 'Question(s)',
        id: 'questionMeta',
        name: 'questionMeta',
        isRequired: false,
        options: [],
      },
      // {
      //   type: 'multi-select',
      //   subType: 'hosts',
      //   label: 'Host(s)',
      //   id: 'hostMeta',
      //   name: 'hostMeta',
      //   isRequired: false,
      //   options: [],
      // },
      {
        type: 'multi-select',
        subType: 'sponsors',
        label: 'Sponsor(s)',
        id: 'sponsorMeta',
        name: 'sponsorMeta',
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
        type: 'heading',
        title: 'Host Role',
        subHeading: 'Host Role',
      },
      {
        type: 'hiddenStatic',
        subType: 'hostRoleMeta',
      },
      {
        type: 'heading',
        title: 'Sponsorship',
        subHeading: 'Sponsorship banners',
      },
      {
        type: 'hidden',
        subType: 'bannerMeta',
      },
      {
        type: 'heading',
        title: 'Sponsorship Material',
        subHeading: 'Sponsorship Material',
      },
      {
        type: 'hidden',
        subType: 'sponsorMaterialMeta',
        showPDF: true,
      },
      {
        type: 'heading',
        title: 'Partner Reservation',
        subHeading: 'Partner Reservation',
      },
      {
        type: 'select',
        label: 'Reserved',
        id: 'isReserved',
        name: 'isReserved',
        isRequired: false,
        options: [
          { key: 'no', value: 'No' },
          { key: 'yes', value: 'Yes' },
        ],
      },
      {
        type: 'select',
        label: 'Reserved By',
        id: 'reservedBy',
        name: 'reservedBy',
        isRequired: false,
        options: formatWithLabelAndValueOptions(
          await User.getPartnerUsersForSelect()
        ),
      },
      {
        type: 'textarea',
        label: 'Comment about who reserved it',
        id: 'reservedComment',
        name: 'reservedComment',
        isRequired: false,
        width: 1,
      },
      {
        type: 'form-action-buttons',
        submitLabel: isEdit
          ? isCopy
            ? 'Copy Program'
            : 'Update Program'
          : 'Create Program',
      },
    ]
  }
}

export default Product
