import axios from 'axios'
import { server } from '../../config/server'
import * as Yup from 'yup'
class Homepage {
  fields = [
    'title',
    'buttonLabel',
    'buttonLink',
    'bannerImage',
    'bannerVideo',
    'featuredTags',
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
    buttonLabel: Yup.string()
      .max(200, 'Must be 50 characters or less')
      .required('Required'),
    buttonLink: Yup.string()
      .max(512, 'Must be 512 characters or less')
      .required('Required'),
    bannerImage: Yup.string().max(1024, 'Must be 1024 characters or less'),
    bannerVideo: Yup.string().max(1024, 'Must be 1024 characters or less'),
    featuredTags: Yup.array().max(6, 'Max 6 Tags can be selected'),
    testimonials: Yup.array(),
  }

  formSchema = {
    promo_section: {
      type: 'legend',
      title: 'Featured Promotional Section',
    },
    title: {
      type: 'text',
      name: 'title',
      label: 'Promotional Title',
    },
    buttonLabel: {
      type: 'text',
      label: 'CTA Label',
    },
    buttonLink: {
      type: 'text',
      label: 'CTA Link',
    },
    bannerImage: {
      type: 'file',
      label: 'Banner Image Link',
    },
    bannerVideo: {
      type: 'text',
      label: 'Banner Video Link',
    },
    tags_section: {
      type: 'legend',
      title: 'Featured Tags',
    },
    // tag: {
    //     type: "select",
    //     label: "Tag",
    //     options: [
    //         { "key": "yes", "value": "Yes" },
    //         { "key": "no", "value": "No" },
    //       ]
    // },
    featuredTags: {
      type: 'tags-select',
      label: 'Featured Tag (Maximum 6)',
      multi: true,
      options: [],
    },
    testimonials_section: {
      type: 'legend',
      title: 'Testimonials',
    },
    testimonials: {
      type: 'testimonials',
    },
  }
}

export default Homepage
