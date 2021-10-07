import * as Yup from 'yup'
import Product from '../models/product'
import { useRouter } from 'next/router'

const today = new Date()
today.setHours(0, 0, 0, 0)

const yesterday = new Date()
yesterday.setHours(0, 0, 0, 0)
yesterday.setDate(yesterday.getDate() - 1)

// @ref: https://stackoverflow.com/questions/2227370/currency-validation
const priceRegex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/

const ProductSchema = (product, type) => {
  let yupObj = {
    name: Yup.string()
      .min(2, { key: 'name', values: 'The field is too short' })
      .max(255, { key: 'name', values: 'The field is too long' })
      .required({ key: 'name', values: 'Name is required' }),
    slug: Yup.string()
      .required({ key: 'slug', values: 'Slug is required' })
      .test(
        'unique',
        { key: 'slug', values: 'Slug should be unique' },
        async (values) => {
          let status = false
          try {
            await Product.checkSlugUniqueness(values).then((result) => {
              let isUniqueToThisProgram = true
              if (product['id'].length > 0) {
                result.map((item, index) => {
                  let id = item['@ref'].id
                  if (product['id'] !== id) {
                    isUniqueToThisProgram = false
                  }
                })
              }

              status = isUniqueToThisProgram
            })
          } catch (error) {
            console.log('slugError', error)
            status = false
          }
          return status
        }
      ),
    description: Yup.string()
      .min(2, { key: 'description', values: 'The field is too short' })
      .required({ key: 'description', values: 'Description is required' }),
    type: Yup.mixed()
      .required({ key: 'type', values: 'Type is required' })
      .oneOf(Object.keys(product.getTypes()), {
        key: 'type',
        values: 'Select type',
      }),
    deliveryType: Yup.mixed()
      .required({ key: 'deliveryType', values: 'Delivery type is required' })
      .oneOf(Object.keys(product.getDeliveryTypes()), {
        key: 'deliveryType',
        values: 'Select delivery type',
      }),
    status: Yup.mixed()
      .required({ key: 'status', values: 'Status is required' })
      .oneOf(Object.keys(product.getStatuses()), {
        key: 'status',
        values: 'Select status',
      }),
    price: Yup.string()
      .typeError({ key: 'price', values: 'Price is required' })
      .required({ key: 'price', values: 'Price is required' }),
    // .matches(priceRegex, { message: { key: "price", values: "Price is not valid" } }),
    // capacity: Yup.number()
    //   .typeError({ key: 'capacity', values: 'Capacity is required' })
    //   .required({ key: 'capacity', values: 'Capacity is required' }),
    // .positive({ key: "capacity", values: "Capacity should be positive number" })
    // .integer({ key: "capacity", values: "Capacity should be number" }),
    // level: Yup.mixed()
    //   .required({ key: 'level', values: 'Level is required' })
    //   .oneOf(Object.keys(product.getLevels()), {
    //     key: 'level',
    //     values: 'Select level',
    //   }),
  }

  // if (type == 'save') {
  //   yupObj['startDt'] = Yup.date()
  //     .typeError({ key: "startDt", values: "Start Date is required" })
  //     .min(today, { key: "startDt", values: "Start Date cannot be in the past" });
  //   yupObj['endDt'] = Yup.date()
  //     .typeError({ key: "endDt", values: "End Date is required" })
  //     .min(today, { key: "endDt", values: "End Date cannot be in the past" });
  //   yupObj['registrationStartDt'] = Yup.date()
  //     .typeError({ key: "registrationStartDt", values: "Registration Start Date is required" })
  //     //.max(yesterday, { key: "registrationStartDt", values: "Registration Start Date cannot be today or future" });
  //   yupObj['registrationEndDt'] = Yup.date()
  //     .typeError({ key: "registrationEndDt", values: "Registration End Date is required" })
  //     //.max(yesterday, { key: "registrationEndDt", values: "Registration End Date cannot be today or future" })
  //     .test({
  //       name: "registration_end_dt_range",
  //       exclusive: false,
  //       message: { key: "registrationEndDt", values: "Registration End Date must be grater than Registration Start Date"},
  //       test: function(value) {
  //         const startDate = moment(this.parent.registrationStartDt).format("YYYY-MM-DD")
  //         const endDate = moment(value).format("YYYY-MM-DD")
  //         return moment(endDate).isAfter(startDate);
  //       },
  //     })
  //     .test({
  //       name: "registration_end_dt_range1",
  //       exclusive: false,
  //       message: { key: "registration_end_dt", values: "Registration End Date must be less than End Date"},
  //       test: function(value) {
  //         const startDate = moment(this.parent.endDt).format("YYYY-MM-DD")
  //         const endDate = moment(value).format("YYYY-MM-DD")
  //         return moment(endDate).isSameOrBefore(startDate);
  //       },
  //     });
  // } else {
  //   yupObj['startDt'] = Yup.date()
  //     .typeError({ key: "startDt", values: "Start Date is required" })
  //     .test({
  //       name: "start_dt_range",
  //       exclusive: false,
  //       message: { key: "startDt", values: "Start Date cannot be in the past"},
  //       test: function(value) {
  //         const curPublishedStartDt = moment(this.parent.startDt).format("YYYY-MM-DD")
  //         const newPublishedStartDt = moment(value).format("YYYY-MM-DD")
  //         return moment(newPublishedStartDt).isSameOrAfter(curPublishedStartDt);
  //       },
  //     });
  //   yupObj['endDt'] = Yup.date()
  //     .typeError({ key: "endDt", values: "End Date is required" })
  //     .test({
  //       name: "end_dt_range",
  //       exclusive: false,
  //       message: { key: "endDt", values: "End Date cannot be in the past"},
  //       test: function(value) {
  //         const curPublishedEndDt = moment(this.parent.endDt).format("YYYY-MM-DD")
  //         const newPublishedEndDt = moment(value).format("YYYY-MM-DD")
  //         return moment(newPublishedEndDt).isSameOrAfter(curPublishedEndDt);
  //       },
  //     });
  //   yupObj['registrationStartDt'] = Yup.date()
  //     .typeError({ key: "registrationStartDt", values: "Registration Start Date is required" })
  //     //.max(yesterday, { key: "registrationStartDt", values: "Registration Start Date cannot be today or future" })
  //     .test({
  //       name: "registration_start_dt_range",
  //       exclusive: false,
  //       message: { key: "registrationStartDt", values: "Registration Start Date must be less than Publish Start Date"},
  //       test: function(value) {
  //         const publishedStartDt = moment(this.parent.startDt).format("YYYY-MM-DD")
  //         const registrationStartDt = moment(value).format("YYYY-MM-DD")
  //         return moment(registrationStartDt).isBefore(publishedStartDt);
  //       },
  //     });
  //   yupObj['registrationEndDt'] = Yup.date()
  //     .typeError({ key: "registrationEndDt", values: "Registration End Date is required" })
  //     //.max(yesterday, { key: "registrationEndDt", values: "Registration End Date cannot be today or future" })
  //     .test({
  //       name: "registration_end_dt_range",
  //       exclusive: false,
  //       message: { key: "registrationEndDt", values: "Registration End Date must be grater than Registration Start Date"},
  //       test: function(value) {
  //         const startDate = moment(this.parent.registrationStartDt).format("YYYY-MM-DD")
  //         const endDate = moment(value).format("YYYY-MM-DD")
  //         return moment(endDate).isAfter(startDate);
  //       },
  //     })
  //     .test({
  //       name: "registration_end_dt_range_1",
  //       exclusive: false,
  //       message: { key: "registrationEndDt", values: "Registration End Date must be less than Publish Start Date"},
  //       test: function(value) {
  //         const publishedStartDt = moment(this.parent.startDt).format("YYYY-MM-DD")
  //         const registrationEndDt = moment(value).format("YYYY-MM-DD")
  //         return moment(registrationEndDt).isSameOrBefore(publishedStartDt);
  //       },
  //     });
  // }

  return Yup.object().shape(yupObj)
}

export const validateProductForm = async (enteredData, type) => {
  let product = new Product(enteredData)
  product['id'] = enteredData['id']

  return await ProductSchema(product, type)
    .validate(enteredData, { abortEarly: false })
    .then(function (value) {
      return value
    })
    .catch(function (err) {
      throw err.errors
    })
}
