import axios from 'axios'
import { server } from '../../config/server'
import * as Yup from 'yup'
class Faqpage {
  fields = [
    'title',
    'bannerImage',
    'bannerVideo',
    'desfription',
    'testimonials',
  ]
  fieldValueObj = {}

  constructor(data) {
    this.fields.forEach((property) => {
      // this.property = data.property || ''
      this.fieldValueObj[property] = data[property] || ''
    })
  }

  formValidationSchema = {
    title: Yup.string()
      .max(200, 'Must be 200 characters or less')
      .required('Required'),
    bannerImage: Yup.string().max(1024, 'Must be 1024 characters or less'),
    // bannerVideo: Yup.string().max(1024, 'Must be 1024 characters or less'),
    // description: Yup.string().required('Required'),
    accountSetupDetails: Yup.array(),
    registeredUsersDetails: Yup.array(),
    paymentsDetails: Yup.array(),
    registeredPartnersDetails: Yup.array(),
  }

  formSchema = {
    promo_section: {
      type: 'legend',
      title: 'FAQ',
    },
    title: {
      type: 'text',
      name: 'title',
      label: 'Title',
    },
    bannerImage: {
      type: 'file',
      label: 'Banner Image Link',
    },
    // bannerVideo: {
    //   type: 'text',
    //   label: 'Banner Video Link',
    // },
    // description: {
    //   type: 'text',
    //   name: 'description',
    //   label: 'Description',
    // },
    accountSetupSection: {
      type: 'legend',
      title: 'Account Setup',
    },
    accountSetupDetails: {
      type: 'faq-section-details',
    },
    registeredUsersSection: {
      type: 'legend',
      title: 'For Registered Users',
    },
    registeredUsersDetails: {
      type: 'faq-section-details',
    },
    paymentsSection: {
      type: 'legend',
      title: 'Payments',
    },
    paymentsDetails: {
      type: 'faq-section-details',
    },
    registeredPartnersSection: {
      type: 'legend',
      title: 'For Partners Section',
    },
    registeredPartnersDetails: {
      type: 'faq-section-details',
    },
  }
}

export default Faqpage
