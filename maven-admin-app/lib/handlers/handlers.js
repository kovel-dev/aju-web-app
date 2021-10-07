import axios from 'axios'
import { server } from '../config/server'

export const getUserByRefHandler = async (refNumber) => {
  return await axios
    .post(`${server}/api/users/get-user-by-ref`, { ref: refNumber })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const processUserForm = async (url, data) => {
  /**
   * @Note: Function used either create or edit of user module
   */
  return await axios
    .post(url, data)
    .then((response) => {
      // Add success message
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getTagByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/tags/get-tag-by-ref`, { ref: refNumber })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getHostByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/hosts/get-host-by-ref`, { ref: refNumber })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getQuestionByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/questions/get-question-by-ref`, { ref: refNumber })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getPromoCodeByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/promo-codes/get-promo-code-by-ref`, { ref: refNumber })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getProductByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/products/get-product-by-ref`, { ref: refNumber })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getArticleByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/articles/get-article-by-ref`, { ref: refNumber })
    .then((response) => {
      console.log(response, 'response')
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getOrganizationByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/organizations/get-organization-by-ref`, {
      ref: refNumber,
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getContactUsByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/contact-us/get-contact-us-by-ref`, { ref: refNumber })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getNewsletterByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/newsletters/get-newsletter-by-ref`, { ref: refNumber })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getPartnerReqByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/partner-requests/get-partner-request-by-ref`, {
      ref: refNumber,
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getOrderReqByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/orders/get-order-by-ref`, {
      ref: refNumber,
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getProgramByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/products/get-product-by-ref`, {
      ref: refNumber,
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getSuggestionByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/suggestions/get-suggestion-by-ref`, {
      ref: refNumber,
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getAssetByRef = async (refNumber) => {
  return await axios
    .post(`${server}/api/assets/get-asset-by-ref`, { ref: refNumber })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}
